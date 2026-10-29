from services.train_service import get_all_train_numbers
from services.prediction_service import get_prediction_by_train_number


def get_dashboard_analytics():
    """Generate crowd and occupancy analytics for the dashboard."""

    print("📊 Generating dashboard analytics...")

    trains = get_all_train_numbers()

    if trains is None:
        print("❌ Unable to get train numbers")
        return None

    total_trains = 0
    low_crowd = 0
    medium_crowd = 0
    high_crowd = 0
    total_occupancy = 0.0
    predictions = []

    # Generate predictions for all trains
    for train in trains:
        if isinstance(train, dict):
            train_number = train.get("train_number")
        else:
            try:
                train_number = train[0]
            except (IndexError, TypeError):
                print(f"⚠️ Invalid train row: {train}")
                continue

        if not train_number:
            continue

        try:
            prediction = get_prediction_by_train_number(
                str(train_number)
            )
        except Exception as error:
            print(
                f"⚠️ Prediction failed for train "
                f"{train_number}: {error}"
            )
            continue

        if not isinstance(prediction, dict):
            print(
                f"⚠️ Skipping train {train_number}: "
                "prediction unavailable"
            )
            continue

        # Safely convert occupancy to a number
        try:
            occupancy = float(
                prediction.get("occupancy") or 0
            )
        except (TypeError, ValueError):
            occupancy = 0.0

        # Keep occupancy within a valid percentage range
        occupancy = max(0.0, min(100.0, occupancy))

        crowd = str(
            prediction.get("crowd") or ""
        ).strip().title()

        total_trains += 1
        total_occupancy += occupancy

        if crowd == "Low":
            low_crowd += 1
        elif crowd == "Medium":
            medium_crowd += 1
        elif crowd == "High":
            high_crowd += 1

        predictions.append({
            "train_number": prediction.get(
                "train_number", str(train_number)
            ),
            "train_name": prediction.get(
                "train_name", "Unknown Train"
            ),
            "source": prediction.get(
                "source_station", ""
            ) or "",
            "destination": prediction.get(
                "destination_station", ""
            ) or "",
            "occupancy": round(occupancy, 1),
            "crowd": crowd,
            "confidence": prediction.get(
                "confidence", 0
            )
        })

    # Calculate average occupancy
    average_occupancy = (
        round(total_occupancy / total_trains, 1)
        if total_trains > 0
        else 0
    )

    # Calculate crowd percentages
    if total_trains > 0:
        low_percentage = round(
            low_crowd / total_trains * 100, 1
        )
        medium_percentage = round(
            medium_crowd / total_trains * 100, 1
        )
        high_percentage = round(
            high_crowd / total_trains * 100, 1
        )
    else:
        low_percentage = 0
        medium_percentage = 0
        high_percentage = 0

    # Sort by occupancy, highest first
    predictions.sort(
        key=lambda item: item["occupancy"],
        reverse=True
    )

    # Group trains by crowd level
    high_crowd_trains = [
        train for train in predictions
        if train["crowd"] == "High"
    ]

    medium_crowd_trains = [
        train for train in predictions
        if train["crowd"] == "Medium"
    ]

    low_crowd_trains = [
        train for train in predictions
        if train["crowd"] == "Low"
    ]

    # Build the final analytics response
    result = {
        "summary": {
            "total_trains": total_trains,
            "average_occupancy": average_occupancy,
            "high_crowd_trains": high_crowd,
            "medium_crowd_trains": medium_crowd,
            "low_crowd_trains": low_crowd
        },
        "crowd_distribution": {
            "low": {
                "count": low_crowd,
                "percentage": low_percentage
            },
            "medium": {
                "count": medium_crowd,
                "percentage": medium_percentage
            },
            "high": {
                "count": high_crowd,
                "percentage": high_percentage
            }
        },
        "high_crowd_trains": high_crowd_trains,
        "medium_crowd_trains": medium_crowd_trains,
        "low_crowd_trains": low_crowd_trains,
        "all_predictions": predictions
    }

    print(
        f"✅ Analytics generated for {total_trains} trains"
    )
    print(f"📈 Average occupancy: {average_occupancy}%")
    print(f"🔴 High crowd: {high_crowd}")
    print(f"🟡 Medium crowd: {medium_crowd}")
    print(f"🟢 Low crowd: {low_crowd}")

    return result
