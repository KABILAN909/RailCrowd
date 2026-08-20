from services.train_service import get_train_by_number
from datetime import datetime


# ============================================================
# HELPER: SAFE NUMBER CONVERSION
# ============================================================

def safe_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


# ============================================================
# ESTIMATE OCCUPANCY
# ============================================================

def estimate_occupancy(
    departure_time,
    distance=0,
    train_number="",
    source="",
    destination=""
):
    """
    Estimate train occupancy using multiple deterministic factors.

    Factors:
    - Base occupancy
    - Departure time
    - Journey distance
    - Train-specific variation
    - Current day
    - Route variation

    The result is kept deterministic so the same train and
    conditions produce a consistent prediction.
    """

    # --------------------------------------------------------
    # BASE OCCUPANCY
    # --------------------------------------------------------

    occupancy = 45

    factors = {
        "base_occupancy": 45,
        "departure_time_factor": 0,
        "distance_factor": 0,
        "train_variation": 0,
        "day_factor": 0,
        "route_factor": 0,
        "destination_factor": 0
    }


    # ========================================================
    # DEPARTURE TIME FACTOR
    # ========================================================

    try:

        hour = safe_int(
            str(departure_time).split(":")[0]
        )

        # Early morning
        if 4 <= hour < 6:
            factor = 5

        # Morning peak
        elif 6 <= hour < 10:
            factor = 22

        # Midday
        elif 10 <= hour < 16:
            factor = 5

        # Evening peak
        elif 16 <= hour < 21:
            factor = 25

        # Late night
        else:
            factor = -8

        occupancy += factor

        factors[
            "departure_time_factor"
        ] = factor

    except Exception:

        print(
            "⚠️ Unable to calculate departure time factor"
        )


    # ========================================================
    # DISTANCE FACTOR
    # ========================================================

    try:

        distance_value = float(
            distance or 0
        )

        if distance_value >= 1500:
            factor = 12

        elif distance_value >= 1000:
            factor = 10

        elif distance_value >= 500:
            factor = 7

        elif distance_value >= 200:
            factor = 4

        else:
            factor = 0

        occupancy += factor

        factors[
            "distance_factor"
        ] = factor

    except Exception:

        print(
            "⚠️ Unable to calculate distance factor"
        )


    # ========================================================
    # TRAIN-SPECIFIC VARIATION
    #
    # Gives each train a stable variation.
    # Example:
    # Train 12608 will always get the same variation.
    # ========================================================

    try:

        train_number_string = str(
            train_number
        )

        train_seed = sum(
            int(character)
            for character in train_number_string
            if character.isdigit()
        )

        factor = (
            train_seed % 17
        ) - 8

        occupancy += factor

        factors[
            "train_variation"
        ] = factor

    except Exception:

        print(
            "⚠️ Unable to calculate train variation"
        )


    # ========================================================
    # DAY FACTOR
    # ========================================================

    weekday = datetime.now().weekday()

    # Monday = 0
    # Tuesday = 1
    # Wednesday = 2
    # Thursday = 3
    # Friday = 4
    # Saturday = 5
    # Sunday = 6

    if weekday == 4:

        # Friday
        factor = 8

    elif weekday == 5:

        # Saturday
        factor = 5

    elif weekday == 6:

        # Sunday
        factor = 10

    else:

        factor = 0

    occupancy += factor

    factors[
        "day_factor"
    ] = factor


    # ========================================================
    # ROUTE FACTOR
    #
    # Creates deterministic route-based variation.
    # ========================================================

    try:

        route_string = (
            str(source).upper()
            +
            str(destination).upper()
        )

        route_seed = sum(
            ord(character)
            for character in route_string
        )

        factor = (
            route_seed % 11
        ) - 5

        occupancy += factor

        factors[
            "route_factor"
        ] = factor

    except Exception:

        print(
            "⚠️ Unable to calculate route factor"
        )


    # ========================================================
    # DESTINATION FACTOR
    #
    # Small deterministic adjustment based on destination.
    # ========================================================

    try:

        destination_string = str(
            destination
        ).upper()

        destination_seed = sum(
            ord(character)
            for character in destination_string
        )

        factor = (
            destination_seed % 7
        ) - 3

        occupancy += factor

        factors[
            "destination_factor"
        ] = factor

    except Exception:

        print(
            "⚠️ Unable to calculate destination factor"
        )


    # ========================================================
    # FINAL OCCUPANCY LIMIT
    # ========================================================

    occupancy = max(
        20,
        min(
            98,
            occupancy
        )
    )


    return {
        "occupancy": int(occupancy),
        "factors": factors
    }


# ============================================================
# GENERATE AI CROWD PREDICTION
# ============================================================

