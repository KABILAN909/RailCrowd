from services.train_service import get_train_by_number


# ============================================================
# Estimate Occupancy
# ============================================================

def estimate_occupancy(departure_time):
    """
    Estimate crowd percentage based on departure time.

    This is a temporary prediction model because the database
    currently does not contain actual passenger occupancy data.
    """

    if not departure_time:
        return 60

    try:
        hour = int(str(departure_time).split(":")[0])

        # Morning peak
        if 6 <= hour < 10:
            return 80

        # Midday
        elif 10 <= hour < 16:
            return 50

        # Evening peak
        elif 16 <= hour < 21:
            return 85

        # Night
        else:
            return 40

    except Exception:
        return 60


# ============================================================
# Generate AI Crowd Prediction
# ============================================================

def generate_prediction(occupancy):

    if occupancy < 50:

        crowd = "Low"
        confidence = 98

        recommendation = (
            "Low crowd is expected. "
            "You can expect a comfortable journey "
            "with better seat availability."
        )

        coach = "Any Coach"

    elif occupancy <= 80:

        crowd = "Medium"
        confidence = 95

        recommendation = (
            "Moderate crowd is expected. "
            "Reach the station about 20 minutes early "
            "and board the recommended coach."
        )

        coach = "General Coach"

    else:

        crowd = "High"
        confidence = 92

        recommendation = (
            "Heavy crowd is expected. "
            "Arrive 30–45 minutes early because "
            "general coaches may fill quickly."
        )

        coach = "Reserved Coach"

    return {
        "crowd": crowd,
        "occupancy": occupancy,
        "confidence": confidence,
        "recommendation": recommendation,
        "coach": coach
    }


# ============================================================
# Get Prediction By Train Number
# ============================================================

def get_prediction_by_train_number(train_number):

    print(
        f"🔍 Getting train data for prediction: {train_number}"
    )

    # --------------------------------------------------------
    # Get train information from database
    # --------------------------------------------------------

    trains = get_train_by_number(train_number)

    if trains is None:

        print("❌ Train service returned None")

        return None

    if not trains:

        print(
            f"❌ Train {train_number} not found"
        )

        return None

    print(
        f"✅ Train {train_number} found"
    )

    print(
        f"📊 Stops found: {len(trains)}"
    )

    # --------------------------------------------------------
    # First stop = source/departure
    # Last stop = destination/arrival
    # --------------------------------------------------------

    first_stop = trains[0]
    last_stop = trains[-1]

    # --------------------------------------------------------
    # Train details
    # --------------------------------------------------------

    train_id = first_stop.get("train_id")

    train_number_value = first_stop.get(
        "train_number",
        train_number
    )

    train_name = first_stop.get(
        "train_name",
        "Unknown Train"
    )

    source = first_stop.get(
        "station_code",
        ""
    )

    source_name = first_stop.get(
        "station_name",
        ""
    )

    destination = last_stop.get(
        "station_code",
        ""
    )

    destination_name = last_stop.get(
        "station_name",
        ""
    )

    departure = first_stop.get(
        "departure_time",
        ""
    )

    arrival = last_stop.get(
        "arrival_time",
        ""
    )

    # --------------------------------------------------------
    # Calculate distance
    # --------------------------------------------------------

    distance = last_stop.get(
        "distance_km"
    )

    # --------------------------------------------------------
    # Estimate occupancy
    # --------------------------------------------------------

    occupancy = estimate_occupancy(
        departure
    )

    print(
        f"📈 Estimated occupancy: {occupancy}%"
    )

    # --------------------------------------------------------
    # Generate prediction
    # --------------------------------------------------------

    prediction = generate_prediction(
        occupancy
    )

    # --------------------------------------------------------
    # Build final response
    # --------------------------------------------------------

    result = {

        "id": train_id,

        "train_number": str(
            train_number_value
        ),

        "train_name": train_name,

        "source_station": source,

        "source_station_name": source_name,

        "destination_station": destination,

        "destination_station_name": destination_name,

        "departure_time": departure,

        "arrival_time": arrival,

        "distance_km": distance,

        # Frontend-friendly fields

        "number": str(
            train_number_value
        ),

        "name": train_name,

        "from": source,

        "to": destination,

        "departure": departure,

        "arrival": arrival,

        # Prediction

        "occupancy": prediction["occupancy"],

        "crowd": prediction["crowd"],

        "confidence": prediction["confidence"],

        "recommendation": prediction["recommendation"],

        "coach": prediction["coach"],

        "platform": "To be announced"
    }

    print(
        f"🤖 Prediction: "
        f"{prediction['crowd']} crowd "
        f"({prediction['occupancy']}%)"
    )

    return result