/**
 * Deployment mode guardrail.
 *
 * DEPLOY_MODE=local (default): the dashboard runs on the pipeline machine and
 * API routes execute the real pipeline scripts exactly as they always have.
 *
 * DEPLOY_MODE=web: the dashboard is deployed to Cloudflare (Pages/Workers)
 * where there is NO local pipeline — no scripts, no media vault, no tokens on
 * disk. In web mode, routes that would execute a local script or touch local
 * pipeline files must refuse execution and instead record an "intent" (see
 * lib/intents.ts) that the bridge/machine side can pick up and execute.
 */
export type DeployMode = "local" | "web";

export function deployMode(): DeployMode {
  return process.env.DEPLOY_MODE === "web" ? "web" : "local";
}

export function isWebMode(): boolean {
  return deployMode() === "web";
}
