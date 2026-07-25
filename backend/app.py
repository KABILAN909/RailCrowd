from flask import Flask
from flask_cors import CORS

from routes.trains import trains_bp
from routes.prediction import prediction_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(trains_bp)
app.register_blueprint(prediction_bp)

# Home Route
@app.route("/")
def home():
    return "🚆 RailCrowd Backend is Running Successfully!"

if __name__ == "__main__":
    app.run(debug=True)