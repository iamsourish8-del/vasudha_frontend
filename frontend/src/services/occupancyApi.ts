import { apiFetch } from "./apiClient";

export function fetchOccupancyStatus(buildingId: string) {
  return apiFetch(`/occupancy/${buildingId}/status`);
}

export function fetchSavingsHistory(buildingId: string) {
  return apiFetch(`/occupancy/${buildingId}/savings`);
}

export function overrideRoom(
  buildingId: string,
  body: {
    room_id: string;
    action: "force_setback" | "force_restore" | "manual_setpoint";
    setpoint_c?: number;
    reason: string;
  }
) {
  return apiFetch(`/occupancy/${buildingId}/override`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
