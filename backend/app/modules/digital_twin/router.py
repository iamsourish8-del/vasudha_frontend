from flask import Blueprint, jsonify, request
from app.core.security import login_required, require_building_access

digital_twin_bp = Blueprint("digital_twin", __name__)
ECBC = {"Hot and Dry":90,"Warm and Humid":100,"Composite":120,"Temperate":110,"Cold":140}

@digital_twin_bp.route("/<building_id>/simulate", methods=["POST"])
@login_required
def simulate(building_id):
    err = require_building_access(building_id)
    if err: return err
    b = request.get_json(silent=True) or {}
    climate = b.get("climate_zone","Composite")
    area = float(b.get("total_floor_area_m2",12500))
    lighting = float(b.get("lighting_w_per_m2",12))
    hours = float(b.get("daily_operating_hours",12))
    wwr = float(b.get("window_to_wall_ratio",0.35))
    ac = float(b.get("ac_tonnage",220))
    base = ECBC.get(climate,120)
    epi = round(base*0.65 + lighting*2.8 + wwr*45 + (ac/area)*900 + hours*1.3, 1)
    gap = round(max(0,(epi-base)/base*100),1)
    retrofits = [
        {"id":"rt1","name":"LED lighting retrofit (entire building)","category":"Lighting","cost_inr":680000,"annual_savings_kwh":125000,"payback_months":12,"epi_reduction":14,"co2_tonnes_yr":102},
        {"id":"rt2","name":"VFD on AHU & primary pumps","category":"HVAC","cost_inr":520000,"annual_savings_kwh":78000,"payback_months":15,"epi_reduction":9,"co2_tonnes_yr":64},
        {"id":"rt3","name":"High-performance double glazing (S/W facade)","category":"Envelope","cost_inr":1850000,"annual_savings_kwh":92000,"payback_months":30,"epi_reduction":11,"co2_tonnes_yr":75},
        {"id":"rt4","name":"Roof insulation + cool-roof coating","category":"Envelope","cost_inr":740000,"annual_savings_kwh":48000,"payback_months":26,"epi_reduction":6,"co2_tonnes_yr":39},
        {"id":"rt5","name":"Smart thermostat + zone dampers","category":"Controls","cost_inr":310000,"annual_savings_kwh":55000,"payback_months":11,"epi_reduction":7,"co2_tonnes_yr":45},
    ]
    return jsonify({
        "building_id":building_id,"calculated_epi":epi,"ecbc_baseline_epi":base,
        "compliance_gap_pct":gap,"is_compliant":epi<=base,
        "ranked_retrofits":retrofits,
        "recommended_package_cost":sum(r["cost_inr"] for r in retrofits[:3]),
        "recommended_package_savings_kwh":sum(r["annual_savings_kwh"] for r in retrofits[:3]),
        "recommended_package_payback_months":16,
        "climate_zone":climate,"area_m2":area,
    })

@digital_twin_bp.route("/<building_id>/ecbc-lookup", methods=["GET"])
@login_required
def ecbc_lookup(building_id):
    err = require_building_access(building_id)
    if err: return err
    return jsonify({"baselines":ECBC,"unit":"kWh/m²/year","source":"BEE ECBC 2017 (commercial)"})
