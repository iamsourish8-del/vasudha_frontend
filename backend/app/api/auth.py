from flask import Blueprint, request, jsonify, g
from app.core.security import create_access_token, create_refresh_token, login_required

auth_bp = Blueprint("auth", __name__)

DEMO_USERS = {
    "facility@demo.com": {
        "user_id": "fm-001", "email": "facility@demo.com", "password": "demo123",
        "role": "facility_manager",
        "building_ids": ["bldg-aspiria-01", "bldg-capgemini-pune"],
        "full_name": "Priya Sharma",
    },
    "tenant@demo.com": {
        "user_id": "tn-001", "email": "tenant@demo.com", "password": "demo123",
        "role": "tenant", "building_ids": ["bldg-aspiria-01"],
        "full_name": "Arjun Mehta", "floor_id": "floor-3",
    },
    "maintenance@demo.com": {
        "user_id": "me-001", "email": "maintenance@demo.com", "password": "demo123",
        "role": "maintenance", "building_ids": ["bldg-aspiria-01", "bldg-capgemini-pune"],
        "full_name": "Vikram Singh",
    },
}

@auth_bp.route("/login", methods=["POST"])
def login():
    if request.is_json:
        data = request.get_json(silent=True) or {}
        username = data.get("username") or data.get("email", "")
        password = data.get("password", "")
    else:
        username = request.form.get("username", "")
        password = request.form.get("password", "")
    user = DEMO_USERS.get(username)
    if not user or user["password"] != password:
        return jsonify({"detail": "Incorrect email or password"}), 401
    token_data = {"sub": user["user_id"], "role": user["role"], "building_ids": user["building_ids"]}
    return jsonify({
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token({"sub": user["user_id"]}),
        "token_type": "bearer", "role": user["role"], "full_name": user["full_name"],
        "building_ids": user["building_ids"], "user_id": user["user_id"],
    })

@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({"user_id": g.user_id, "role": g.role, "building_ids": g.building_ids})
