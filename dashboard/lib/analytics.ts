/**
 * Real channel analytics for the dashboard.
 * Supports multi-channel architecture:
 * - A Day Back Then (Global)
 * - Kwentong Pinoy: Lore & History (Philippine Lore)
 * - Genesis to Glory (Faith & History - Standby)
 */

type YtTokens = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  access_token?: string;
  expiry_date?: number;
};

export type AnalyticsError = {source: "youtube" | "meta"; message: string};

export type AnalyticsResult = {
  channel: string;
  configured: {youtube: boolean; meta: boolean};
  day0Baseline?: {
    recordedAt: string;
    subscribers: number;
    totalViews: number;
    videoCount: number;
    notes: string;
  };
  youtube?: {
    channelTitle: string;
    subscribers: number;
    totalViews: number;
    videoCount: number;
    last28Days: {
      views: number;
      watchMinutes: number;
      watchHours: number;
      avgViewDurationSec: number;
      subsGained: number;
      subsLost: number;
      subsDelta: number;
      likes: number;
      comments: number;
      shares: number;
    };
    topVideos: {
      id: string;
      title: string;
      views: number;
      watchMinutes: number;
      watchHours: number;
      avgViewDurationSec: number;
    }[];
  };
  meta?: {
    pageName?: string;
    fbFollowers?: number;
    igUsername?: string;
    igFollowers?: number;
  };
  errors: AnalyticsError[];
  fetchedAt: string;
  cached: boolean;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const caches = new Map<string, {at: number; result: AnalyticsResult}>();
const refreshedTokens = new Map<string, {value: string; expiry: number}>();

function parseYtTokens(channel: string): YtTokens | null {
  const norm = channel.toLowerCase();
  let raw: string | undefined;

  if (norm === "kwentong-pinoy" || norm === "ph" || norm === "filipino") {
    raw = process.env.YT_TOKENS_JSON_KWENTONG_PINOY || process.env.YT_TOKENS_JSON;
  } else if (norm === "genesis-to-glory" || norm === "bible") {
    raw = process.env.YT_TOKENS_JSON_GENESIS;
  } else {
    raw = process.env.YT_TOKENS_JSON;
  }

  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as YtTokens;
    if (parsed.client_id && parsed.client_secret && parsed.refresh_token) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function youtubeAccessToken(channel: string, tokens: YtTokens): Promise<string> {
  const now = Date.now();
  const cached = refreshedTokens.get(channel);
  if (cached && cached.expiry > now + 60_000) {
    return cached.value;
  }
  if (tokens.access_token && (tokens.expiry_date ?? 0) > now + 120_000) {
    return tokens.access_token;
  }
  const form = new URLSearchParams();
  form.set("client_id", tokens.client_id);
  form.set("client_secret", tokens.client_secret);
  form.set("refresh_token", tokens.refresh_token);
  form.set("grant_type", "refresh_token");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: form,
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(`token refresh failed (${res.status}${data.error ? `: ${data.error}` : ""})`);
  }
  const freshToken = data.access_token;
  refreshedTokens.set(channel, {
    value: freshToken,
    expiry: now + (data.expires_in ?? 3600) * 1000,
  });
  return freshToken;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function fetchYouTube(channel: string, tokens: YtTokens): Promise<NonNullable<AnalyticsResult["youtube"]>> {
  const accessToken = await youtubeAccessToken(channel, tokens);
  const auth = {Authorization: `Bearer ${accessToken}`};
  const end = new Date();
  const start = new Date(end.getTime() - 28 * 24 * 3600 * 1000);
  const range = `startDate=${isoDate(start)}&endDate=${isoDate(end)}`;

  // Channel totals + identity (Data API)
  const chRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    {headers: auth},
  );
  if (!chRes.ok) throw new Error(`channels.list failed (${chRes.status})`);
  const chData = (await chRes.json()) as any;
  const item = chData.items?.[0];
  if (!item) throw new Error("channels.list returned no channel for this token");

  // 28-day totals (Analytics API)
  const totalsRes = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&${range}` +
      `&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares`,
    {headers: auth},
  );
  if (!totalsRes.ok) throw new Error(`analytics totals report failed (${totalsRes.status})`);
  const totalsData = (await totalsRes.json()) as any;
  const row: number[] = totalsData.rows?.[0] ?? [0, 0, 0, 0, 0, 0, 0, 0];
  const [
    views,
    watchMinutes,
    avgViewDurationSec,
    subsGained,
    subsLost,
    likes,
    comments,
    shares,
  ] = row.map((n) => Number(n) || 0);

  // Top videos by watch time (Analytics API), titles via Data API
  let topVideos: NonNullable<AnalyticsResult["youtube"]>["topVideos"] = [];
  const topRes = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&${range}` +
      `&metrics=views,estimatedMinutesWatched,averageViewDuration&dimensions=video` +
      `&sort=-estimatedMinutesWatched&maxResults=10`,
    {headers: auth},
  );
  if (topRes.ok) {
    const topData = (await topRes.json()) as any;
    const rows: any[][] = topData.rows ?? [];
    const ids = rows.map((r) => String(r[0]));
    const titles = new Map<string, string>();
    if (ids.length) {
      const vRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(",")}`,
        {headers: auth},
      );
      if (vRes.ok) {
        const vData = (await vRes.json()) as any;
        for (const v of vData.items ?? []) titles.set(v.id, v.snippet?.title ?? v.id);
      }
    }
    topVideos = rows.map((r) => ({
      id: String(r[0]),
      title: titles.get(String(r[0])) ?? String(r[0]),
      views: Number(r[1]) || 0,
      watchMinutes: Number(r[2]) || 0,
      watchHours: Math.round(((Number(r[2]) || 0) / 60) * 10) / 10,
      avgViewDurationSec: Number(r[3]) || 0,
    }));
  }

  const stats = item.statistics ?? {};
  return {
    channelTitle: item.snippet?.title ?? "",
    subscribers: Number(stats.subscriberCount) || 0,
    totalViews: Number(stats.viewCount) || 0,
    videoCount: Number(stats.videoCount) || 0,
    last28Days: {
      views,
      watchMinutes,
      watchHours: Math.round((watchMinutes / 60) * 10) / 10,
      avgViewDurationSec,
      subsGained,
      subsLost,
      subsDelta: subsGained - subsLost,
      likes,
      comments,
      shares,
    },
    topVideos,
  };
}

async function fetchMeta(channel: string): Promise<NonNullable<AnalyticsResult["meta"]>> {
  const norm = channel.toLowerCase();
  let token: string | undefined;
  let pageId: string | undefined;
  let igId: string | undefined;

  if (norm === "kwentong-pinoy" || norm === "ph" || norm === "filipino") {
    token = process.env.META_PAGE_TOKEN_KWENTONG_PINOY || process.env.META_PAGE_TOKEN;
    pageId = process.env.META_PAGE_ID_KWENTONG_PINOY || "1426725153855187";
  } else if (norm === "genesis-to-glory" || norm === "bible") {
    token = process.env.META_PAGE_TOKEN_GENESIS;
    pageId = "1377325175473160";
  } else {
    token = process.env.META_PAGE_TOKEN;
    pageId = process.env.META_PAGE_ID?.trim().replace(/^\uFEFF/, "");
    igId = process.env.META_IG_USER_ID?.trim().replace(/^\uFEFF/, "");
  }

  if (!token) return {};

  const version = process.env.META_GRAPH_VERSION || "v21.0";
  const base = `https://graph.facebook.com/${version}`;
  const authed = (url: string) => url + (url.includes("?") ? "&" : "?") + "access_token=" + encodeURIComponent(token!);
  const out: NonNullable<AnalyticsResult["meta"]> = {};

  const pagePath = pageId ? `/${pageId}` : "/me";
  const pageRes = await fetch(
    authed(`${base}${pagePath}?fields=name,followers_count,fan_count`),
  );
  const pageData = (await pageRes.json().catch(() => ({}))) as any;
  if (!pageRes.ok) {
    throw new Error(
      `page lookup failed (${pageRes.status}${pageData?.error?.message ? `: ${pageData.error.message}` : ""})`,
    );
  }
  out.pageName = pageData.name;
  out.fbFollowers =
    typeof pageData.followers_count === "number"
      ? pageData.followers_count
      : typeof pageData.fan_count === "number"
        ? pageData.fan_count
        : undefined;

  // Instagram: discover via page if not set
  if (!igId && (pageId || pageData.id)) {
    try {
      const linkRes = await fetch(
        authed(`${base}/${pageId ?? pageData.id}?fields=instagram_business_account{id}`),
      );
      const linkData = (await linkRes.json().catch(() => ({}))) as any;
      igId = linkData?.instagram_business_account?.id;
    } catch {
      /* IG discovery is best-effort */
    }
  }
  if (igId) {
    const igRes = await fetch(
      authed(`${base}/${igId}?fields=username,followers_count`),
    );
    const igData = (await igRes.json().catch(() => ({}))) as any;
    if (igRes.ok) {
      out.igUsername = igData.username;
      out.igFollowers = igData.followers_count;
    }
  }
  return out;
}

export async function getAnalytics(channel = "kwentong-pinoy", force = false): Promise<AnalyticsResult> {
  const norm = channel.toLowerCase();
  const now = Date.now();
  const cached = caches.get(norm);
  if (!force && cached && now - cached.at < CACHE_TTL_MS) {
    return {...cached.result, cached: true};
  }

  const ytTokens = parseYtTokens(norm);
  const metaConfigured = Boolean(
    norm === "kwentong-pinoy"
      ? process.env.META_PAGE_TOKEN_KWENTONG_PINOY || process.env.META_PAGE_TOKEN
      : process.env.META_PAGE_TOKEN
  );

  const result: AnalyticsResult = {
    channel: norm,
    configured: {youtube: Boolean(ytTokens), meta: metaConfigured},
    errors: [],
    fetchedAt: new Date().toISOString(),
    cached: false,
  };

  if (norm === "kwentong-pinoy") {
    result.day0Baseline = {
      recordedAt: "2026-10-31",
      subscribers: 5,
      totalViews: 2560,
      videoCount: 3,
      notes: "Wave A Launch Trio Baseline (Manila Film Center, Diplomat Hotel, Balete Drive)"
    };
  }

  if (ytTokens) {
    try {
      result.youtube = await fetchYouTube(norm, ytTokens);
    } catch (e) {
      result.errors.push({
        source: "youtube",
        message: e instanceof Error ? e.message : "YouTube analytics fetch failed",
      });
    }
  }
  if (metaConfigured) {
    try {
      result.meta = await fetchMeta(norm);
    } catch (e) {
      result.errors.push({
        source: "meta",
        message: e instanceof Error ? e.message : "Meta analytics fetch failed",
      });
    }
  }

  caches.set(norm, {at: now, result});
  return result;
}
