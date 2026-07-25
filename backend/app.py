from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample Train Data
trains = [
    {
        "id": 1,
        "name": "Shatabdi Express",
        "number": "12007",
        "from": "Chennai",
        "to": "Coimbatore",
        "departure": "06:00 AM",
        "arrival": "01:30 PM",
        "crowd": "Medium",
        "occupancy": 72,
        "confidence": 98,
        "coach": "B2",
        "platform": "3"
    },
    {
        "id": 2,
        "name": "Brindavan Express",
        "number": "12639",
        "from": "Chennai",
        "to": "Bengaluru",
        "departure": "07:40 AM",
        "arrival": "01:50 PM",
        "crowd": "High",
        "occupancy": 91,
        "confidence": 95,
        "coach": "D1",
        "platform": "5"
    },
    {
        "id": 3,
        "name": "Kovai Express",
        "number": "12675",
        "from": "Chennai",
        "to": "Coimbatore",
        "departure": "02:15 PM",
        "arrival": "09:30 PM",
        "crowd": "Low",
        "occupancy": 45,
        "confidence": 99,
        "coach": "C1",
        "platform": "2"
    }
]

# Home Route
@app.route("/")
def home():
    return "🚆 RailCrowd Backend is Running Successfully!"

# Get All Trains
@app.route("/api/trains")
def get_trains():
    return jsonify(trains)

# Get Prediction by Train ID
@app.route("/api/prediction/<int:train_id>")
def get_prediction(train_id):

    for train in trains:
        if train["id"] == train_id:
            return jsonify(train)

    return jsonify({"error": "Train not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)