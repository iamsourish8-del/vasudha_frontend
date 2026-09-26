"""Local development runner. Production uses Gunicorn via Procfile on Render."""
from app.main import app
import os

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    print(f"Vasudha — Green Habitat Energy Intelligence → http://{host}:{port}")
    print("Health: /health  |  Keepalive: /api/v1/keepalive")
    app.run(host=host, port=port, debug=True)
