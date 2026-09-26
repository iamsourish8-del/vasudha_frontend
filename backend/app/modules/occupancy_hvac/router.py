from datetime import datetime
from flask import Blueprint, jsonify, request, g
from app.core.security import login_required, roles_required, require_building_access

occupancy_bp = Blueprint("occupancy", __name__)

OVERRIDE_LOG = []  # in-memory audit for demo

DEMO_ROOMS = [
    {"room_id":"r-101","name":"Conference A","floor":"1","zone":"Meeting","occupied":True,"temperature_c":24.1,"setpoint_c":23.0,"hvac_setpoint_c":23.0,"light_level_pct":80,"lighting_state":"on","co2_ppm":620,"energy_delta_kwh":0.0,"occupancy_confidence":0.94},
    {"room_id":"r-102","name":"Conference B","floor":"1","zone":"Meeting","occupied":False,"temperature_c":26.8,"setpoint_c":27.0,"hvac_setpoint_c":27.0,"light_level_pct":10,"lighting_state":"dimmed","co2_ppm":410,"last_occupied_at":"2026-09-22T09:30:00","energy_delta_kwh":-1.4,"occupancy_confidence":0.91},
    {"room_id":"r-103","name":"Reception Lobby","floor":"1","zone":"Public","occupied":True,"temperature_c":24.5,"setpoint_c":24.0,"hvac_setpoint_c":24.0,"light_level_pct":90,"lighting_state":"on","co2_ppm":580,"energy_delta_kwh":0.0,"occupancy_confidence":0.88},
    {"room_id":"r-201","name":"Open Office North","floor":"2","zone":"Office","occupied":True,"temperature_c":23.5,"setpoint_c":23.0,"hvac_setpoint_c":23.0,"light_level_pct":90,"lighting_state":"on","co2_ppm":710,"energy_delta_kwh":0.0,"occupancy_confidence":0.96},
    {"room_id":"r-202","name":"Open Office South","floor":"2","zone":"Office","occupied":True,"temperature_c":23.8,"setpoint_c":23.0,"hvac_setpoint_c":23.0,"light_level_pct":85,"lighting_state":"on","co2_ppm":690,"energy_delta_kwh":0.0,"occupancy_confidence":0.93},
    {"room_id":"r-203","name":"Focus Rooms 2A-2D","floor":"2","zone":"Meeting","occupied":False,"temperature_c":26.5,"setpoint_c":27.0,"hvac_setpoint_c":27.0,"light_level_pct":5,"lighting_state":"off","co2_ppm":405,"last_occupied_at":"2026-09-22T10:05:00","energy_delta_kwh":-0.9,"occupancy_confidence":0.89},
    {"room_id":"r-301","name":"Meeting 3A","floor":"3","zone":"Meeting","occupied":False,"temperature_c":27.2,"setpoint_c":27.5,"hvac_setpoint_c":27.5,"light_level_pct":5,"lighting_state":"off","co2_ppm":400,"last_occupied_at":"2026-09-22T08:15:00","energy_delta_kwh":-2.1,"occupancy_confidence":0.97},
    {"room_id":"r-302","name":"Meeting 3B","floor":"3","zone":"Meeting","occupied":True,"temperature_c":23.9,"setpoint_c":23.5,"hvac_setpoint_c":23.5,"light_level_pct":75,"lighting_state":"on","co2_ppm":650,"energy_delta_kwh":0.0,"occupancy_confidence":0.92},
    {"room_id":"r-303","name":"Open Office Floor 3","floor":"3","zone":"Office","occupied":True,"temperature_c":24.0,"setpoint_c":23.5,"hvac_setpoint_c":23.5,"light_level_pct":88,"lighting_state":"on","co2_ppm":680,"energy_delta_kwh":0.0,"occupancy_confidence":0.95},
    {"room_id":"r-401","name":"Executive Suite","floor":"4","zone":"Office","occupied":False,"temperature_c":26.0,"setpoint_c":26.5,"hvac_setpoint_c":26.5,"light_level_pct":8,"lighting_state":"dimmed","co2_ppm":420,"last_occupied_at":"2026-09-22T11:20:00","energy_delta_kwh":-1.1,"occupancy_confidence":0.90},
    {"room_id":"r-402","name":"Board Room","floor":"4","zone":"Meeting","occupied":False,"temperature_c":26.9,"setpoint_c":27.0,"hvac_setpoint_c":27.0,"light_level_pct":0,"lighting_state":"off","co2_ppm":395,"last_occupied_at":"2026-09-21T17:45:00","energy_delta_kwh":-2.8,"occupancy_confidence":0.98},
    {"room_id":"r-501","name":"Cafeteria","floor":"5","zone":"Public","occupied":True,"temperature_c":24.8,"setpoint_c":24.5,"hvac_setpoint_c":24.5,"light_level_pct":95,"lighting_state":"on","co2_ppm":780,"energy_delta_kwh":0.0,"occupancy_confidence":0.87},
]

