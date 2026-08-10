from flask import Blueprint, jsonify
from services.station_service import get_all_stations

stations_bp = Blueprint("stations", __name__)


@stations_bp.route("/api/stations", methods=["GET"])
def get_stations():

    stations = get_all_stations()

    if stations is None:
        return jsonify({
            "success": False,
            "message": "Unable to fetch stations"
        }), 500

    return jsonify({
        "success": True,
        "stations": stations
    }), 200