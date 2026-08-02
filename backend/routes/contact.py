from flask import Blueprint, request, jsonify
from services.contact_service import save_contact

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/contact", methods=["POST"])
def contact():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    if not name or not email or not subject or not message:
        return jsonify({
            "message": "Please fill all fields."
        }), 400

    save_contact(data)

    return jsonify({
        "message": "Message sent successfully!"
    }), 201