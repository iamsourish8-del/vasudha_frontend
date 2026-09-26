/**
 * Prevent Render free-tier "spin down" (sleep after ~15 min idle).
 * While the app tab is open, ping /api/v1/keepalive every 12 minutes.
 * Also pings once on load so cold starts recover faster.
 *
 * For always-on without the browser open, use a free external monitor
 * (cron-job.org, UptimeRobot) hitting https://YOUR-RENDER-URL/api/v1/keepalive
 * every 10–14 minutes.
 */
import { getApiOrigin } from "./apiClient";

const INTERVAL_MS = 12 * 60 * 1000; // 12 minutes
let timer: ReturnType<typeof setInterval> | null = null;

async function ping(): Promise<void> {
  try {
    const origin = getApiOrigin();
    await fetch(`${origin}/api/v1/keepalive`, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    });
  } catch {
    // Ignore network errors — backend may be cold-starting
  }
}

export function startKeepAlive(): void {
  if (timer) return;
  // Immediate ping (helps wake a sleeping service when user opens the app)
  void ping();
  timer = setInterval(() => void ping(), INTERVAL_MS);
}

export function stopKeepAlive(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