@occupancy_bp.route("/<building_id>/status", methods=["GET"])
@login_required
def get_status(building_id):
    err = require_building_access(building_id)
    if err: return err
    occupied = sum(1 for r in DEMO_ROOMS if r["occupied"])
    setback = sum(1 for r in DEMO_ROOMS if not r["occupied"])
    savings = sum(abs(r["energy_delta_kwh"]) for r in DEMO_ROOMS if r["energy_delta_kwh"] < 0)
    return jsonify({
        "building_id": building_id,
        "total_rooms": len(DEMO_ROOMS),
        "occupied_rooms": occupied,
        "setback_rooms": setback,
        "savings_kwh_today": round(savings * 18.5, 1),
        "savings_inr_today": round(savings * 18.5 * 7, 0),
        "avg_co2_ppm": round(sum(r["co2_ppm"] for r in DEMO_ROOMS) / len(DEMO_ROOMS)),
        "comfort_score": 92,
        "rooms": DEMO_ROOMS,
    })

@occupancy_bp.route("/<building_id>/override", methods=["POST"])
@roles_required("facility_manager", "super_admin", "maintenance")
def override_room(building_id):
    err = require_building_access(building_id)
    if err: return err
    body = request.get_json(silent=True) or {}
    entry = {
        "room_id": body.get("room_id"),
        "action": body.get("action"),
        "setpoint_c": body.get("setpoint_c"),
        "reason": body.get("reason"),
        "overridden_by": g.user_id,
        "building_id": building_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    OVERRIDE_LOG.append(entry)
    return jsonify({
        "status": "accepted",
        "room_id": entry["room_id"],
        "action": entry["action"],
        "overridden_by": entry["overridden_by"],
        "timestamp": entry["timestamp"],
        "message": "Override logged — applied on next control cycle",
        "audit_id": len(OVERRIDE_LOG),
    })

@occupancy_bp.route("/<building_id>/savings", methods=["GET"])
@login_required
def get_savings(building_id):
    err = require_building_access(building_id)
    if err: return err
    return jsonify({
        "building_id": building_id,
        "daily": [
            {"date":"2026-09-16","kwh":380,"inr":2660,"baseline_kwh":560},
            {"date":"2026-09-17","kwh":410,"inr":2870,"baseline_kwh":580},
            {"date":"2026-09-18","kwh":395,"inr":2765,"baseline_kwh":575},
            {"date":"2026-09-19","kwh":445,"inr":3115,"baseline_kwh":620},
            {"date":"2026-09-20","kwh":420,"inr":2940,"baseline_kwh":600},
            {"date":"2026-09-21","kwh":398,"inr":2786,"baseline_kwh":570},
            {"date":"2026-09-22","kwh":412,"inr":2890,"baseline_kwh":590},
        ],
        "baseline_fixed_schedule_kwh_week": 4095,
        "actual_kwh_week": 2860,
        "savings_pct": 30.2,
        "by_floor": [
            {"floor":"1","kwh_saved":95},{"floor":"2","kwh_saved":72},
            {"floor":"3","kwh_saved":110},{"floor":"4","kwh_saved":88},{"floor":"5","kwh_saved":47},
        ],
    })


@occupancy_bp.route("/<building_id>/overrides", methods=["GET"])
@login_required
def list_overrides(building_id):
    err = require_building_access(building_id)
    if err: return err
    items = [e for e in OVERRIDE_LOG if e.get("building_id") == building_id]
    return jsonify({"building_id": building_id, "overrides": items[-20:]})
