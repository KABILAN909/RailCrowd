from flask import Flask, jsonify
from flask_cors import CORS


# ============================================================
# Routes
# ============================================================

from routes.auth import auth_bp
from routes.train_routes import train_bp
from routes.stations import stations_bp
from routes.prediction import prediction_bp
from routes.analytics import analytics_bp


# ============================================================
# Create Flask App
# ============================================================

app = Flask(__name__)


# ============================================================
# Enable CORS
#
# Allow React frontend to access Flask API
# ============================================================

CORS(app)


# ============================================================
# Register Blueprints
# ============================================================

app.register_blueprint(auth_bp)

app.register_blueprint(train_bp)

app.register_blueprint(stations_bp)

app.register_blueprint(prediction_bp)

app.register_blueprint(analytics_bp)


# ============================================================
# Home / Health Check
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "RailCrowd API is running"
    }), 200


# ============================================================
# API Health Check
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "message": "RailCrowd backend is healthy"
    }), 200


# ============================================================
# Error Handler - 404
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({
        "success": False,
        "message": "API endpoint not found"
    }), 404


# ============================================================
# Error Handler - 500
# ============================================================

@app.errorhandler(500)
def internal_error(error):

    print(
        "❌ INTERNAL SERVER ERROR:",
        error
    )

    return jsonify({
        "success": False,
        "message": "Internal server error",
        "error": str(error)
    }), 500


# ============================================================
# Run Server
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )