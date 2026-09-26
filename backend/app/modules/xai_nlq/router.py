from flask import Blueprint, jsonify, request
from app.core.security import login_required, require_building_access

xai_bp = Blueprint("xai", __name__)
EXPLANATIONS = [
    {"decision_id":"dec-001","decision_type":"hvac_setback","timestamp":"2026-09-22T09:45:00Z",
     "plain_english":"Conference B set to 27°C setback — empty for 45 min; historical occupancy at this hour only 12%.","top_features":[{"feature":"minutes_empty","contribution":0.61},{"feature":"historical_occupancy","contribution":0.28},{"feature":"outdoor_temp","contribution":0.11}]},
    {"decision_id":"dec-002","decision_type":"dr_curtailment","timestamp":"2026-09-18T14:02:00Z",
     "plain_english":"Curtailed Conference A/B and Meeting 3A for 50 kW DR event — lowest occupancy priority and highest HVAC load share.","top_features":[{"feature":"occupancy_priority","contribution":0.48},{"feature":"hvac_load_share","contribution":0.35},{"feature":"comfort_margin","contribution":0.17}]},
    {"decision_id":"dec-003","decision_type":"fault_alert","timestamp":"2026-09-22T08:15:00Z",
     "plain_english":"Chiller-1 flagged: power 14% above 7-day baseline for 3 days — pattern matches condenser fouling.","top_features":[{"feature":"power_deviation","contribution":0.55},{"feature":"trend_slope","contribution":0.30},{"feature":"runtime_hours","contribution":0.15}]},
    {"decision_id":"dec-004","decision_type":"solar_dispatch","timestamp":"2026-09-22T11:00:00Z",
     "plain_english":"Battery charging at 25 kW — solar surplus after serving daytime load; SOC target 80% before evening peak.","top_features":[{"feature":"solar_surplus","contribution":0.50},{"feature":"soc_target","contribution":0.30},{"feature":"tariff_window","contribution":0.20}]},
    {"decision_id":"dec-005","decision_type":"lighting_dim","timestamp":"2026-09-22T10:20:00Z",
     "plain_english":"Focus Rooms 2A–2D lights off — no occupancy detected for 20 min and daylight contribution > 60%.","top_features":[{"feature":"occupancy","contribution":0.55},{"feature":"daylight_lux","contribution":0.35},{"feature":"schedule","contribution":0.10}]},
]

@xai_bp.route("/<building_id>/explanations/recent", methods=["GET"])
@login_required
def recent(building_id):
    err = require_building_access(building_id)
    if err: return err
    return jsonify({"building_id":building_id,"explanations":EXPLANATIONS})

@xai_bp.route("/nlq", methods=["POST"])
@login_required
def nlq():
    body = request.get_json(silent=True) or {}
    q = (body.get("question") or "").lower()
    bid = body.get("building_id","")
    if bid:
        err = require_building_access(bid)
        if err: return err
    if "spike" in q or "floor 3" in q:
        ans, src = ("Floor 3 energy rose mainly because Meeting 3A stayed in comfort mode until 11:40 and outdoor temp was 2°C above weekly average, increasing chiller load.","occupancy_hvac,fault_detection")
    elif "saved" in q or "savings" in q:
        ans, src = ("This week the building saved ~1,340 kWh (30%) vs fixed-schedule baseline (~₹9,380). Largest gains: Floors 1 & 3 conference setbacks.","occupancy_hvac")
    elif "equipment" in q or "attention" in q or "fault" in q or "chiller" in q:
        ans, src = ("Chiller-1 needs attention: power +14% above baseline. Recommend condenser inspection within 7 days. All other equipment healthy.","fault_detection")
    elif "solar" in q or "battery" in q:
        ans, src = ("Today solar generated 612 kWh with 74% self-consumption. Battery SOC is 68%; evening discharge window 18:00–22:00 is scheduled.","grid_solar")
    elif "ecbc" in q or "retrofit" in q:
        ans, src = ("Current EPI is above ECBC baseline for Composite climate. Top package (LED + VFD + controls) costs ~₹15L with ~16 month payback.","digital_twin")
    else:
        ans, src = ("I can answer about energy spikes, savings, equipment health, solar/battery, ECBC retrofits, and demand-response. Try: 'Why did Floor 3 spike?' or 'How much did we save this week?'","")
    return jsonify({"answer":ans,"sources":[s for s in src.split(",") if s],"question":body.get("question")})
