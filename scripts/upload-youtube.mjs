#!/usr/bin/env node
/**
 * YouTube Shorts Uploader & Channel Authenticator
 *
 * Usage:
 *   1) One-time authorization:
 *      npm run upload:auth
 *      (or node scripts/upload-youtube.mjs --auth)
 *
 *   2) Upload a rendered video:
 *      npm run upload -- sample-roman-morning
 *      npm run upload -- roman-toilets --privacy unlisted
 *      npm run upload -- roman-toilets --schedule "2026-10-10T23:00:00Z"
 *
 * Options:
 *   --privacy <private|unlisted|public>  (default: private)
 *   --schedule <ISO-8601-date>           (e.g. 2026-10-10T14:00:00Z, sets privacy to private + scheduled)
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {execSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientSecretPath = path.join(root, "client_secret.json");
const tokenPath = path.join(root, "youtube-tokens.json");

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
];
const PORT = 8085;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

function getClientCredentials() {
  if (!fs.existsSync(clientSecretPath)) {
    console.error("Missing client_secret.json in project root. Please ensure it exists.");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(clientSecretPath, "utf8"));
  const creds = raw.installed || raw.web;
  if (!creds || !creds.client_id || !creds.client_secret) {
    console.error("Invalid client_secret.json format. Expected 'installed' or 'web' with client_id and client_secret.");
    process.exit(1);
  }
  return {
    clientId: creds.client_id,
    clientSecret: creds.client_secret,
  };
}

/**
 * Starts a local HTTP server and opens browser for OAuth2 authorization.
 */
export async function authenticate() {
  const {clientId, clientSecret} = getClientCredentials();

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
    }).toString();

  console.log("\n========================================================");
  console.log("   YouTube Channel Authorization");
  console.log("========================================================\n");
  console.log("Opening your browser to authorize your YouTube channel...\n");
  console.log("If it doesn't open automatically, open this link:\n");
  console.log(authUrl + "\n");

  // Attempt to open default browser on Windows/mac/linux
  try {
    if (process.platform === "win32") {
      execSync(`start "" "${authUrl}"`);
    } else if (process.platform === "darwin") {
      execSync(`open "${authUrl}"`);
    } else {
      execSync(`xdg-open "${authUrl}"`);
    }
  } catch {
    // If auto-open fails, URL is already printed above
  }

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
        if (reqUrl.pathname !== "/oauth2callback") {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }

        const code = reqUrl.searchParams.get("code");
        const error = reqUrl.searchParams.get("error");

        if (error) {
          res.writeHead(400, {"Content-Type": "text/html; charset=utf-8"});
          res.end(`<h2>Authorization Error:</h2><p>${error}</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (!code) {
          res.writeHead(400);
          res.end("Missing code");
          return;
        }

        // Exchange code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
          }),
        });

        if (!tokenRes.ok) {
          const errText = await tokenRes.text();
          res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
          res.end(`<h2>Token exchange failed</h2><pre>${errText}</pre>`);
          server.close();
          reject(new Error(`Token exchange error: ${errText}`));
          return;
        }

        const tokens = await tokenRes.json();
        const stored = {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: tokens.refresh_token,
          access_token: tokens.access_token,
          expiry_date: Date.now() + (tokens.expires_in || 3600) * 1000,
        };

        fs.writeFileSync(tokenPath, JSON.stringify(stored, null, 2));

        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(`
          <div style="font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1 style="color:#10b981;">YouTube Channel Connected!</h1>
            <p>You can close this tab and return to your terminal.</p>
          </div>
        `);

        server.close();
        console.log("\nSuccess! Tokens saved to youtube-tokens.json.");
        resolve(stored);
      } catch (err) {
        server.close();
        reject(err);
      }
    });

    server.listen(PORT, () => {
      console.log(`Waiting for browser authorization on http://localhost:${PORT}...`);
    });
  });
}

/**
 * Gets a fresh access token from stored tokens, refreshing if necessary.
 */
