from flask import Flask
from flask_cors import CORS

# Import Routes
from routes.trains import trains_bp
from routes.prediction import prediction_bp
from routes.dashboard import dashboard_bp
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(trains_bp)
app.register_blueprint(prediction_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp, url_prefix="/api")


@app.route("/")
def home():
    return {
        "message": "RailCrowd Backend API is running successfully!"
    }


if __name__ == "__main__":
    app.run(debug=True)