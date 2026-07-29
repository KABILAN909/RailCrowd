import json


# Load all trains
def load_trains():
    with open("data/trains.json", "r") as file:
        return json.load(file)


# Load all stations
def load_stations():
    with open("data/stations.json", "r") as file:
        return json.load(file)


# AI Prediction Logic
def generate_prediction(train):
    occupancy = train["occupancy"]

    # Crowd Level
    if occupancy < 50:
        crowd = "Low"
        confidence = 98
        recommendation = "Comfortable journey. Seats are likely to be available."

    elif occupancy <= 80:
        crowd = "Medium"
        confidence = 95
        recommendation = "Moderate crowd expected. Arrive 20 minutes before departure."

    else:
        crowd = "High"
        confidence = 92
        recommendation = "Heavy crowd expected. Arrive 30–45 minutes early."

    return {
        "crowd": crowd,
        "occupancy": occupancy,
        "confidence": confidence,
        "recommendation": recommendation
    }


# Get train by ID
def get_train_by_id(train_id):
    trains = load_trains()

    for train in trains:
        if train["id"] == train_id:
            prediction = generate_prediction(train)
            train.update(prediction)
            return train

    return None