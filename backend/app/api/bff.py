from flask import Blueprint, jsonify
from app.core.security import login_required, require_building_access

bff_bp = Blueprint("bff", __name__)

BUILDING_META = {
    "bldg-aspiria-01": {"name": "Aspiria Campus — Building A", "city": "Pune", "area_m2": 12500, "floors": 6},
    "bldg-capgemini-pune": {"name": "Capgemini Pune Campus", "city": "Pune", "area_m2": 28000, "floors": 8},
}

def _safe_modules():
    return {
        "occupancy_hvac": {"status": "healthy", "occupied_rooms": 14, "total_rooms": 24, "savings_kwh_today": 412, "label": "14/24 occupied · 412 kWh saved"},
        "digital_twin": {"status": "warning", "epi": 148, "target_epi": 120, "label": "EPI 148 vs ECBC 120 · 4 retrofit options"},
        "fault_detection": {"status": "warning", "healthy": 9, "warning": 1, "critical": 0, "label": "1 warning — Chiller-1 (+14%)"},
        "grid_solar": {"status": "healthy", "self_consumption_pct": 72, "battery_soc_pct": 68, "label": "72% self-consumption · Battery 68%"},
        "xai": {"status": "healthy", "recent_explanations": 18, "label": "18 decisions explained today"},
        "tenant": {"status": "healthy", "active_participants": 64, "label": "64 tenants engaged this week"},
    }

@bff_bp.route("/dashboard-summary/<building_id>", methods=["GET"])
@login_required
def dashboard_summary(building_id):
    err = require_building_access(building_id)
    if err:
        return err
    meta = BUILDING_META.get(building_id, {"name": building_id, "city": "—", "area_m2": 0, "floors": 0})
    return jsonify({
        "building_id": building_id,
        "building_name": meta.get("name", building_id),
        "city": meta.get("city", "—"),
        "area_m2": meta.get("area_m2", 0),
        "floors": meta.get("floors", 0),
        "timestamp": "2026-09-22T12:00:00Z",
        "kpis": {
            "energy_today_kwh": 1842,
            "savings_today_kwh": 412,
            "savings_today_inr": 2884,
            "savings_pct_week": 31.9,
            "co2_avoided_kg": 338,
            "peak_demand_kw": 286,
            "self_consumption_pct": 72,
            "open_faults": 1,
            "occupied_pct": 58,
        },
        "modules": _safe_modules(),
        "active_alerts": [
            {"id": "a1", "module": "fault_detection", "severity": "yellow", "message": "Chiller-1 power draw +14% above 7-day baseline — inspect condenser", "timestamp": "2026-09-22T08:15:00Z"},
            {"id": "a2", "module": "digital_twin", "severity": "info", "message": "ECBC compliance gap — LED + VFD package payback ~16 months", "timestamp": "2026-09-22T07:00:00Z"},
        ],
        "hourly_load": [
            {"hour": h, "kwh": round(40 + (35 if 9 <= h <= 17 else 10) + (h % 3) * 4 + (12 if h == 14 else 0), 1)}
            for h in range(24)
        ],
        "panchabhutas": {
            "agni_energy_saved_pct": 31.9,
            "vaayu_comfort_score": 92,
            "jal_water_proxy": "Cooling-aware",
            "prithvi_retrofit_ready": "ECBC gap tracked",
            "gagan_occupied_pct": 58,
        },
        "standards_note": "Adaptive comfort intent · Net-zero energy direction · ECBC 2017 performance framing",
    })
