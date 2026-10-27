import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {pipelineRoot} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

function dataDir(): string {
  return process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
}

function keysFile(): string {
  return path.join(dataDir(), "keys.json");
}

function readStored(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(keysFile(), "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeStored(stored: Record<string, string>) {
  const dir = dataDir();
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(keysFile(), JSON.stringify(stored, null, 2), {mode: 0o600});
}

function maskKey(val?: string): string | null {
  if (!val || val.length < 6) return null;
  return `${val.slice(0, 4)}••••${val.slice(-4)}`;
}

/**
 * Returns status of all configured keys, FreeLLMAPI gateway, social tokens, and cloud render worker.
 * Raw secret values are masked so they are never exposed in plaintext to the browser.
 */
export async function GET() {
  if (isWebMode()) {
    // Web deployments are configured via environment variables only; secret
    // values are never read from (or written to) local pipeline files.
    return NextResponse.json({
      mode: "web",
      note: "Settings are managed via environment variables on the web deployment. Secret values are never exposed.",
      webEnv: {
        youtubeConfigured: Boolean(process.env.YT_TOKENS_JSON),
        metaConfigured: Boolean(process.env.META_PAGE_TOKEN),
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      },
    });
  }
  const stored = readStored();
  const root = pipelineRoot();

  const ytSecretExists = fs.existsSync(path.join(root, "client_secret.json"));
  const ytTokensExist = fs.existsSync(path.join(root, "youtube-tokens.json"));
  const fbTokensPath = path.join(root, "facebook-tokens.json");
  let fbConfig: {pageId?: string; igUserId?: string; hasToken?: boolean} = {};
  if (fs.existsSync(fbTokensPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(fbTokensPath, "utf8"));
      fbConfig = {
        pageId: raw.pageId || "",
        igUserId: raw.igUserId || "",
        hasToken: Boolean(raw.pageAccessToken),
      };
    } catch {}
  }
  const tiktokSessionExists = fs.existsSync(path.join(root, ".tiktok-session"));

  const getKeyStatus = (envName: string) => {
    const val = process.env[envName] || stored[envName] || "";
    return {
      isSet: Boolean(val),
      source: process.env[envName] ? "env" : stored[envName] ? "stored" : null,
      masked: maskKey(val),
    };
  };

  return NextResponse.json({
    // Legacy compatibility fields
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY || stored.GEMINI_API_KEY),
    geminiKeySource: process.env.GEMINI_API_KEY
      ? "env"
      : stored.GEMINI_API_KEY
        ? "stored"
        : null,

    // Full AI & FreeLLMAPI Pool Status
    freellmapiUrl: process.env.FREELLMAPI_URL || stored.FREELLMAPI_URL || "http://localhost:3001/v1",
    keys: {
      FREELLMAPI_KEY: getKeyStatus("FREELLMAPI_KEY"),
      GEMINI_API_KEY: getKeyStatus("GEMINI_API_KEY"),
      GROQ_API_KEY: getKeyStatus("GROQ_API_KEY"),
      CEREBRAS_API_KEY: getKeyStatus("CEREBRAS_API_KEY"),
      OPENROUTER_API_KEY: getKeyStatus("OPENROUTER_API_KEY"),
      MISTRAL_API_KEY: getKeyStatus("MISTRAL_API_KEY"),
      HF_API_KEY: getKeyStatus("HF_API_KEY"),
      GITHUB_TOKEN: getKeyStatus("GITHUB_TOKEN"),
    },
    preferences: {
      IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || stored.IMAGE_PROVIDER || "auto",
      VOICE_PROVIDER: process.env.VOICE_PROVIDER || stored.VOICE_PROVIDER || "edge",
      GITHUB_REPO: process.env.GITHUB_REPO || stored.GITHUB_REPO || "",
      RENDER_WORKER_URL: process.env.RENDER_WORKER_URL || stored.RENDER_WORKER_URL || "",
    },
    social: {
      youtubeClientSecret: ytSecretExists,
      youtubeAuthorized: ytTokensExist,
      facebookPageId: fbConfig.pageId || "",
      instagramUserId: fbConfig.igUserId || "",
      metaTokenSet: Boolean(fbConfig.hasToken),
      tiktokSessionReady: tiktokSessionExists,
    },
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  if (isWebMode()) {
    // Record WHICH settings keys were submitted — never their values.
    return queueIntent("settings.update", {keys: Object.keys(body)});
  }
  const stored = readStored();
  const root = pipelineRoot();

  // Action: Test FreeLLMAPI / Smart AI Pool Connection live
  if (body.action === "test-llm") {
    try {
      const start = Date.now();
      const routerPath = path.join(root, "scripts", "lib", "free-llm-router.mjs");
      const routerUrl = new URL(`file:///${routerPath.replace(/\\/g, "/")}`).href;
      const mod = await import(/* webpackIgnore: true */ routerUrl);
      const res = await mod.callSmartLLM({
        prompt: 'Return JSON: {"status": "ok", "greeting": "FreeLLMAPI Smart Pool Connected!"}',
        systemPrompt: "Return valid JSON only.",
        json: true,
      });
      return NextResponse.json({
        ok: true,
        provider: res.provider,
        model: res.model,
        latencyMs: Date.now() - start,
        response: res.data,
      });
    } catch (err: any) {
      return NextResponse.json(
        {ok: false, error: err?.message || "Connection test failed"},
        {status: 500},
      );
    }
  }

  // Legacy single field support
  if (typeof body.geminiKey === "string") {
    if (body.geminiKey.trim()) {
      stored.GEMINI_API_KEY = body.geminiKey.trim();
    } else {
      delete stored.GEMINI_API_KEY;
    }
  }

  // Save any of the supported AI, Cloud, and Provider keys
  const allowedKeys = [
    "FREELLMAPI_URL",
    "FREELLMAPI_KEY",
    "GEMINI_API_KEY",
    "GROQ_API_KEY",
    "CEREBRAS_API_KEY",
    "OPENROUTER_API_KEY",
    "MISTRAL_API_KEY",
    "HF_API_KEY",
    "IMAGE_PROVIDER",
    "VOICE_PROVIDER",
    "GITHUB_TOKEN",
    "GITHUB_REPO",
    "RENDER_WORKER_URL",
  ];

  for (const k of allowedKeys) {
    if (typeof body[k] === "string") {
      const val = body[k].trim();
      if (val) {
        stored[k] = val;
      } else if (body.clearEmpty) {
        delete stored[k];
      }
    }
  }

  writeStored(stored);

  // Optional: Save YouTube client_secret.json directly from Settings UI
  if (typeof body.youtubeClientSecretJson === "string" && body.youtubeClientSecretJson.trim()) {
    try {
      const parsed = JSON.parse(body.youtubeClientSecretJson.trim());
      if (!parsed.installed && !parsed.web) {
        return NextResponse.json(
          {error: "Invalid client_secret.json format. Must contain 'installed' or 'web' object."},
          {status: 400},
        );
      }
      fs.writeFileSync(path.join(root, "client_secret.json"), JSON.stringify(parsed, null, 2), {
        mode: 0o600,
      });
    } catch {
      return NextResponse.json({error: "Invalid JSON in YouTube Client Secret"}, {status: 400});
    }
  } else if (body.youtubeClientId && body.youtubeClientSecret) {
    const built = {
      installed: {
        client_id: String(body.youtubeClientId).trim(),
        client_secret: String(body.youtubeClientSecret).trim(),
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        redirect_uris: ["http://localhost:8085/oauth2callback"],
      },
    };
    fs.writeFileSync(path.join(root, "client_secret.json"), JSON.stringify(built, null, 2), {
      mode: 0o600,
    });
  }

  // Optional: Save Meta (Facebook & Instagram) credentials directly from Settings UI
  if (body.fbPageId || body.fbPageAccessToken || body.igUserId) {
    const fbTokensPath = path.join(root, "facebook-tokens.json");
    let existing: Record<string, string> = {};
    try {
      if (fs.existsSync(fbTokensPath)) {
        existing = JSON.parse(fs.readFileSync(fbTokensPath, "utf8"));
      }
    } catch {}
    const updated = {
      ...existing,
      ...(body.fbPageId ? {pageId: String(body.fbPageId).trim()} : {}),
      ...(body.fbPageAccessToken ? {pageAccessToken: String(body.fbPageAccessToken).trim()} : {}),
      ...(body.igUserId ? {igUserId: String(body.igUserId).trim()} : {}),
    };
    fs.writeFileSync(fbTokensPath, JSON.stringify(updated, null, 2), {mode: 0o600});
  }

  return GET();
}

export async function DELETE(req: Request) {
  const {searchParams} = new URL(req.url);
  const keyName = searchParams.get("key");
  if (isWebMode()) {
    return queueIntent("settings.delete", {key: keyName});
  }
  const stored = readStored();
  if (keyName) {
    delete stored[keyName];
  } else {
    delete stored.GEMINI_API_KEY;
  }
  writeStored(stored);
  return GET();
}
