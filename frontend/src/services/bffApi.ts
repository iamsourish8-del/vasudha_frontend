/** Backend-for-Frontend aggregator calls */

import { apiFetch } from "./apiClient";
import type { BuildingSummary } from "../types";

export function fetchDashboardSummary(buildingId: string): Promise<BuildingSummary> {
  return apiFetch(`/bff/dashboard-summary/${buildingId}`);
}