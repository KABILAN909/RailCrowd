from flask import Blueprint, jsonify, request

from services.train_service import (
    get_train_by_number,
    search_trains
)


# ============================================================
# Blueprint
# ============================================================

train_bp = Blueprint("train", __name__)


# ============================================================
# Get train by train number
#
# GET /api/trains/12608
# ============================================================

@train_bp.route("/api/trains/<train_number>", methods=["GET"])
def get_train(train_number):

    try:
        trains = get_train_by_number(train_number)

        if trains is None:
            return jsonify({
                "success": False,
                "message": "Unable to fetch train data"
            }), 500

        if not trains:
            return jsonify({
                "success": False,
                "message": "Train not found"
            }), 404

        return jsonify({
            "success": True,
            "train": trains
        }), 200

    except Exception as error:

        print(f"❌ Train route error: {error}")

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500


# ============================================================
# Search trains between two stations
#
# Supports BOTH:
#
# GET /api/trains?from=SBC&to=MAS
#
# GET /api/trains/search?from=SBC&to=MAS
#
# ============================================================

@train_bp.route("/api/trains", methods=["GET"])
@train_bp.route("/api/trains/search", methods=["GET"])
def search_train_routes():

    from_code = request.args.get("from", "").strip().upper()
    to_code = request.args.get("to", "").strip().upper()

    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    if not from_code or not to_code:
        return jsonify({
            "success": False,
            "message": "From and To stations are required"
        }), 400

    if from_code == to_code:
        return jsonify({
            "success": False,
            "message": "From and To stations cannot be the same"
        }), 400

    # --------------------------------------------------------
    # Search database
    # --------------------------------------------------------

    try:

        trains = search_trains(
            from_code,
            to_code
        )

        if trains is None:
            return jsonify({
                "success": False,
                "message": "Unable to search trains"
            }), 500

        # ----------------------------------------------------
        # No trains found
        # ----------------------------------------------------

        if not trains:
            return jsonify({
                "success": True,
                "from": from_code,
                "to": to_code,
                "count": 0,
                "trains": [],
                "message": "No trains found for this route"
            }), 200

        # ----------------------------------------------------
        # Trains found
        # ----------------------------------------------------

        return jsonify({
            "success": True,
            "from": from_code,
            "to": to_code,
            "count": len(trains),
            "trains": trains
        }), 200

    except Exception as error:

        print(f"❌ Train search route error: {error}")

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500