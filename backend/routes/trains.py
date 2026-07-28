from flask import Blueprint, jsonify, request
from services.prediction_service import load_trains, load_stations

trains_bp = Blueprint("trains", __name__)


# Get All Trains
@trains_bp.route("/api/trains")
def get_trains():
    return jsonify(load_trains())


# Get All Stations
@trains_bp.route("/api/stations")
def get_stations():
    return jsonify(load_stations())


# Search Trains
@trains_bp.route("/api/search")
def search_trains():

    from_station = request.args.get("from", "").strip().lower()
    to_station = request.args.get("to", "").strip().lower()

    trains = load_trains()

    results = []

    for train in trains:
        if (
            train["from"].strip().lower() == from_station
            and train["to"].strip().lower() == to_station
        ):
            results.append(train)

    return jsonify(results)