from flask import Blueprint, jsonify

from services.prediction_service import (
    get_prediction_by_train_number
)


# ============================================================
# Prediction Blueprint
# ============================================================

prediction_bp = Blueprint(
    "prediction",
    __name__
)


# ============================================================
# AI Crowd Prediction
#
# GET /api/prediction/<train_number>
#
# Example:
# http://127.0.0.1:5000/api/prediction/12608
# ============================================================

@prediction_bp.route(
    "/api/prediction/<train_number>",
    methods=["GET"]
)
def get_prediction(train_number):

    print(
        f"🔍 Prediction request received for train: {train_number}"
    )

    try:

        # ----------------------------------------------------
        # Get prediction from service
        # ----------------------------------------------------

        prediction = get_prediction_by_train_number(
            train_number
        )

        # ----------------------------------------------------
        # Prediction not found
        # ----------------------------------------------------

        if prediction is None:

            print(
                f"❌ No prediction found for train: {train_number}"
            )

            return jsonify({
                "success": False,
                "message": "Train prediction not found"
            }), 404

        # ----------------------------------------------------
        # Prediction successful
        # ----------------------------------------------------

        print(
            f"✅ Prediction generated for train: {train_number}"
        )

        return jsonify({
            "success": True,
            "prediction": prediction
        }), 200

    # --------------------------------------------------------
    # Unexpected error
    # --------------------------------------------------------

    except Exception as error:

        print(
            f"❌ Prediction route error: {error}"
        )

        return jsonify({
            "success": False,
            "message": "Internal server error",
            "error": str(error)
        }), 500