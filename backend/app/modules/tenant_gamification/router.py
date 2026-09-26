"""Module 6 — Tenant Engagement & Gamification"""
from datetime import datetime
from flask import Blueprint, jsonify, request, g
from app.core.security import login_required, require_building_access

tenant_bp = Blueprint("tenant", __name__)

ACTION_LOG = []

BADGES = [
    {"id": "b1", "name": "Early Bird", "description": "Arrived before peak load window 5 days", "icon": "sunrise"},
    {"id": "b2", "name": "Setback Star", "description": "Supported setback in empty zones", "icon": "thermometer"},
    {"id": "b3", "name": "Week Warrior", "description": "Top 20% savings this week", "icon": "trophy"},
    {"id": "b4", "name": "Green Streak", "description": "12-day conservation streak", "icon": "leaf"},
]

CHALLENGES = [
    {"id": "c1", "title": "Friday Floor Challenge", "description": "Floor 3 vs Floor 2 — lowest kWh per person", "points": 50, "status": "active"},
    {"id": "c2", "title": "Phantom Load Hunt", "description": "Unplug idle chargers and monitors after hours", "points": 30, "status": "active"},
    {"id": "c3", "title": "Comfort with Care", "description": "Keep setpoint within adaptive comfort band", "points": 40, "status": "upcoming"},
]


@tenant_bp.route("/<building_id>/me", methods=["GET"])
@login_required
def me(building_id):
    err = require_building_access(building_id)
    if err:
        return err
    return jsonify({
        "building_id": building_id,
        "user_id": getattr(g, "user_id", "tn-001"),
        "display_name": "Arjun Mehta",
        "kwh_this_week": 42.5,
        "energy_saved_kwh": 15.1,
        "co2_avoided_kg": 12.4,
        "vs_building_avg_pct": -18,
        "points": 1280,
        "rank_on_floor": 2,
        "rank_in_building": 7,
        "badges": BADGES,
        "streak_days": 12,
        "tips_completed": 8,
        "challenges": CHALLENGES,
    })


@tenant_bp.route("/<building_id>/leaderboard", methods=["GET"])
@login_required
def leaderboard(building_id):
    err = require_building_access(building_id)
    if err:
        return err
    return jsonify({
        "building_id": building_id,
        "period": "this_week",
        "entries": [
            {"rank": 1, "name": "Sneha K.", "energy_saved_kwh": 18.2, "co2_avoided_kg": 14.9, "points": 1450, "floor": "3"},
            {"rank": 2, "name": "Arjun Mehta", "energy_saved_kwh": 15.1, "co2_avoided_kg": 12.4, "points": 1280, "floor": "3"},
            {"rank": 3, "name": "Ravi P.", "energy_saved_kwh": 12.4, "co2_avoided_kg": 10.2, "points": 1105, "floor": "2"},
            {"rank": 4, "name": "Meera S.", "energy_saved_kwh": 11.0, "co2_avoided_kg": 9.0, "points": 980, "floor": "1"},
            {"rank": 5, "name": "Karan D.", "energy_saved_kwh": 9.8, "co2_avoided_kg": 8.0, "points": 870, "floor": "4"},
            {"rank": 6, "name": "Ananya R.", "energy_saved_kwh": 8.5, "co2_avoided_kg": 7.0, "points": 790, "floor": "2"},
            {"rank": 7, "name": "Dev M.", "energy_saved_kwh": 7.2, "co2_avoided_kg": 5.9, "points": 710, "floor": "5"},
        ],
    })


@tenant_bp.route("/<building_id>/nudges", methods=["GET"])
@login_required
def nudges(building_id):
    err = require_building_access(building_id)
    if err:
        return err
    return jsonify({
        "nudges": [
            {"id": "n1", "text": "Turn off AC 15 min before leaving — save ~1.2 kWh", "potential_points": 30, "category": "hvac"},
            {"id": "n2", "text": "Enable auto-dim after 7 PM in your zone", "potential_points": 20, "category": "lighting"},
            {"id": "n3", "text": "Report empty meeting rooms — help setback kick in faster", "potential_points": 15, "category": "occupancy"},
            {"id": "n4", "text": "Join Friday Floor Challenge on Floor 3", "potential_points": 50, "category": "social"},
        ]
    })


@tenant_bp.route("/<building_id>/actions/log", methods=["POST"])
@tenant_bp.route("/actions/log", methods=["POST"])
@login_required
def log_action(building_id=None):
    body = request.get_json(silent=True) or {}
    bid = building_id or body.get("building_id", "")
    if bid:
        err = require_building_access(bid)
        if err:
            return err
    action = body.get("action") or body.get("action_id") or "eco_action"
    points = int(body.get("points") or 50)
    entry = {
        "action": action,
        "points_awarded": points,
        "user_id": getattr(g, "user_id", "unknown"),
        "building_id": bid,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "note": body.get("note") or body.get("reason") or "",
    }
    ACTION_LOG.append(entry)
    return jsonify({
        "status": "ok",
        "message": "Eco-action logged. Green credits added.",
        "points_awarded": points,
        "total_actions_logged": len(ACTION_LOG),
        "entry": entry,
    })
