"""Vasudha — Green Habitat Energy Intelligence (Flask, pure Python)."""
from flask import Flask, jsonify, request
from flask_cors import CORS
from app.core.config import settings
from app.api.auth import auth_bp
from app.api.bff import bff_bp
from app.modules.occupancy_hvac.router import occupancy_bp
from app.modules.digital_twin.router import digital_twin_bp
from app.modules.fault_detection.router import fault_bp
from app.modules.grid_solar.router import grid_bp
from app.modules.xai_nlq.router import xai_bp
from app.modules.tenant_gamification.router import tenant_bp


def _cors_origin_allowed(origin) -> bool:
    """Allow exact matches and simple https://*.vercel.app wildcard."""
    if not origin:
        return False
    allowed = settings.CORS_ORIGINS
    if origin in allowed:
        return True
    if settings.FRONTEND_URL and origin == settings.FRONTEND_URL.rstrip("/"):
        return True
    # Vercel preview + production pattern
    if origin.startswith("https://") and origin.endswith(".vercel.app"):
        return True
    if "https://*.vercel.app" in allowed and origin.startswith("https://") and ".vercel.app" in origin:
        return True
    return False


def create_app():
    app = Flask(__name__)

    # CORS: support credentials + dynamic origin check for Vercel
    CORS(
        app,
        origins=settings.CORS_ORIGINS if "https://*.vercel.app" not in settings.CORS_ORIGINS else "*",
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    # Explicit after-request CORS for wildcard vercel (flask-cors * with credentials can be picky)
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if _cors_origin_allowed(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return response

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(bff_bp, url_prefix="/api/v1/bff")
    app.register_blueprint(occupancy_bp, url_prefix="/api/v1/occupancy")
    app.register_blueprint(digital_twin_bp, url_prefix="/api/v1/digital-twin")
    app.register_blueprint(fault_bp, url_prefix="/api/v1/faults")
    app.register_blueprint(grid_bp, url_prefix="/api/v1/grid-solar")
    app.register_blueprint(xai_bp, url_prefix="/api/v1/xai")
    app.register_blueprint(tenant_bp, url_prefix="/api/v1/tenant")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "vasudha-habitat", "version": "1.1.0"})

    @app.get("/api/v1/keepalive")
    def keepalive():
        """Lightweight ping used by frontend / external monitors to prevent Render free-tier sleep."""
        return jsonify({"status": "alive", "service": "vasudha-habitat"})

    @app.get("/")
    def root():
        return jsonify({
            "name": "Vasudha — Green Habitat Energy Intelligence",
            "track": "NGEC Sustainable Habitat",
            "health": "/health",
            "keepalive": "/api/v1/keepalive",
            "api": "/api/v1",
            "modules": ["auth", "bff", "occupancy", "digital-twin", "faults", "grid-solar", "xai", "tenant"],
        })

    return app


app = create_app()
