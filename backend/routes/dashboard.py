from flask import Blueprint, jsonify
from services.prediction_service import load_trains, generate_prediction

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard")
def dashboard():

    trains = load_trains()

    total = len(trains)
    low = 0
    medium = 0
    high = 0
    total_occupancy = 0

    for train in trains:
        prediction = generate_prediction(train)

        if prediction["crowd"] == "Low":
            low += 1
        elif prediction["crowd"] == "Medium":
            medium += 1
        else:
            high += 1

        total_occupancy += train["occupancy"]

    average = round(total_occupancy / total) if total else 0

    return jsonify({
        "totalTrains": total,
        "lowCrowd": low,
        "mediumCrowd": medium,
        "highCrowd": high,
        "averageOccupancy": average
    })