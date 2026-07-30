from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    result = register_user(name, email, password)

    if result["success"]:
        return jsonify({
            "message": result["message"]
        }), 201

    return jsonify({
        "message": result["message"]
    }), 400


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    result = login_user(email, password)

    if result["success"]:
        return jsonify({
            "message": result["message"],
            "user": result["user"]
        }), 200

    return jsonify({
        "message": result["message"]
    }), 401