async function getAccessToken() {
  if (!fs.existsSync(tokenPath)) {
    console.log("No YouTube credentials found. Launching authorization flow...");
    await authenticate();
  }

  const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

  // Check if token expires within 2 minutes
  if (!tokens.access_token || Date.now() >= (tokens.expiry_date || 0) - 120000) {
    if (!tokens.refresh_token) {
      console.log("Refresh token missing. Re-authenticating...");
      return (await authenticate()).access_token;
    }

    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams({
        client_id: tokens.client_id,
        client_secret: tokens.client_secret,
        refresh_token: tokens.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!refreshRes.ok) {
      console.warn("Failed to refresh token. Re-authenticating...");
      return (await authenticate()).access_token;
    }

    const refreshed = await refreshRes.json();
    tokens.access_token = refreshed.access_token;
    tokens.expiry_date = Date.now() + (refreshed.expires_in || 3600) * 1000;
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
  }

  return tokens.access_token;
}
export function getNextOptimalSchedule() {
  const now = new Date();
  // US Peak viewing windows in Philippine Time (UTC+8):
  // Window 1: 7:00 AM PHT (23:00 UTC previous day / 7:00 PM US Eastern)
  // Window 2: 1:00 AM PHT (17:00 UTC previous day / 1:00 PM US Eastern)
  const candidates = [];
  for (let dayOffset = 0; dayOffset <= 2; dayOffset++) {
    const base = new Date(now);
    base.setUTCDate(base.getUTCDate() + dayOffset);

    // 17:00 UTC = 1:00 AM PHT / 1:00 PM EST
    const slot1 = new Date(base);
    slot1.setUTCHours(17, 0, 0, 0);

    // 23:00 UTC = 7:00 AM PHT / 7:00 PM EST
    const slot2 = new Date(base);
    slot2.setUTCHours(23, 0, 0, 0);

    candidates.push(slot1, slot2);
  }

  // Must be at least 60 minutes in the future
  const minTime = now.getTime() + 60 * 60 * 1000;
  const next = candidates.find((c) => c.getTime() >= minTime) || candidates[candidates.length - 1];
  return next.toISOString();
}

/**
 * Generates SEO-optimized title, description, and tags for Shorts or Long-Form.
 */
function buildMetadata(script, slug, scheduleTime, explicitPrivacy, isLong = false) {
  const cleanSlug = slug.replace(/^long-/, "");

  if (isLong) {
    // 1. Longform Title: Pick primary title (no #shorts tag)
    let title = (script.titleOptions && script.titleOptions[0]) || script.title || script.hook || cleanSlug.replace(/-/g, " ");
    if (title.length > 95) {
      title = title.slice(0, 95) + "...";
    }

    // 2. Load pre-generated description with timestamped chapters if available
    const descCandidates = [
      path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${cleanSlug}.description.txt`),
      path.join(root, "out", "Longform", "1 - Published", `long-${cleanSlug}.description.txt`),
      path.join(root, "out", "Longform", `long-${cleanSlug}.description.txt`),
      path.join(root, "out", `long-${cleanSlug}.description.txt`),
    ];
    let customDesc = "";
    for (const d of descCandidates) {
      if (fs.existsSync(d)) {
        customDesc = fs.readFileSync(d, "utf8");
        break;
      }
    }

    let descriptionLines = [];
    if (customDesc) {
      descriptionLines = [
        customDesc.trim(),
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "🔔 Subscribe to A Day Back Then for daily journeys into history!",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "#History #AncientHistory #Documentary #HistoryDocumentary #AncientRome",
      ];
    } else {
      descriptionLines = [
        script.hook || title,
        "",
        "Step back in time to experience what life was really like in ancient history.",
        "",
        "🔔 Subscribe for more history deep-dives: @ADayBackThen",
        "",
        "#History #AncientHistory #Documentary",
      ];
    }

    const tags = [
      "History",
      "Ancient History",
      "Documentary",
      "History Documentary",
      "Daily Life in History",
      "A Day Back Then",
      ...cleanSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)),
    ];

    const snippet = {
      title,
      description: descriptionLines.join("\n"),
      tags,
      categoryId: "27", // Education
      defaultLanguage: "en",
      defaultAudioLanguage: "en",
    };

    const status = {
      selfDeclaredMadeForKids: false,
    };

    if (scheduleTime) {
      status.privacyStatus = "private";
      status.publishAt = new Date(scheduleTime).toISOString();
    } else {
      status.privacyStatus = explicitPrivacy || "public";
    }

    return {snippet, status};
  }

  // 1. Title: Under 60 chars + #shorts
  let title = `${script.hook || script.title} #shorts`;
  if (title.length > 95) {
    title = `${(script.hook || script.title).slice(0, 85)}... #shorts`;
  }

  // 2. Hashtags based on slug / theme
  const slugTag = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const hashtags = [
    "#Shorts",
    "#History",
    `#${slugTag}`,
    "#HistoryFacts",
    "#DidYouKnow",
    "#AncientHistory",
    "#Storytime",
  ];

  // 3. Description
  const descriptionLines = [
    script.hook,
    "",
    ...script.scenes.slice(0, 3).map((s) => s.text),
    "",
    "Would you have survived a day back then? Let us know in the comments!",
    `Subscribe for daily history: @${script.channelName || "ADayBackThen"}`,
    "",
    hashtags.join(" "),
    "",
    "Note: Educational history storytelling with AI narration and illustrative backgrounds.",
  ];

  const tags = [
    "Shorts",
    "History",
    "History Facts",
    "Ancient History",
    "Did You Know",
    "Storytime",
    "Education",
    ...slug.split("-"),
  ];

  const snippet = {
    title,
    description: descriptionLines.join("\n"),
    tags,
    categoryId: "27", // Education
    defaultLanguage: "en",
    defaultAudioLanguage: "en",
  };

  const status = {
    selfDeclaredMadeForKids: false,
  };

  if (scheduleTime) {
    // When scheduled, YouTube requires private until the publishAt time, when it automatically goes Public
    status.privacyStatus = "private";
    status.publishAt = new Date(scheduleTime).toISOString();
  } else {
    // Default to public if not scheduled
    status.privacyStatus = explicitPrivacy || "public";
  }

  return {snippet, status};
}

/**
 * Uploads video to YouTube via resumable upload protocol.
 */
async function uploadVideo(slug, options) {
  const cleanSlug = slug.replace(/^long-/, "");
  const candidatePaths = [
    path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${cleanSlug}.mp4`),
    path.join(root, "out", "Longform", "1 - Published", `long-${cleanSlug}.mp4`),
    path.join(root, "out", "Longform", `long-${cleanSlug}.mp4`),
    path.join(root, "out", `long-${cleanSlug}.mp4`),
    path.join(root, "out", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "out", "Published", `${slug}.mp4`),
    path.join(root, "out", "Unpublished Vault", `${slug}.mp4`),
  ];
  const mp4Path = candidatePaths.find((p) => fs.existsSync(p));
  if (!mp4Path) {
    console.error(`Video file for ${slug} not found in out/ or subfolders. Run 'npm run build-video -- ${slug}' or 'npm run build-long -- ${cleanSlug}' first.`);
    process.exit(1);
  }

  let isLong = options.long || slug.startsWith("long-") || mp4Path.includes("Longform") || path.basename(mp4Path).startsWith("long-");

  // Load script details for metadata
  let script = null;
  const longScriptPath = path.join(root, "long-out", `${cleanSlug}.json`);
  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  const samplePath = path.join(root, "data", "sample.json");

  if (fs.existsSync(longScriptPath) && (isLong || !fs.existsSync(scriptPath))) {
    script = JSON.parse(fs.readFileSync(longScriptPath, "utf8"));
    isLong = true;
  } else if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  } else if (slug === "sample-roman-morning" && fs.existsSync(samplePath)) {
    script = JSON.parse(fs.readFileSync(samplePath, "utf8"));
  } else {
    console.warn(`No script file found for ${slug}. Using generic title.`);
    script = {
      title: cleanSlug.replace(/-/g, " "),
      hook: cleanSlug.replace(/-/g, " "),
      channelName: "A Day Back Then",
      scenes: [],
    };
  }

  const explicitPrivacy = options.privacy;
  let scheduleTime = options.schedule;

  // Auto-schedule for optimal peak viewing by default unless --now / --public or explicit privacy
  if (!scheduleTime && !options.now && !explicitPrivacy) {
    scheduleTime = getNextOptimalSchedule();
  }

  const {snippet, status} = buildMetadata(script, slug, scheduleTime, explicitPrivacy, isLong);

  console.log("\n========================================================");
  console.log(`   Uploading: ${cleanSlug} (${isLong ? "Long-Form Video" : "Short"})`);
  console.log("========================================================");
  console.log(`Title:       ${snippet.title}`);
  if (status.publishAt) {
    console.log(`Status:      Scheduled (Automatically goes Public at ${status.publishAt})`);
  } else {
    console.log(`Status:      ${status.privacyStatus.toUpperCase()} (Live immediately)`);
  }
  console.log(`File:        ${mp4Path} (${(fs.statSync(mp4Path).size / (1024 * 1024)).toFixed(1)} MB)`);
  console.log("--------------------------------------------------------");

  const accessToken = await getAccessToken();

  // Step 1: Initiate resumable upload
  const initRes = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": fs.statSync(mp4Path).size.toString(),
      },
      body: JSON.stringify({snippet, status}),
    },
  );

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`Failed to initiate YouTube upload (${initRes.status}): ${errText}`);
  }

  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) {
    throw new Error("YouTube did not return an upload Location URL.");
  }

  // Step 2: Stream the video file to the upload URL
  console.log("Uploading video stream to YouTube...");
  const fileStream = fs.createReadStream(mp4Path);
  const fileSize = fs.statSync(mp4Path).size;

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": fileSize.toString(),
    },
    body: fileStream,
    duplex: "half",
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Failed to upload video stream (${uploadRes.status}): ${errText}`);
  }

  const result = await uploadRes.json();
  const videoId = result.id;

  console.log("\n========================================================");
  console.log("   Upload Complete!");
  console.log("========================================================");
  console.log(`Video ID:    ${videoId}`);
  if (isLong) {
    console.log(`Watch URL:   https://youtube.com/watch?v=${videoId}`);
  } else {
    console.log(`Short URL:   https://youtube.com/shorts/${videoId}`);
  }
  console.log(`Studio URL:  https://studio.youtube.com/video/${videoId}/edit`);
  console.log("========================================================\n");

  // Save to published-urls.json for automatic description links
  try {
    const pubUrlsPath = path.join(root, "published-urls.json");
    const pubUrls = fs.existsSync(pubUrlsPath) ? JSON.parse(fs.readFileSync(pubUrlsPath, "utf8")) : {};
    pubUrls[cleanSlug] = {
      videoId,
      url: isLong ? `https://youtube.com/watch?v=${videoId}` : `https://youtube.com/shorts/${videoId}`,
      title: snippet.title,
      isLong,
      uploadedAt: new Date().toISOString(),
    };
    fs.writeFileSync(pubUrlsPath, JSON.stringify(pubUrls, null, 2));
  } catch {}

  // Auto-move uploaded video to Published folder
  try {
    if (isLong && mp4Path.includes("2 - Unpublished Vault")) {
      const pubDir = path.join(root, "out", "Longform", "1 - Published");
      fs.mkdirSync(pubDir, {recursive: true});
      const destMp4 = path.join(pubDir, path.basename(mp4Path));
      fs.renameSync(mp4Path, destMp4);
      console.log(`Moved ${path.basename(mp4Path)} to out/Longform/1 - Published/`);

      const descSrc = mp4Path.replace(/\.mp4$/, ".description.txt");
      if (fs.existsSync(descSrc)) {
        fs.renameSync(descSrc, path.join(pubDir, path.basename(descSrc)));
      }
    } else if (!isLong && mp4Path.includes("2 - Unpublished Vault")) {
      const pubDir = path.join(root, "out", "1 - Published");
      fs.mkdirSync(pubDir, {recursive: true});
      const destMp4 = path.join(pubDir, path.basename(mp4Path));
      fs.renameSync(mp4Path, destMp4);
      console.log(`Moved ${path.basename(mp4Path)} to out/1 - Published/`);
    }
  } catch (moveErr) {
    console.warn("Could not auto-move video file:", moveErr.message);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const isAuthOnly = args.includes("--auth");
const isNow = args.includes("--now") || args.includes("--public");
const isLong = args.includes("--long");
const slug = args.find((a) => !a.startsWith("--"));

const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};

const privacy = getArg("privacy");
const schedule = getArg("schedule");

if (isAuthOnly) {
  await authenticate();
} else if (slug) {
  await uploadVideo(slug, {privacy, schedule, now: isNow, long: isLong});
} else {
  console.log(`
Usage:
  npm run upload:auth                     Link your YouTube channel
  npm run upload -- <slug>                Auto-detects Short or Long-Form & schedules
  npm run upload -- <slug> --now          Upload and publish immediately as Public
  npm run upload -- <slug> --schedule "2026-10-10T23:00:00Z"
  npm run upload -- <slug> --privacy unlisted
  npm run upload:long -- <slug>           Explicitly upload as long-form
`);
}
