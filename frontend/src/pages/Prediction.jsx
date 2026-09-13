import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Prediction() {
  const { id } = useParams();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH PREDICTION
  // ============================================================

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError("");
      setTrain(null);

      if (!id) {
        setError("Train number is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/prediction/${encodeURIComponent(id)}`
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid response received from server.");
        }

        console.log("🤖 Prediction API response:", data);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Prediction service returned HTTP ${response.status}`
          );
        }

        if (!data?.success) {
          throw new Error(
            data?.message || "Prediction is not available."
          );
        }

        if (!data?.prediction) {
          throw new Error(
            "Prediction data is missing from the server response."
          );
        }

        setTrain(data.prediction);
      } catch (err) {
        console.error("❌ Prediction error:", err);

        setError(
          err?.message ||
            "Unable to load crowd prediction."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [id]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05081c] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl font-bold">
            🤖 Analyzing Train Crowd...
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Estimating expected crowd for the general /
            unreserved coaches
          </p>

          <div className="flex justify-center gap-2 mt-7">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !train) {
    return (
      <div className="min-h-screen bg-[#05081c] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-[#131b31] border border-red-500/40 rounded-2xl p-8 text-center shadow-xl">

          <div className="text-6xl mb-6">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold text-red-400 mb-4">
            Prediction Not Available
          </h1>

          <p className="text-gray-400 leading-7 mb-8">
            {error ||
              "We couldn't load the crowd prediction for this train."}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/trains"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              ← Back to Trains
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SAFE VALUES
  // ============================================================

  const trainNumber =
    train.train_number ||
    train.number ||
    id ||
    "N/A";

  const trainName =
    train.train_name ||
    train.name ||
    "Unknown Train";

  const from =
    train.from ||
    train.source_station ||
    train.source_station_name ||
    "N/A";

  const to =
    train.to ||
    train.destination_station ||
    train.destination_station_name ||
    "N/A";

  const departure =
    train.departure ||
    train.departure_time ||
    "N/A";

  const arrival =
    train.arrival ||
    train.arrival_time ||
    "N/A";

  const distance = Number(train.distance_km || 0);

  const occupancy = Math.min(
    Math.max(Number(train.occupancy ?? 0), 0),
    100
  );

  const confidence = Math.min(
    Math.max(Number(train.confidence ?? 0), 0),
    100
  );

  // IMPORTANT:
  // Crowd comes from backend.
  const crowd =
    train.crowd || "Unknown";

  const recommendation =
    train.recommendation ||
    "Travel according to the predicted crowd level and arrive early for a smoother journey.";

  const coach =
    train.coach ||
    "General / Unreserved Coach";

  const platform =
    train.platform ||
    "To be announced";

  // ============================================================
  // PREDICTION FACTORS
  // ============================================================

  const factors =
    train.prediction_factors || {};

  const baseOccupancy = Number(
    factors.base_occupancy ?? 45
  );

  const departureFactor = Number(
    factors.departure_time_factor ?? 0
  );

  const distanceFactor = Number(
    factors.distance_factor ?? 0
  );

  const trainVariation = Number(
    factors.train_variation ?? 0
  );

  const dayFactor = Number(
    factors.day_factor ?? 0
  );

  const routeFactor = Number(
    factors.route_factor ?? 0
  );

  const destinationFactor = Number(
    factors.destination_factor ?? 0
  );

  // ============================================================
  // HELPERS
  // ============================================================

  const formatFactor = (value) => {
    const number = Number(value || 0);

    if (number > 0) {
      return `+${number}%`;
    }

    if (number < 0) {
      return `${number}%`;
    }

    return "0%";
  };

  const crowdTextColor =
    crowd === "Low"
      ? "text-green-400"
      : crowd === "Medium"
      ? "text-yellow-400"
      : crowd === "High"
      ? "text-red-400"
      : "text-gray-400";

  const crowdBackground =
    crowd === "Low"
      ? "bg-green-600"
      : crowd === "Medium"
      ? "bg-yellow-500"
      : crowd === "High"
      ? "bg-red-600"
      : "bg-gray-600";

  const crowdBorder =
    crowd === "Low"
      ? "border-green-500/40"
      : crowd === "Medium"
      ? "border-yellow-500/40"
      : crowd === "High"
      ? "border-red-500/40"
      : "border-gray-700";

  const crowdMessage =
    crowd === "Low"
      ? "Lower crowd is expected. General / unreserved coaches may have relatively better space availability."
      : crowd === "Medium"
      ? "Moderate crowd is expected. Reaching the station 15–20 minutes early can make boarding easier."
      : crowd === "High"
      ? "Heavy crowd is expected. Reach the station early because general / unreserved coaches may fill quickly."
      : "Crowd level could not be determined.";

  // ============================================================
  // FACTOR CARD
  // ============================================================

  const FactorCard = ({
    icon,
    title,
    value,
    textColor = "text-blue-400",
  }) => (
    <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">
      <p className="text-gray-400">
        {icon} {title}
      </p>

      <p
        className={`text-3xl font-bold mt-3 ${textColor}`}
      >
        {value}
      </p>
    </div>
  );

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-4 sm:px-6 pt-28 pb-12">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="text-center max-w-4xl mx-auto mb-10">

        <h1 className="text-4xl md:text-5xl font-bold">
          🤖 AI Crowd Prediction
        </h1>

        <p className="text-gray-400 mt-4 text-base md:text-lg">
          Explainable crowd estimation for general /
          unreserved railway passengers
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
          📌 Train {trainNumber}
        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN CARD */}
      {/* ====================================================== */}

      <div className="max-w-5xl mx-auto">

        <div className="bg-[#131b31] rounded-2xl p-6 md:p-8 border border-blue-600 shadow-xl">

          {/* ================================================== */}
          {/* TRAIN HEADER */}
          {/* ================================================== */}

          <div className="border-b border-gray-700 pb-6">

            <h2 className="text-3xl md:text-4xl font-bold">
              🚆 {trainName}
            </h2>

            <p className="text-gray-400 mt-3">
              Train No: {trainNumber}
            </p>

          </div>

          {/* ================================================== */}
          {/* CROWD RESULT */}
          {/* ================================================== */}

          <div
            className={`mt-8 bg-[#0d1327] rounded-2xl p-6 border ${crowdBorder}`}
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <p className="text-gray-400 mb-3">
                  Predicted Crowd Level
                </p>

                <h3
                  className={`text-4xl md:text-5xl font-bold ${crowdTextColor}`}
                >
                  🚦 {crowd.toUpperCase()}
                </h3>
              </div>

              <div
                className={`${crowdBackground} px-7 py-4 rounded-full font-bold text-lg text-white shadow-lg text-center`}
              >
                {occupancy}% Expected Occupancy
              </div>

            </div>

            <p className="text-gray-300 text-lg leading-8 mt-6">
              {recommendation || crowdMessage}
            </p>

          </div>

          {/* ================================================== */}
          {/* OCCUPANCY */}
          {/* ================================================== */}

          <div className="mt-10">

            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-300 font-semibold text-lg">
                📊 Expected Occupancy
              </p>

              <p className="text-blue-400 font-bold text-lg">
                {occupancy}%
              </p>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">

              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${occupancy}%`,
                }}
              />

            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

          </div>

          {/* ================================================== */}
          {/* CONFIDENCE */}
          {/* ================================================== */}

          <div className="mt-8">

            <div className="flex justify-between items-center mb-3">

              <p className="text-gray-300 font-semibold text-lg">
                🤖 Prediction Confidence
              </p>

              <p className="text-blue-400 font-bold text-lg">
                {confidence}%
              </p>

            </div>

            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">

              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${confidence}%`,
                }}
              />

            </div>

            <p className="text-gray-500 text-sm mt-2">
              Confidence reflects the consistency of the
              rule-based prediction calculation.
            </p>

          </div>

          {/* ================================================== */}
          {/* CROWD INTERPRETATION */}
          {/* ================================================== */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-gray-700">

            <h3 className="text-2xl font-bold mb-4">
              👥 What This Means
            </h3>

            <p className="text-gray-300 text-lg leading-8">
              {crowdMessage}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">

              <div className="bg-[#131b31] rounded-xl p-4 border border-green-500/20">
                <p className="text-green-400 font-bold">
                  &lt; 50%
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Low Crowd
                </p>
              </div>

              <div className="bg-[#131b31] rounded-xl p-4 border border-yellow-500/20">
                <p className="text-yellow-400 font-bold">
                  50% – 75%
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Medium Crowd
                </p>
              </div>

              <div className="bg-[#131b31] rounded-xl p-4 border border-red-500/20">
                <p className="text-red-400 font-bold">
                  &gt; 75%
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  High Crowd
                </p>
              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* TRAIN DETAILS */}
          {/* ================================================== */}

          <div className="mt-10">

            <h3 className="text-2xl font-bold mb-6">
              🚉 Train Details
            </h3>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  📍 Route
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {from} → {to}
                </h4>
              </div>

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  🔢 Train Number
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {trainNumber}
                </h4>
              </div>

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  🕒 Departure
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {departure}
                </h4>
              </div>

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  ⏱ Arrival
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {arrival}
                </h4>
              </div>

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  📏 Journey Distance
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {distance > 0
                    ? `${distance} km`
                    : "Not available"}
                </h4>
              </div>

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400">
                  🚃 Coach
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {coach}
                </h4>
              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* PREDICTION FACTORS */}
          {/* ================================================== */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-blue-900">

            <h3 className="text-2xl font-bold">
              🧠 Prediction Factors
            </h3>

            <p className="text-gray-400 mt-2 mb-6">
              The estimate is calculated using multiple
              deterministic travel factors.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">

              <FactorCard
                icon="📊"
                title="Base Occupancy"
                value={`${baseOccupancy}%`}
              />

              <FactorCard
                icon="🕒"
                title="Departure Time"
                value={formatFactor(departureFactor)}
                textColor="text-yellow-400"
              />

              <FactorCard
                icon="📏"
                title="Distance"
                value={formatFactor(distanceFactor)}
                textColor="text-green-400"
              />

              <FactorCard
                icon="🚆"
                title="Train Variation"
                value={formatFactor(trainVariation)}
                textColor="text-cyan-400"
              />

              <FactorCard
                icon="📅"
                title="Day Factor"
                value={formatFactor(dayFactor)}
                textColor="text-blue-400"
              />

              <FactorCard
                icon="🛤️"
                title="Route Factor"
                value={formatFactor(routeFactor)}
                textColor="text-orange-400"
              />

              <FactorCard
                icon="🎯"
                title="Destination Factor"
                value={formatFactor(destinationFactor)}
                textColor="text-purple-400"
              />

            </div>

            {/* ================================================= */}
            {/* FORMULA */}
            {/* ================================================= */}

            <div className="mt-6 bg-[#080d1f] rounded-xl p-5 border border-gray-800">

              <p className="text-sm text-gray-400 mb-4">
                Prediction Calculation
              </p>

              <p className="text-gray-300 leading-8">
                Base Occupancy + Departure Time Factor +
                Distance Factor + Train Variation +
                Day Factor + Route Factor +
                Destination Factor
              </p>

              <p className="mt-5 text-blue-400 font-bold text-lg">
                {baseOccupancy}%
                {" "}
                {formatFactor(departureFactor)}
                {" "}
                {formatFactor(distanceFactor)}
                {" "}
                {formatFactor(trainVariation)}
                {" "}
                {formatFactor(dayFactor)}
                {" "}
                {formatFactor(routeFactor)}
                {" "}
                {formatFactor(destinationFactor)}
              </p>

              <p className="mt-4 text-white font-bold text-xl">
                Final Predicted Occupancy: {occupancy}%
              </p>

            </div>

          </div>

          {/* ================================================== */}
          {/* TRAVEL RECOMMENDATION */}
          {/* ================================================== */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-blue-900">

            <h3 className="text-2xl font-bold mb-4">
              💡 Travel Recommendation
            </h3>

            <p className="text-gray-300 text-lg leading-8">
              {recommendation}
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-6">

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400 text-sm">
                  🚃 Recommended Coach
                </p>

                <p className="text-xl font-bold mt-3">
                  {coach}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400 text-sm">
                  🚉 Platform Information
                </p>

                <p className="text-xl font-bold mt-3">
                  {platform}
                </p>
              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* JOURNEY SUMMARY */}
          {/* ================================================== */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-gray-700">

            <h3 className="text-2xl font-bold mb-6">
              📋 Journey Summary
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  🚆 Train
                </p>
                <p className="font-bold text-lg mt-2">
                  {trainName}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  🔢 Train Number
                </p>
                <p className="font-bold text-lg mt-2">
                  {trainNumber}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  📍 Route
                </p>
                <p className="font-bold text-lg mt-2">
                  {from} → {to}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  📏 Distance
                </p>
                <p className="font-bold text-lg mt-2">
                  {distance > 0
                    ? `${distance} km`
                    : "N/A"}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  🕒 Departure
                </p>
                <p className="font-bold text-lg mt-2">
                  {departure}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  ⏱ Arrival
                </p>
                <p className="font-bold text-lg mt-2">
                  {arrival}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  👥 Crowd Level
                </p>

                <p
                  className={`font-bold text-lg mt-2 ${crowdTextColor}`}
                >
                  {crowd}
                </p>
              </div>

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  📊 Occupancy
                </p>

                <p className="font-bold text-lg mt-2">
                  {occupancy}%
                </p>
              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* DISCLAIMER */}
          {/* ================================================== */}

          <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">

            <p className="text-gray-400 text-sm leading-6">
              ℹ️ This is an estimated crowd prediction based
              on the available train and travel factors. It
              should not be treated as real-time passenger
              counting or an official railway occupancy figure.
            </p>

          </div>

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <div className="mt-8 grid sm:grid-cols-2 gap-4">

            <Link
              to="/trains"
              className="bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              ← Back to Available Trains
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              🔄 Recalculate Prediction
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Prediction;