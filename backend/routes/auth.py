
from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)


# ---------------- Register ---------------- #

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid JSON request"
        }), 400

    name = str(data.get("name") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    password = str(data.get("password") or "")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400

    try:
        result = register_user(name, email, password)

        if result.get("success"):
            return jsonify({
                "success": True,
                "message": result.get(
                    "message", "Registration successful"
                )
            }), 201

        return jsonify({
            "success": False,
            "message": result.get(
                "message", "Registration failed"
            )
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Registration failed due to a server error"
        }), 500


# ---------------- Login ---------------- #

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid JSON request"
        }), 400

    email = str(data.get("email") or "").strip().lower()
    password = str(data.get("password") or "")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    try:
        result = login_user(email, password)

        if result.get("success"):
            return jsonify({
                "success": True,
                "message": result.get(
                    "message", "Login successful"
                ),
                "user": result.get("user")
            }), 200

        return jsonify({
            "success": False,
            "message": result.get(
                "message", "Invalid email or password"
            )
        }), 401

    except Exception:
        return jsonify({
            "success": False,
            "message": "Login failed due to a server error"
        }), 500
