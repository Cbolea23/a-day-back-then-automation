import {spawn, type ChildProcess} from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * The Shorts Factory pipeline lives in the repo root; the dashboard runs
 * from dashboard/. PIPELINE_ROOT overrides the auto-detected parent dir.
 */
export function pipelineRoot(): string {
  return process.env.PIPELINE_ROOT ?? path.resolve(process.cwd(), "..");
}

export function scriptPath(name: string): string {
  return path.join(pipelineRoot(), "scripts", name);
}

export function runScript(
  script: string,
  args: string[],
  opts?: {env?: Record<string, string>},
): Promise<{code: number; stdout: string; stderr: string}> {
  return new Promise((resolve) => {
    const child = spawn("node", [scriptPath(script), ...args], {
      cwd: pipelineRoot(),
      env: {...process.env, ...opts?.env},
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({code: code ?? 1, stdout, stderr}));
    child.on("error", (err) =>
      resolve({code: 1, stdout, stderr: stderr + String(err)}),
    );
  });
}

// ---------------------------------------------------------------------------
// Long-running job store (renders, uploads). Jobs are persisted to disk so
// they survive server restarts / dev-mode reloads; live process handles are
// in-memory only. Jobs found "running" at startup are marked interrupted.
// ---------------------------------------------------------------------------

export type JobStatus =
  | "queued"
  | "running"
  | "done"
  | "failed"
  | "interrupted";

export type Job = {
  id: string;
  kind: "render" | "publish" | "voice" | "script";
  slug: string;
  status: JobStatus;
  progress: number; // 0..100
  frame: number;
  totalFrames: number;
  log: string[];
  startedAt: number;
  finishedAt?: number;
  error?: string;
};

const jobs = new Map<string, Job>();
const procs = new Map<string, ChildProcess>();

function dataDir(): string {
  return process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
}

function jobsFile(): string {
  return path.join(dataDir(), "jobs.json");
}

function persistJobs() {
  try {
    fs.mkdirSync(dataDir(), {recursive: true});
    fs.writeFileSync(jobsFile(), JSON.stringify([...jobs.values()].slice(-50)));
  } catch {
    /* persistence is best-effort */
  }
}

function loadJobs() {
  try {
    const raw = fs.readFileSync(jobsFile(), "utf8");
    const arr = JSON.parse(raw) as Job[];
    for (const j of arr) {
      if (j.status === "running" || j.status === "queued") {
        j.status = "interrupted";
        j.error = "dashboard server restarted while this job was active";
        j.finishedAt = j.finishedAt ?? Date.now();
      }
      jobs.set(j.id, j);
    }
  } catch {
    /* no prior jobs */
  }
}

loadJobs();

function newJob(kind: Job["kind"], slug: string): Job {
  const job: Job = {
    id: `${kind}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    kind,
    slug,
    status: "queued",
    progress: 0,
    frame: 0,
    totalFrames: 0,
    log: [],
    startedAt: Date.now(),
  };
  jobs.set(job.id, job);
  persistJobs();
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function listJobs(): Job[] {
  return [...jobs.values()].sort((a, b) => b.startedAt - a.startedAt);
}

function pushLog(job: Job, line: string) {
  const clean = line.replace(/\r/g, "").trimEnd();
  if (!clean) return;
  job.log.push(clean);
  if (job.log.length > 400) job.log.splice(0, job.log.length - 400);
}

/** Parse "Rendered 1234/2238" style progress lines from remotion output. */
function parseRenderProgress(job: Job, chunk: string) {
  const lines = chunk.split("\n");
  const before = job.progress;
  for (const line of lines) {
    const m = line.match(/Rendered\s+(\d+)\s*\/\s*(\d+)/);
    if (m) {
      job.frame = parseInt(m[1], 10);
      job.totalFrames = parseInt(m[2], 10);
      job.progress = Math.min(
        99,
        Math.round((job.frame / Math.max(1, job.totalFrames)) * 100),
      );
    }
    const e = line.match(/Encoded\s+(\d+)\s*\/\s*(\d+)/);
    if (e) {
      job.progress = Math.min(
        99,
        Math.round((parseInt(e[1], 10) / Math.max(1, parseInt(e[2], 10))) * 100),
      );
    }
  }
  // Persist at most on 5% boundaries to avoid disk churn.
  if (Math.floor(job.progress / 5) !== Math.floor(before / 5)) persistJobs();
}

/**
 * Start a render job: `node scripts/render.mjs <slug>`.
 * Progress is parsed from remotion's stdout ("Rendered x/y").
 */
export function startRenderJob(slug: string): Job {
  const job = newJob("render", slug);
  job.status = "running";
  persistJobs();
  const child = spawn("node", [scriptPath("render.mjs"), slug], {
    cwd: pipelineRoot(),
    env: process.env,
  });
  procs.set(job.id, child);
  child.stdout.on("data", (d) => {
    const text = d.toString();
    pushLog(job, text);
    parseRenderProgress(job, text);
  });
  child.stderr.on("data", (d) => pushLog(job, d.toString()));
  child.on("close", (code) => {
    procs.delete(job.id);
    persistJobs();
    job.finishedAt = Date.now();
    if (code === 0) {
      job.status = "done";
      job.progress = 100;
    } else {
      job.status = "failed";
      job.error = `render.mjs exited with code ${code}`;
      pushLog(job, job.error);
    }
  });
  child.on("error", (err) => {
    procs.delete(job.id);
    persistJobs();
    job.status = "failed";
    job.error = String(err);
    job.finishedAt = Date.now();
  });
  return job;
}

/** Start a publish job for one platform's upload script. */
export function startPublishJob(
  slug: string,
  platform: "youtube" | "facebook" | "tiktok" | "instagram",
): Job {
  const scriptMap = {
    youtube: "upload-youtube.mjs",
    facebook: "upload-facebook.mjs",
    tiktok: "upload-tiktok.mjs",
    instagram: "upload-instagram.mjs",
  } as const;
  const job = newJob("publish", slug);
  job.status = "running";
  persistJobs();
  const child = spawn("node", [scriptPath(scriptMap[platform]), slug], {
    cwd: pipelineRoot(),
    env: process.env,
  });
  procs.set(job.id, child);
  child.stdout.on("data", (d) => pushLog(job, d.toString()));
  child.stderr.on("data", (d) => pushLog(job, d.toString()));
  child.on("close", (code) => {
    procs.delete(job.id);
    persistJobs();
    job.finishedAt = Date.now();
    if (code === 0) {
      job.status = "done";
      job.progress = 100;
    } else {
      job.status = "failed";
      job.error = `${scriptMap[platform]} exited with code ${code}`;
      pushLog(job, job.error);
    }
  });
  child.on("error", (err) => {
    procs.delete(job.id);
    persistJobs();
    job.status = "failed";
    job.error = String(err);
    job.finishedAt = Date.now();
  });
  return job;
}

/** Read a JSON file from the pipeline root, or undefined if missing. */
export function readPipelineJson<T>(rel: string): T | undefined {
  const p = path.join(pipelineRoot(), rel);
  if (!fs.existsSync(p)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return undefined;
  }
}

/**
 * Server-side secrets entered via the dashboard settings UI.
 * Stored in data/keys.json (mode 600, gitignored) — never sent to the browser.
 */
export function getStoredKeys(): Record<string, string> {
  const dir = process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "keys.json"), "utf8")) as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

/** Gemini key: server env wins, otherwise the key saved via settings. */
export function getGeminiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || getStoredKeys().GEMINI_API_KEY || undefined;
}
