/** Shared TypeScript types used across the entire dashboard */

export type UserRole = "facility_manager" | "tenant" | "maintenance" | "super_admin";

export interface AuthUser {
  user_id: string;
  role: UserRole;
  full_name: string;
  building_ids: string[];
  access_token: string;
  refresh_token?: string;
}

export interface BuildingSummary {
  building_id: string;
  building_name: string;
  timestamp: string;
  modules: {
    occupancy_hvac: ModuleSummary;
    digital_twin: ModuleSummary;
    fault_detection: ModuleSummary;
    grid_solar: ModuleSummary;
    xai: ModuleSummary;
    tenant: ModuleSummary;
  };
  active_alerts: AlertItem[];
}

export interface ModuleSummary {
  status: "healthy" | "warning" | "critical" | "unknown";
  [key: string]: any;
}

export interface AlertItem {
  id: string;
  module: string;
  severity: "info" | "yellow" | "red" | "critical";
  message: string;
  timestamp: string;
}

export interface RoomStatus {
  room_id: string;
  name: string;
  floor: string;
  occupied: boolean;
  temperature_c: number;
  light_level_pct: number;
  hvac_setpoint_c: number;
  lighting_state: "on" | "dimmed" | "off";
  last_occupied_at?: string;
  energy_delta_kwh: number;
}