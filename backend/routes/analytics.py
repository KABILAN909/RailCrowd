from flask import Blueprint, jsonify

from services.analytics_service import (
    get_dashboard_analytics
)


# ============================================================
# Analytics Blueprint
# ============================================================

analytics_bp = Blueprint(
    "analytics",
    __name__
)


# ============================================================
# Get Dashboard Analytics
#
# GET /api/analytics
#
# Example:
# http://127.0.0.1:5000/api/analytics
# ============================================================

@analytics_bp.route(
    "/api/analytics",
    methods=["GET"]
)
def get_analytics():

    print(
        "📊 Analytics request received"
    )

    try:

        # ----------------------------------------------------
        # Generate analytics
        # ----------------------------------------------------

        analytics = get_dashboard_analytics()


        # ----------------------------------------------------
        # Analytics generation failed
        # ----------------------------------------------------

        if analytics is None:

            print(
                "❌ Unable to generate analytics"
            )

            return jsonify({

                "success": False,

                "message":
                    "Unable to generate dashboard analytics"

            }), 500


        # ----------------------------------------------------
        # Analytics generated successfully
        # ----------------------------------------------------

        print(
            "✅ Dashboard analytics generated successfully"
        )


        return jsonify({

            "success": True,

            "analytics":
                analytics

        }), 200


    # --------------------------------------------------------
    # Unexpected error
    # --------------------------------------------------------

    except Exception as error:

        print(
            f"❌ Analytics route error: {error}"
        )


        return jsonify({

            "success": False,

            "message":
                "Internal server error",

            "error":
                str(error)

        }), 500