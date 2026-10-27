/**
 * Real channel analytics for the dashboard.
 *
 * Sources (both optional, configured purely via ENV — nothing is read from
 * the pipeline filesystem, so this works identically in local and web mode):
 *
 * - YouTube: YT_TOKENS_JSON — the OAuth token JSON as a string
 *   ({client_id, client_secret, refresh_token, access_token?, expiry_date?},
 *   the same shape the pipeline's youtube-tokens.json uses). The access token
 *   is refreshed in memory when expired; the env value is never written back.
 * - Meta: META_PAGE_TOKEN, with optional META_PAGE_ID / META_IG_USER_ID /
 *   META_GRAPH_VERSION (default v21.0).
 *
 * Results are cached in memory for 10 minutes. Failures are reported per
 * source in `errors` — the route never throws and never leaks stack traces.
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
  configured: {youtube: boolean; meta: boolean};
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
let cache: {at: number; result: AnalyticsResult} | null = null;
let refreshedAccessToken: {value: string; expiry: number} | null = null;

function parseYtTokens(): YtTokens | null {
  const raw = process.env.YT_TOKENS_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as YtTokens;
    if (parsed.client_id && parsed.client_secret && parsed.refresh_token) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function youtubeAccessToken(tokens: YtTokens): Promise<string> {
  const now = Date.now();
  if (refreshedAccessToken && refreshedAccessToken.expiry > now + 60_000) {
    return refreshedAccessToken.value;
  }
  if (tokens.access_token && (tokens.expiry_date ?? 0) > now + 120_000) {
    return tokens.access_token;
  }
  const cred = tokens;
  const form = new URLSearchParams();
  form.set("client_id", cred.client_id);
  form.set("client_secret", cred.client_secret);
  form.set("refresh_token", cred.refresh_token);
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
  refreshedAccessToken = {
    value: freshToken,
    expiry: now + (data.expires_in ?? 3600) * 1000,
  };
  return freshToken;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function fetchYouTube(tokens: YtTokens): Promise<NonNullable<AnalyticsResult["youtube"]>> {
  const accessToken = await youtubeAccessToken(tokens);
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

async function fetchMeta(): Promise<NonNullable<AnalyticsResult["meta"]>> {
  const token = process.env.META_PAGE_TOKEN as string;
  const version = process.env.META_GRAPH_VERSION || "v21.0";
  const base = `https://graph.facebook.com/${version}`;
  const authed = (url: string) => url + "&access_token=" + encodeURIComponent(token);
  const out: NonNullable<AnalyticsResult["meta"]> = {};

  const pageId = process.env.META_PAGE_ID?.trim().replace(/^\uFEFF/, "");
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

  // Instagram: explicit ID wins, otherwise discover via the page.
  let igId = process.env.META_IG_USER_ID?.trim().replace(/^\uFEFF/, "");
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

export async function getAnalytics(force = false): Promise<AnalyticsResult> {
  const now = Date.now();
  if (!force && cache && now - cache.at < CACHE_TTL_MS) {
    return {...cache.result, cached: true};
  }

  const ytTokens = parseYtTokens();
  const metaConfigured = Boolean(process.env.META_PAGE_TOKEN);
  const result: AnalyticsResult = {
    configured: {youtube: Boolean(ytTokens), meta: metaConfigured},
    errors: [],
    fetchedAt: new Date().toISOString(),
    cached: false,
  };

  if (ytTokens) {
    try {
      result.youtube = await fetchYouTube(ytTokens);
    } catch (e) {
      result.errors.push({
        source: "youtube",
        message: e instanceof Error ? e.message : "YouTube analytics fetch failed",
      });
    }
  }
  if (metaConfigured) {
    try {
      result.meta = await fetchMeta();
    } catch (e) {
      result.errors.push({
        source: "meta",
        message: e instanceof Error ? e.message : "Meta analytics fetch failed",
      });
    }
  }

  cache = {at: now, result};
  return result;
}
