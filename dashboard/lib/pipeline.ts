import {spawn, execFile, type ChildProcess} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Pipeline root lives in the repo root; the dashboard runs from dashboard/.
 * PIPELINE_ROOT overrides the auto-detected parent dir.
 */
export function pipelineRoot(): string {
  return process.env.PIPELINE_ROOT ?? path.resolve(process.cwd(), "..");
}

export function scriptPath(name: string): string {
  return path.join(pipelineRoot(), "scripts", name);
}

export function getLocalIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal && !net.address.startsWith("169.254")) {
        if (net.address.startsWith("192.168.1.")) return net.address;
      }
    }
  }
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal && !net.address.startsWith("169.254")) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

// ---------------------------------------------------------------------------
// Cloudflare Tunnel Management (Remote phone access outside home)
// ---------------------------------------------------------------------------
let tunnelProcess: ChildProcess | null = null;
let tunnelPublicUrl: string | null = null;
let tunnelStatus: "stopped" | "starting" | "running" | "error" = "stopped";
let tunnelError: string | null = null;

export function getTunnelInfo() {
  const localIp = getLocalIp();
  return {
    status: tunnelStatus,
    url: tunnelPublicUrl,
    error: tunnelError,
    localUrl: `http://${localIp}:3100`,
    localhostUrl: "http://localhost:3100",
    localIp,
  };
}

export function startTunnel(): Promise<{url: string | null; error: string | null}> {
  if (tunnelProcess && tunnelStatus === "running") {
    return Promise.resolve({url: tunnelPublicUrl, error: null});
  }

  const binaryPath = path.join(pipelineRoot(), "tools", "cloudflared.exe");
  if (!fs.existsSync(binaryPath)) {
    tunnelStatus = "error";
    tunnelError = "tools/cloudflared.exe not found on disk";
    return Promise.resolve({url: null, error: tunnelError});
  }

  tunnelStatus = "starting";
  tunnelError = null;

  return new Promise((resolve) => {
    try {
      tunnelProcess = spawn(binaryPath, ["tunnel", "--url", "http://localhost:3100"], {
        cwd: pipelineRoot(),
      });

      const timeout = setTimeout(() => {
        if (tunnelStatus === "starting") {
          tunnelStatus = tunnelPublicUrl ? "running" : "error";
          resolve({url: tunnelPublicUrl, error: tunnelPublicUrl ? null : "Tunnel startup timed out"});
        }
      }, 15000);

      const handleData = (data: Buffer | string) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match && !tunnelPublicUrl) {
          tunnelPublicUrl = match[0];
          tunnelStatus = "running";
          clearTimeout(timeout);
          resolve({url: tunnelPublicUrl, error: null});
        }
      };

      tunnelProcess.stdout?.on("data", handleData);
      tunnelProcess.stderr?.on("data", handleData);

      tunnelProcess.on("close", (code) => {
        tunnelProcess = null;
        tunnelStatus = "stopped";
        tunnelPublicUrl = null;
      });

      tunnelProcess.on("error", (err) => {
        tunnelProcess = null;
        tunnelStatus = "error";
        tunnelError = String(err);
        resolve({url: null, error: tunnelError});
      });
    } catch (e) {
      tunnelStatus = "error";
      tunnelError = String(e);
      resolve({url: null, error: tunnelError});
    }
  });
}

export function stopTunnel() {
  if (tunnelProcess) {
    try {
      tunnelProcess.kill("SIGTERM");
    } catch {}
    tunnelProcess = null;
  }
  tunnelStatus = "stopped";
  tunnelPublicUrl = null;
}

// ---------------------------------------------------------------------------
// Long-running job store (renders, uploads, asset processing)
// ---------------------------------------------------------------------------
export type JobStatus =
  | "queued"
  | "running"
  | "done"
  | "failed"
  | "interrupted";

export type Job = {
  id: string;
  kind: "render" | "render-long" | "process-images" | "npc-test" | "publish" | "voice" | "script";
  slug: string;
  status: JobStatus;
  progress: number;
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
    fs.writeFileSync(jobsFile(), JSON.stringify([...jobs.values()].slice(-60)));
  } catch {}
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
  } catch {}
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
  if (job.log.length > 500) job.log.splice(0, job.log.length - 500);
}

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
  if (Math.floor(job.progress / 5) !== Math.floor(before / 5)) persistJobs();
}

/** Render a short video: `node scripts/render.mjs <slug>` */
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

/** Render a longform video: `node scripts/build-long.mjs <slug> --allow-gradient` */
export function startLongRenderJob(slug: string): Job {
  const job = newJob("render-long", slug);
  job.status = "running";
  persistJobs();
  const child = spawn("node", [scriptPath("build-long.mjs"), slug, "--allow-gradient"], {
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
      job.error = `build-long.mjs exited with code ${code}`;
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

/** Attach Muse AI images and re-render: `node scripts/process-images-and-render.mjs [slug]` */
export function startProcessImagesJob(slug?: string): Job {
  const job = newJob("process-images", slug || "all-ready");
  job.status = "running";
  persistJobs();
  const args = [scriptPath("process-images-and-render.mjs")];
  if (slug) args.push(slug);

  const child = spawn("node", args, {
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
      job.error = `process-images-and-render.mjs exited with code ${code}`;
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

/** Publish job */
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

export function readPipelineJson<T>(rel: string): T | undefined {
  const p = path.join(pipelineRoot(), rel);
  if (!fs.existsSync(p)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return undefined;
  }
}

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

export function getGeminiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || getStoredKeys().GEMINI_API_KEY || undefined;
}
