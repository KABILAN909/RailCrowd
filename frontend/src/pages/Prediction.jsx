import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Prediction() {
  const { id } = useParams();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // Fetch Prediction
  // ============================================================

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError("");

      try {
        console.log(
          "🔍 Fetching prediction for train:",
          id
        );

        const response = await fetch(
          `http://127.0.0.1:5000/api/prediction/${id}`
        );

        const data = await response.json();

        console.log(
          "🤖 Prediction API response:",
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to fetch prediction"
          );
        }

        setTrain(data.prediction);

      } catch (err) {
        console.error(
          "❌ Prediction error:",
          err
        );

        setError(
          err.message ||
            "Unable to load prediction"
        );

        setTrain(null);

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrediction();
    } else {
      setLoading(false);
      setError("Train number is missing.");
    }

  }, [id]);


  // ============================================================
  // Loading Screen
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05081c] text-white px-6">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl font-bold">
            🤖 Analyzing Train Crowd...
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Our AI is calculating occupancy and
            travel factors
          </p>

          <div className="mt-8 flex justify-center gap-2">

            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />

            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]" />

            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]" />

          </div>

        </div>

      </div>
    );
  }


  // ============================================================
  // Error Screen
  // ============================================================

  if (error || !train) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05081c] text-white px-6">

        <div className="max-w-lg w-full bg-[#131b31] border border-red-500/40 rounded-2xl p-8 text-center shadow-xl">

          <div className="text-6xl mb-6">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold text-red-400 mb-4">
            Prediction Not Available
          </h1>

          <p className="text-gray-400 leading-7 mb-8">
            {error ||
              "We couldn't load the AI crowd prediction for this train. Please try another train."}
          </p>

          <Link
            to="/trains"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            ← Back to Available Trains
          </Link>

        </div>

      </div>
    );
  }


  // ============================================================
  // Safe Values
  // ============================================================

  const crowd =
    train.crowd || "Medium";

  const occupancy = Math.min(
    Math.max(
      Number(train.occupancy || 0),
      0
    ),
    100
  );

  const confidence = Math.min(
    Math.max(
      Number(train.confidence || 0),
      0
    ),
    100
  );


  // ============================================================
  // Crowd Styling
  // ============================================================

  const crowdColor =
    crowd === "Low"
      ? "text-green-400"
      : crowd === "Medium"
      ? "text-yellow-400"
      : "text-red-400";


  const crowdBg =
    crowd === "Low"
      ? "bg-green-600"
      : crowd === "Medium"
      ? "bg-yellow-500"
      : "bg-red-600";


  const crowdBorder =
    crowd === "Low"
      ? "border-green-500/40"
      : crowd === "Medium"
      ? "border-yellow-500/40"
      : "border-red-500/40";


  // ============================================================
  // Crowd Message
  // ============================================================

  const crowdMessage =
    crowd === "Low"
      ? "Low crowd is expected. You can expect a more comfortable journey with better space and easier boarding."
      : crowd === "Medium"
      ? "Moderate crowd is expected. Try to reach the station 15–20 minutes early and avoid last-minute boarding."
      : "Heavy crowd is expected. Arrive early because unreserved coaches may fill quickly. Avoid last-minute boarding and follow station guidance.";


  // ============================================================
  // Prediction Factors
  // ============================================================

  const factors =
    train.prediction_factors || {};


  const baseOccupancy =
    Number(
      factors.base_occupancy ?? 50
    );


  const dayFactor =
    Number(
      factors.day_factor ?? 0
    );


  const departureFactor =
    Number(
      factors.departure_time_factor ?? 0
    );


  const distanceFactor =
    Number(
      factors.distance_factor ?? 0
    );


  const destinationFactor =
    Number(
      factors.destination_factor ?? 0
    );


  const routeFactor =
    Number(
      factors.route_factor ?? 0
    );


  const trainVariation =
    Number(
      factors.train_variation ?? 0
    );


  // ============================================================
  // Format Factor
  // ============================================================

  const formatFactor = (value) => {
    const number =
      Number(value || 0);

    if (number > 0) {
      return `+${number}%`;
    }

    if (number < 0) {
      return `${number}%`;
    }

    return "0%";
  };


  // ============================================================
  // Train Values
  // ============================================================

  const trainNumber =
    train.train_number ||
    train.number ||
    "N/A";


  const trainName =
    train.train_name ||
    train.name ||
    "Unknown Train";


  const from =
    train.from ||
    train.source_station ||
    "N/A";


  const to =
    train.to ||
    train.destination_station ||
    "N/A";


  const departure =
    train.departure ||
    train.departure_time ||
    "N/A";


  const arrival =
    train.arrival ||
    train.arrival_time ||
    "N/A";


  const distance =
    train.distance_km ?? 0;


  // ============================================================
  // Main UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-4 sm:px-6 pt-28 pb-12">

      {/* ===================================================== */}
      {/* Page Heading */}
      {/* ===================================================== */}

      <div className="text-center mb-10">

        <h1 className="text-4xl md:text-5xl font-bold">
          🤖 AI Crowd Prediction
        </h1>

        <p className="text-gray-400 mt-4 text-base md:text-lg">
          Smart crowd analysis based on journey
          and travel factors
        </p>

      </div>


      {/* ===================================================== */}
      {/* Main Container */}
      {/* ===================================================== */}

      <div className="max-w-5xl mx-auto">

        {/* =================================================== */}
        {/* Train Header */}
        {/* =================================================== */}

        <div className="bg-[#131b31] rounded-2xl p-6 md:p-8 border border-blue-600 shadow-xl">

          <div className="border-b border-gray-700 pb-6 mb-8">

            <h2 className="text-3xl md:text-4xl font-bold">
              🚆 {trainName}
            </h2>

            <p className="text-gray-400 mt-3">
              Train No: {trainNumber}
            </p>

          </div>


          {/* ================================================= */}
          {/* Crowd Result */}
          {/* ================================================= */}

          <div
            className={`bg-[#0d1327] rounded-2xl p-6 border ${crowdBorder}`}
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <p className="text-gray-400 mb-3">
                  Predicted Crowd Level
                </p>

                <h3
                  className={`text-4xl md:text-5xl font-bold ${crowdColor}`}
                >
                  🚦 {crowd.toUpperCase()} CROWD
                </h3>

              </div>


              <div
                className={`${crowdBg} px-7 py-4 rounded-full font-bold text-lg text-white shadow-lg`}
              >
                {occupancy}% Expected Occupancy
              </div>

            </div>


            <p className="text-gray-300 text-lg leading-8 mt-6">

              {train.recommendation ||
                crowdMessage}

            </p>

          </div>


          {/* ================================================= */}
          {/* Train Details */}
          {/* ================================================= */}

          <div className="mt-10">

            <h3 className="text-2xl font-bold mb-6">
              🚉 Train Details
            </h3>


            <div className="grid md:grid-cols-2 gap-5">

              {/* Route */}

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  📍 Route
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {from} → {to}
                </h4>

              </div>


              {/* Train Number */}

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  🔢 Train Number
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {trainNumber}
                </h4>

              </div>


              {/* Departure */}

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  🕒 Departure
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {departure}
                </h4>

              </div>


              {/* Arrival */}

              <div className="bg-[#0d1327] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  ⏱ Arrival
                </p>

                <h4 className="text-xl font-bold mt-3">
                  {arrival}
                </h4>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* Expected Occupancy */}
          {/* ================================================= */}

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

          </div>


          {/* ================================================= */}
          {/* AI Confidence */}
          {/* ================================================= */}

          <div className="mt-10">

            <div className="flex justify-between items-center mb-3">

              <p className="text-gray-300 font-semibold text-lg">
                🤖 AI Confidence
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

          </div>


          {/* ================================================= */}
          {/* Prediction Factors */}
          {/* ================================================= */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-blue-900">

            <h3 className="text-2xl font-bold">
              🧠 Prediction Factors
            </h3>

            <p className="text-gray-400 mt-2 mb-6">
              Factors considered while estimating
              train crowd occupancy
            </p>


            <div className="grid sm:grid-cols-2 gap-5">

              {/* Base Occupancy */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  📊 Base Occupancy
                </p>

                <p className="text-3xl font-bold mt-3">
                  {baseOccupancy}%
                </p>

              </div>


              {/* Day Factor */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  📅 Day Factor
                </p>

                <p className="text-3xl font-bold text-blue-400 mt-3">
                  {formatFactor(dayFactor)}
                </p>

              </div>


              {/* Departure Time Factor */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  🕒 Departure Time Factor
                </p>

                <p className="text-3xl font-bold text-yellow-400 mt-3">
                  {formatFactor(departureFactor)}
                </p>

              </div>


              {/* Distance Factor */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  📏 Distance Factor
                </p>

                <p className="text-3xl font-bold text-green-400 mt-3">
                  {formatFactor(distanceFactor)}
                </p>

              </div>


              {/* Destination Factor */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  🎯 Destination Factor
                </p>

                <p className="text-3xl font-bold text-purple-400 mt-3">
                  {formatFactor(destinationFactor)}
                </p>

              </div>


              {/* Route Factor */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400">
                  🛤️ Route Factor
                </p>

                <p className="text-3xl font-bold text-orange-400 mt-3">
                  {formatFactor(routeFactor)}
                </p>

              </div>


              {/* Train Variation */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5 sm:col-span-2">

                <p className="text-gray-400">
                  🚆 Train Variation
                </p>

                <p className="text-3xl font-bold text-cyan-400 mt-3">
                  {formatFactor(trainVariation)}
                </p>

              </div>

            </div>


            {/* ================================================= */}
            {/* Prediction Formula */}
            {/* ================================================= */}

            <div className="mt-6 bg-[#080d1f] rounded-xl p-5 border border-gray-800">

              <p className="text-sm text-gray-400 mb-4">
                Prediction Calculation
              </p>


              <div className="text-gray-300 leading-8">

                <p>
                  Base Occupancy
                  {" + "}
                  Day Factor
                  {" + "}
                  Departure Time Factor
                </p>

                <p>
                  {" + "}
                  Distance Factor
                  {" + "}
                  Destination Factor
                  {" + "}
                  Route Factor
                  {" + "}
                  Train Variation
                </p>


                <p className="mt-4 text-blue-400 font-bold text-lg md:text-xl">

                  = {baseOccupancy}%
                  {" "}
                  {formatFactor(dayFactor)}
                  {" "}
                  {formatFactor(departureFactor)}
                  {" "}
                  {formatFactor(distanceFactor)}
                  {" "}
                  {formatFactor(destinationFactor)}
                  {" "}
                  {formatFactor(routeFactor)}
                  {" "}
                  {formatFactor(trainVariation)}

                </p>


                <p className="mt-3 text-white font-bold text-lg">

                  Final Predicted Occupancy:
                  {" "}
                  {occupancy}%

                </p>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* AI Travel Recommendation */}
          {/* ================================================= */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-blue-900">

            <h3 className="text-2xl font-bold mb-4">
              💡 AI Travel Recommendation
            </h3>


            <p className="text-gray-300 text-lg leading-8">

              {train.recommendation ||
                "Travel according to the predicted crowd level and arrive at the station early for a smoother journey."}

            </p>


            <div className="grid sm:grid-cols-2 gap-5 mt-6">

              {/* Recommended Coach */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Recommended Coach
                </p>

                <p className="text-xl font-bold mt-3">

                  🚃{" "}

                  {train.coach ||
                    "General / Unreserved Coach"}

                </p>

              </div>


              {/* Platform */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Platform Information
                </p>

                <p className="text-xl font-bold mt-3">

                  🚉{" "}

                  {train.platform ||
                    "To be announced"}

                </p>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* Journey Summary */}
          {/* ================================================= */}

          <div className="mt-10 bg-[#0d1327] rounded-2xl p-6 border border-gray-700">

            <h3 className="text-2xl font-bold mb-6">
              📋 Journey Summary
            </h3>


            <div className="grid sm:grid-cols-2 gap-5 text-gray-300">

              {/* Train */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  🚆 Train
                </p>

                <p className="font-bold text-lg mt-2">
                  {trainName}
                </p>

              </div>


              {/* Train Number */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  🔢 Train Number
                </p>

                <p className="font-bold text-lg mt-2">
                  {trainNumber}
                </p>

              </div>


              {/* Route */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  📍 Route
                </p>

                <p className="font-bold text-lg mt-2">
                  {from} → {to}
                </p>

              </div>


              {/* Distance */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  📏 Distance
                </p>

                <p className="font-bold text-lg mt-2">
                  {distance} km
                </p>

              </div>


              {/* Departure */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  🕒 Departure
                </p>

                <p className="font-bold text-lg mt-2">
                  {departure}
                </p>

              </div>


              {/* Arrival */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  ⏱ Arrival
                </p>

                <p className="font-bold text-lg mt-2">
                  {arrival}
                </p>

              </div>


              {/* Crowd */}

              <div className="bg-[#131b31] border border-gray-700 rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  👥 Crowd Level
                </p>

                <p
                  className={`font-bold text-lg mt-2 ${crowdColor}`}
                >
                  {crowd}
                </p>

              </div>


              {/* Occupancy */}

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


          {/* ================================================= */}
          {/* Back Button */}
          {/* ================================================= */}

          <div className="mt-8">

            <Link
              to="/trains"
              className="block bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              ← Back to Available Trains
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Prediction;