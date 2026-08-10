from flask import Flask, jsonify
from flask_cors import CORS

# Routes
from routes.auth import auth_bp
from routes.train_routes import train_bp
from routes.stations import stations_bp


# --------------------------------------------------
# Create Flask App
# --------------------------------------------------

app = Flask(__name__)

# Allow React frontend to access Flask API
CORS(app)


# --------------------------------------------------
# Register Blueprints
# --------------------------------------------------

app.register_blueprint(auth_bp)
app.register_blueprint(train_bp)
app.register_blueprint(stations_bp)


# --------------------------------------------------
# Home / Health Check
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "RailCrowd API is running"
    }), 200


# --------------------------------------------------
# API Health Check
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "RailCrowd backend is healthy"
    }), 200


# --------------------------------------------------
# Error Handlers
# --------------------------------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "API endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


# --------------------------------------------------
# Run Server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )