from flask import Blueprint, jsonify, request
from services.prediction_service import load_trains

trains_bp = Blueprint("trains", __name__)


# Get All Trains
@trains_bp.route("/api/trains")
def get_trains():
    return jsonify(load_trains())


# Search Trains
@trains_bp.route("/api/search")
def search_trains():

    from_station = request.args.get("from", "").lower()
    to_station = request.args.get("to", "").lower()

    trains = load_trains()

    results = []

    for train in trains:
        if (
            train["from"].lower() == from_station
            and train["to"].lower() == to_station
        ):
            results.append(train)

    return jsonify(results)