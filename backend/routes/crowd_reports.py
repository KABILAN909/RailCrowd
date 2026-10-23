
from flask import Blueprint, jsonify, request

from services.crowd_report_service import (
    create_crowd_report,
    get_recent_crowd_reports
)


# ============================================================
# Blueprint
# ============================================================

crowd_reports_bp = Blueprint(
    "crowd_reports",
    __name__
)


# ============================================================
# Submit Crowd Report
#
# POST /api/crowd-reports
# ============================================================

@crowd_reports_bp.route(
    "/api/crowd-reports",
    methods=["POST"]
)
def submit_crowd_report():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "A valid JSON request body is required"
        }), 400

    train_id = data.get("train_id")
    station_id = data.get("station_id")
    crowd_level = data.get("crowd_level")
    occupancy = data.get("occupancy")
    coach = data.get("coach")

    # Validate IDs
    try:
        if isinstance(train_id, bool) or isinstance(station_id, bool):
            raise ValueError

        train_id = int(train_id)
        station_id = int(station_id)

        if train_id <= 0 or station_id <= 0:
            raise ValueError

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Valid train_id and station_id are required"
        }), 400

    # Validate crowd level
    allowed_levels = {
        "Low",
        "Medium",
        "High",
        "Very High"
    }

    if crowd_level not in allowed_levels:
        return jsonify({
            "success": False,
            "message": (
                "crowd_level must be Low, Medium, "
                "High, or Very High"
            )
        }), 400

    # Validate occupancy
    try:
        if isinstance(occupancy, bool):
            raise ValueError

        occupancy_value = float(occupancy)

        if (
            not occupancy_value.is_integer()
            or not 0 <= occupancy_value <= 100
        ):
            raise ValueError

        occupancy = int(occupancy_value)

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Occupancy must be a whole number from 0 to 100"
        }), 400

    # Validate coach
    if not isinstance(coach, str):
        return jsonify({
            "success": False,
            "message": "Coach is required"
        }), 400

    coach = coach.strip()

    if not coach or len(coach) > 20:
        return jsonify({
            "success": False,
            "message": "Coach must contain 1 to 20 characters"
        }), 400

    try:
        report_id = create_crowd_report(
            train_id=train_id,
            station_id=station_id,
            crowd_level=crowd_level,
            occupancy=occupancy,
            coach=coach
        )

        if report_id is None:
            return jsonify({
                "success": False,
                "message": (
                    "Could not save the report. "
                    "Check the database and submitted IDs."
                )
            }), 500

        return jsonify({
            "success": True,
            "message": "Crowd report submitted successfully",
            "report_id": report_id,
            "report": {
                "train_id": train_id,
                "station_id": station_id,
                "crowd_level": crowd_level,
                "occupancy": occupancy,
                "coach": coach,
                "source": "passenger",
                "status": "reported"
            }
        }), 201

    except Exception as error:
        print("Crowd report route error:", error)

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500


# ============================================================
# Get Recent Crowd Reports
#
# GET /api/crowd-reports
# ============================================================

@crowd_reports_bp.route(
    "/api/crowd-reports",
    methods=["GET"]
)
def list_crowd_reports():

    try:
        reports = get_recent_crowd_reports()

        if reports is None:
            return jsonify({
                "success": False,
                "message": "Unable to fetch crowd reports"
            }), 500

        return jsonify({
            "success": True,
            "count": len(reports),
            "reports": reports
        }), 200

    except Exception as error:
        print("Get crowd reports route error:", error)

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500
