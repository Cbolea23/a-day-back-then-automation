#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ALL_EXPANSION_SLUGS } from "./render-all-expansion.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
const pubDir = path.join(root, "out", "1 - Published");
const dashJobsFile = path.join(root, "dashboard", "data", "jobs.json");

function updateDashboardJob(job) {
  try {
    let jobs = [];
    if (fs.existsSync(dashJobsFile)) {
      jobs = JSON.parse(fs.readFileSync(dashJobsFile, "utf8"));
    }
    const idx = jobs.findIndex((j) => j.id === job.id);
    if (idx !== -1) {
      jobs[idx] = job;
    } else {
      jobs.push(job);
    }
    // Keep last 60 jobs
    if (jobs.length > 60) jobs = jobs.slice(-60);
    fs.mkdirSync(path.dirname(dashJobsFile), { recursive: true });
    fs.writeFileSync(dashJobsFile, JSON.stringify(jobs, null, 2));
  } catch (err) {
    console.error("Dashboard job sync warning:", err.message);
  }
}

async function renderSlug(slug, index, total) {
  const finalDest = path.join(vaultDir, `${slug}.mp4`);
  const pubDest = path.join(pubDir, `${slug}.mp4`);

  if (fs.existsSync(finalDest) || fs.existsSync(pubDest)) {
    console.log(`[${index}/${total}] [SKIP] Already rendered: ${slug}`);
    return true;
  }

  const propsFile = path.join(root, "scripts-out", `${slug}.json`);
  if (!fs.existsSync(propsFile)) {
    console.warn(`[${index}/${total}] [SKIP] No script for: ${slug}`);
    return false;
  }

  const jobId = `render-${Date.now()}-${slug}`;
  const job = {
    id: jobId,
    kind: "render",
    slug,
    status: "running",
    progress: 0,
    frame: 0,
    totalFrames: 0,
    log: [`Starting render for ${slug} (${index}/${total})...`],
    startedAt: Date.now(),
  };
  updateDashboardJob(job);

  console.log(`\n======================================================`);
  console.log(`[${index}/${total}] 🎬 Rendering: ${slug}`);
  console.log(`======================================================`);

  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join("scripts", "render.mjs"), slug],
      { cwd: root }
    );

    const handleOutput = (data) => {
      const text = data.toString();
      const lines = text.split("\n");
      for (const line of lines) {
        const clean = line.replace(/\r/g, "").trim();
        if (!clean) continue;
        job.log.push(clean);
        if (job.log.length > 100) job.log.shift();

        const m = clean.match(/Rendered\s+(\d+)\/(\d+)/);
        if (m) {
          job.frame = parseInt(m[1], 10);
          job.totalFrames = parseInt(m[2], 10);
          job.progress = Math.min(
            99,
            Math.round((job.frame / Math.max(1, job.totalFrames)) * 100)
          );
        }
        const e = clean.match(/Encoded\s+(\d+)\/(\d+)/);
        if (e) {
          job.progress = Math.min(
            99,
            Math.round((parseInt(e[1], 10) / Math.max(1, parseInt(e[2], 10))) * 100)
          );
        }
      }
      updateDashboardJob(job);
    };

    child.stdout.on("data", handleOutput);
    child.stderr.on("data", handleOutput);

    child.on("close", (code) => {
      job.finishedAt = Date.now();
      if (code === 0 && (fs.existsSync(finalDest) || fs.existsSync(path.join(root, "out", `${slug}.mp4`)))) {
        job.status = "done";
        job.progress = 100;
        job.log.push(`✅ Successfully rendered ${slug}.mp4 into Unpublished Vault!`);
        console.log(`✅ [${index}/${total}] Finished: ${slug}`);
        updateDashboardJob(job);
        resolve(true);
      } else {
        job.status = "failed";
        job.error = `Render failed with exit code ${code}`;
        job.log.push(`❌ ${job.error}`);
        console.error(`❌ [${index}/${total}] Failed: ${slug}`);
        updateDashboardJob(job);
        resolve(false);
      }
    });

    child.on("error", (err) => {
      job.finishedAt = Date.now();
      job.status = "failed";
      job.error = String(err);
      job.log.push(`❌ Process error: ${err.message}`);
      console.error(`❌ [${index}/${total}] Process error for ${slug}:`, err.message);
      updateDashboardJob(job);
      resolve(false);
    });
  });
}

async function main() {
  console.log("==========================================================");
  console.log("   AUTONOMOUS OVERNIGHT BATCH RENDER ORCHESTRATOR");
  console.log(`   Target Queue: ${ALL_EXPANSION_SLUGS.length} Expansion Shorts`);
  console.log("==========================================================\n");

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < ALL_EXPANSION_SLUGS.length; i++) {
    const slug = ALL_EXPANSION_SLUGS[i];
    const finalDest = path.join(vaultDir, `${slug}.mp4`);
    const pubDest = path.join(pubDir, `${slug}.mp4`);

    if (fs.existsSync(finalDest) || fs.existsSync(pubDest)) {
      skipCount++;
      continue;
    }

    const ok = await renderSlug(slug, i + 1, ALL_EXPANSION_SLUGS.length);
    if (ok) successCount++;
    else failCount++;
  }

  console.log("\n==========================================================");
  console.log("🎉 OVERNIGHT BATCH RUN COMPLETED!");
  console.log(`Rendered: ${successCount} | Skipped: ${skipCount} | Failed: ${failCount}`);
  console.log("==========================================================");
}

main().catch(console.error);
