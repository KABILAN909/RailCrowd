from flask import Blueprint, jsonify
from services.prediction_service import load_trains

trains_bp = Blueprint("trains", __name__)


@trains_bp.route("/api/trains")
def get_trains():
    return jsonify(load_trains())