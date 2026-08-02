from flask import Blueprint, jsonify
from services.prediction_service import get_train_by_id

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.route("/prediction/<int:train_id>")
def get_prediction(train_id):

    train = get_train_by_id(train_id)

    if train:
        return jsonify(train)

    return jsonify({"error": "Train not found"}), 404