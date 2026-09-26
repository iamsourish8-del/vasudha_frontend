from flask import Blueprint, jsonify
from app.core.security import login_required, require_building_access

grid_bp = Blueprint("grid_solar", __name__)

@grid_bp.route("/<building_id>/solar", methods=["GET"])
@login_required
def solar(building_id):
    err = require_building_access(building_id)
    if err: return err
    schedule = []
    for h in range(24):
        solar_kw = max(0, round(95 * (1 - abs(h - 12.5) / 7.5), 1)) if 6 <= h <= 18 else 0
        batt_d = 18 if 18 <= h <= 22 else (8 if 0 <= h <= 5 else 0)
        batt_c = 25 if 11 <= h <= 15 else 0
        load = 55 + (40 if 9 <= h <= 17 else 5)
        grid = max(0, round(load - solar_kw - batt_d + batt_c * 0.1, 1))
        schedule.append({"hour":h,"solar_kw":solar_kw,"battery_discharge_kw":batt_d,
                         "battery_charge_kw":batt_c,"grid_import_kw":grid,"load_kw":load})
    return jsonify({
        "building_id":building_id,"self_consumption_pct":74,"battery_soc_pct":68,
        "today_solar_kwh":612,"today_export_kwh":48,"today_import_kwh":890,
        "estimated_monthly_savings_inr":52000,"pv_capacity_kwp":120,"battery_capacity_kwh":200,
        "schedule":schedule,
    })

@grid_bp.route("/<building_id>/dr-events", methods=["GET"])
@login_required
def dr_events(building_id):
    err = require_building_access(building_id)
    if err: return err
    return jsonify({"building_id":building_id,"history":[
        {"event_id":"DR-2026-0918","start":"2026-09-18T14:00:00","duration_min":90,
         "target_reduction_kw":50,"achieved_reduction_kw":47,"incentive_inr":8500,
         "rooms_curtailed":["Conference A","Conference B","Meeting 3A","Focus Rooms"]},
        {"event_id":"DR-2026-0912","start":"2026-09-12T15:30:00","duration_min":60,
         "target_reduction_kw":40,"achieved_reduction_kw":42,"incentive_inr":7200,
         "rooms_curtailed":["Open Office South zones","Cafeteria pre-cool skip"]},
        {"event_id":"DR-2026-0905","start":"2026-09-05T13:00:00","duration_min":120,
         "target_reduction_kw":60,"achieved_reduction_kw":55,"incentive_inr":11000,
         "rooms_curtailed":["Board Room","Executive Suite","Meeting 3B"]},
    ]})

@grid_bp.route("/<building_id>/outage-status", methods=["GET"])
@login_required
def outage_status(building_id):
    err = require_building_access(building_id)
    if err: return err
    return jsonify({
        "building_id":building_id,"grid_connected":True,
        "estimated_runtime_hours_on_battery":4.5,"battery_soc_pct":68,
        "critical_load_registry":{
            "tier1_life_safety":["Fire pumps","Emergency lighting","Lifts","Fire alarm panel"],
            "tier2_business":["Server room AC","Access control","Main BMS","CCTV NVR"],
            "tier3_comfort":["General HVAC","Office lighting","Pantry","Parking lights"],
        },
    })