def generate_prediction(occupancy):
    """
    Convert occupancy percentage into:

    - Low crowd
    - Medium crowd
    - High crowd

    Recommendation is focused on General / Unreserved coaches.
    """

    # --------------------------------------------------------
    # LOW CROWD
    # --------------------------------------------------------

    if occupancy < 50:

        crowd = "Low"

        confidence = 96

        recommendation = (
            "Low crowd is expected in the general or "
            "unreserved coaches. You can expect a more "
            "comfortable boarding experience and better "
            "space availability."
        )

        coach = (
            "General / Unreserved Coach"
        )


    # --------------------------------------------------------
    # MEDIUM CROWD
    # --------------------------------------------------------

    elif occupancy <= 75:

        crowd = "Medium"

        confidence = 94

        recommendation = (
            "Moderate crowd is expected in the general or "
            "unreserved coaches. Try to reach the station "
            "15–20 minutes early and avoid last-minute boarding."
        )

        coach = (
            "General / Unreserved Coach"
        )


    # --------------------------------------------------------
    # HIGH CROWD
    # --------------------------------------------------------

    else:

        crowd = "High"

        confidence = 92

        recommendation = (
            "Heavy crowd is expected. Arrive 30–45 minutes "
            "early because unreserved coaches may fill quickly. "
            "Avoid last-minute boarding and follow station guidance."
        )

        coach = (
            "General / Unreserved Coach"
        )


    return {

        "crowd": crowd,

        "occupancy": occupancy,

        "confidence": confidence,

        "recommendation": recommendation,

        "coach": coach
    }


# ============================================================
# GET PREDICTION BY TRAIN NUMBER
# ============================================================

def get_prediction_by_train_number(train_number):

    print(
        f"🔍 Getting train data for prediction: "
        f"{train_number}"
    )


    # ========================================================
    # GET TRAIN DATA
    # ========================================================

    trains = get_train_by_number(
        train_number
    )


    if trains is None:

        print(
            "❌ Train service returned None"
        )

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


    # ========================================================
    # SORT STOPS BY DISTANCE
    #
    # This ensures the first stop is the source
    # and the last stop is the destination.
    # ========================================================

    try:

        trains = sorted(
            trains,
            key=lambda stop:
                float(
                    stop.get(
                        "distance_km",
                        0
                    ) or 0
                )
        )

    except Exception:

        print(
            "⚠️ Unable to sort train stops"
        )


    # ========================================================
    # SOURCE AND DESTINATION
    # ========================================================

    first_stop = trains[0]

    last_stop = trains[-1]


    # ========================================================
    # TRAIN DETAILS
    # ========================================================

    train_id = first_stop.get(
        "train_id"
    )


    train_number_value = first_stop.get(
        "train_number",
        train_number
    )


    train_name = first_stop.get(
        "train_name",
        "Unknown Train"
    )


    # ========================================================
    # SOURCE
    # ========================================================

    source = first_stop.get(
        "station_code",
        ""
    )


    source_name = first_stop.get(
        "station_name",
        ""
    )


    # ========================================================
    # DESTINATION
    # ========================================================

    destination = last_stop.get(
        "station_code",
        ""
    )


    destination_name = last_stop.get(
        "station_name",
        ""
    )


    # ========================================================
    # TIME DETAILS
    # ========================================================

    departure = first_stop.get(
        "departure_time",
        ""
    )


    arrival = last_stop.get(
        "arrival_time",
        ""
    )


    # ========================================================
    # JOURNEY DISTANCE
    # ========================================================

    distance = last_stop.get(
        "distance_km",
        0
    )


    # ========================================================
    # DYNAMIC OCCUPANCY PREDICTION
    # ========================================================

    occupancy_result = estimate_occupancy(

        departure_time=departure,

        distance=distance,

        train_number=train_number_value,

        source=source,

        destination=destination
    )


    occupancy = occupancy_result.get(
        "occupancy",
        50
    )


    print(
        f"📈 Predicted occupancy: "
        f"{occupancy}%"
    )


    # ========================================================
    # GENERATE CROWD LEVEL
    # ========================================================

    prediction = generate_prediction(
        occupancy
    )


    # ========================================================
    # BUILD FINAL RESPONSE
    # ========================================================

    result = {

        # ----------------------------------------------------
        # DATABASE / TRAIN DETAILS
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # FRONTEND FRIENDLY FIELDS
        # ----------------------------------------------------

        "number": str(
            train_number_value
        ),


        "name": train_name,


        "from": source,


        "to": destination,


        "departure": departure,


        "arrival": arrival,


        # ----------------------------------------------------
        # AI PREDICTION
        # ----------------------------------------------------

        "occupancy": prediction[
            "occupancy"
        ],


        "crowd": prediction[
            "crowd"
        ],


        "confidence": prediction[
            "confidence"
        ],


        "recommendation": prediction[
            "recommendation"
        ],


        "coach": prediction[
            "coach"
        ],


        # ----------------------------------------------------
        # PREDICTION FACTORS
        # ----------------------------------------------------

        "prediction_factors":
            occupancy_result[
                "factors"
            ],


        # ----------------------------------------------------
        # PLATFORM
        # ----------------------------------------------------

        "platform":
            "To be announced"
    }


    print(
        f"🤖 Prediction: "
        f"{prediction['crowd']} crowd "
        f"({prediction['occupancy']}%)"
    )


    return result