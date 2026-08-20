from services.train_service import get_all_train_numbers
from services.prediction_service import (
    get_prediction_by_train_number
)


# ============================================================
# Get Dashboard Analytics
# ============================================================

def get_dashboard_analytics():

    print("📊 Generating dashboard analytics...")

    # --------------------------------------------------------
    # Get all train numbers
    # --------------------------------------------------------

    trains = get_all_train_numbers()

    if trains is None:

        print(
            "❌ Unable to get train numbers"
        )

        return None

    # --------------------------------------------------------
    # Analytics counters
    # --------------------------------------------------------

    total_trains = 0

    low_crowd = 0
    medium_crowd = 0
    high_crowd = 0

    total_occupancy = 0

    predictions = []


    # --------------------------------------------------------
    # Generate prediction for every train
    # --------------------------------------------------------

    for train in trains:

        # Handle DictCursor result
        if isinstance(train, dict):

            train_number = train.get(
                "train_number"
            )

        # Handle tuple result
        else:

            train_number = train[0]


        if not train_number:

            continue


        # ----------------------------------------------------
        # Get prediction
        # ----------------------------------------------------

        prediction = get_prediction_by_train_number(
            str(train_number)
        )


        if prediction is None:

            print(
                f"⚠️ Skipping train {train_number}"
            )

            continue


        # ----------------------------------------------------
        # Update totals
        # ----------------------------------------------------

        total_trains += 1

        occupancy = prediction.get(
            "occupancy",
            0
        )

        crowd = prediction.get(
            "crowd",
            ""
        )


        total_occupancy += occupancy


        # ----------------------------------------------------
        # Crowd counters
        # ----------------------------------------------------

        if crowd == "Low":

            low_crowd += 1


        elif crowd == "Medium":

            medium_crowd += 1


        elif crowd == "High":

            high_crowd += 1


        # ----------------------------------------------------
        # Store prediction
        # ----------------------------------------------------

        predictions.append({

            "train_number": prediction.get(
                "train_number",
                str(train_number)
            ),

            "train_name": prediction.get(
                "train_name",
                "Unknown Train"
            ),

            "source": prediction.get(
                "source_station",
                ""
            ),

            "destination": prediction.get(
                "destination_station",
                ""
            ),

            "occupancy": occupancy,

            "crowd": crowd,

            "confidence": prediction.get(
                "confidence",
                0
            )

        })


    # --------------------------------------------------------
    # Calculate average occupancy
    # --------------------------------------------------------

    if total_trains > 0:

        average_occupancy = round(

            total_occupancy / total_trains,

            1

        )

    else:

        average_occupancy = 0


    # --------------------------------------------------------
    # Calculate percentages
    # --------------------------------------------------------

    if total_trains > 0:

        low_percentage = round(
            (low_crowd / total_trains) * 100,
            1
        )

        medium_percentage = round(
            (medium_crowd / total_trains) * 100,
            1
        )

        high_percentage = round(
            (high_crowd / total_trains) * 100,
            1
        )

    else:

        low_percentage = 0
        medium_percentage = 0
        high_percentage = 0


    # --------------------------------------------------------
    # Sort trains by occupancy
    # --------------------------------------------------------

    predictions.sort(

        key=lambda train:
        train.get(
            "occupancy",
            0
        ),

        reverse=True

    )


    # --------------------------------------------------------
    # High crowd trains
    # --------------------------------------------------------

    high_crowd_trains = [

        train

        for train in predictions

        if train.get(
            "crowd"
        ) == "High"

    ]


    # --------------------------------------------------------
    # Medium crowd trains
    # --------------------------------------------------------

    medium_crowd_trains = [

        train

        for train in predictions

        if train.get(
            "crowd"
        ) == "Medium"

    ]


    # --------------------------------------------------------
    # Low crowd trains
    # --------------------------------------------------------

    low_crowd_trains = [

        train

        for train in predictions

        if train.get(
            "crowd"
        ) == "Low"

    ]


    # --------------------------------------------------------
    # Final analytics result
    # --------------------------------------------------------

    result = {

        "summary": {

            "total_trains": total_trains,

            "average_occupancy":
                average_occupancy,

            "high_crowd_trains":
                high_crowd,

            "medium_crowd_trains":
                medium_crowd,

            "low_crowd_trains":
                low_crowd

        },


        "crowd_distribution": {

            "low": {

                "count": low_crowd,

                "percentage":
                    low_percentage

            },


            "medium": {

                "count": medium_crowd,

                "percentage":
                    medium_percentage

            },


            "high": {

                "count": high_crowd,

                "percentage":
                    high_percentage

            }

        },


        "high_crowd_trains":
            high_crowd_trains,


        "medium_crowd_trains":
            medium_crowd_trains,


        "low_crowd_trains":
            low_crowd_trains,


        "all_predictions":
            predictions

    }


    print(
        f"✅ Analytics generated for "
        f"{total_trains} trains"
    )


    print(
        f"📈 Average occupancy: "
        f"{average_occupancy}%"
    )


    print(
        f"🔴 High crowd: "
        f"{high_crowd}"
    )


    print(
        f"🟡 Medium crowd: "
        f"{medium_crowd}"
    )


    print(
        f"🟢 Low crowd: "
        f"{low_crowd}"
    )


    return result