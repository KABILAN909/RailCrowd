import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function Prediction() {
  const { id } = useParams();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError("");

      try {
        console.log("🔍 Fetching prediction for train:", id);

        const response = await fetch(
          `http://127.0.0.1:5000/api/prediction/${id}`
        );

        const data = await response.json();

        console.log("🤖 Prediction API response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch prediction"
          );
        }

        // IMPORTANT:
        // Backend response is:
        // { success: true, prediction: {...} }

        setTrain(data.prediction);
      } catch (error) {
        console.error("❌ Prediction error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrediction();
    }
  }, [id]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05081c] text-white">
        <h1 className="text-3xl font-bold">
          🤖 Loading AI Prediction...
        </h1>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !train) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05081c] text-white px-6">

        <h1 className="text-3xl font-bold text-red-400 mb-4">
          ❌ Prediction Not Found
        </h1>

        <p className="text-gray-400 mb-8">
          {error || "Unable to load train prediction."}
        </p>

        <Link
          to="/trains"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
        >
          ← Back to Trains
        </Link>

      </div>
    );
  }

  // --------------------------------------------------
  // Crowd Color
  // --------------------------------------------------

  const crowdColor =
    train.crowd === "Low"
      ? "text-green-400"
      : train.crowd === "Medium"
      ? "text-yellow-400"
      : "text-red-500";

  const crowdBg =
    train.crowd === "Low"
      ? "bg-green-600"
      : train.crowd === "Medium"
      ? "bg-yellow-500"
      : "bg-red-600";

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-6 pt-32 pb-10">

      {/* Page Heading */}
      <h1 className="text-5xl font-bold text-center mb-12">
        🤖 AI Crowd Prediction
      </h1>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-[#131b31] rounded-2xl p-8 border border-blue-600 shadow-xl">

        {/* Train Name */}
        <div className="mb-10">

          <h2 className="text-4xl font-bold">
            🚆 {train.train_name || train.name}
          </h2>

          <p className="text-gray-400 mt-2">
            Train No: {train.train_number || train.number}
          </p>

        </div>

        {/* Train Details */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Train Number */}
          <div>
            <p className="text-gray-400">
              Train Number
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {train.train_number || train.number}
            </h3>
          </div>

          {/* Route */}
          <div>
            <p className="text-gray-400">
              Route
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {train.from || train.source_station}
              {" → "}
              {train.to || train.destination_station}
            </h3>
          </div>

          {/* Crowd */}
          <div>
            <p className="text-gray-400">
              Crowd Level
            </p>

            <div className="mt-3">
              <span
                className={`inline-block px-5 py-2 rounded-full text-white font-semibold ${crowdBg}`}
              >
                {train.crowd}
              </span>
            </div>
          </div>

          {/* Occupancy */}
          <div>
            <p className="text-gray-400">
              Expected Occupancy
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {train.occupancy}%
            </h3>
          </div>

          {/* Departure */}
          <div>
            <p className="text-gray-400">
              Departure
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {train.departure || train.departure_time || "N/A"}
            </h3>
          </div>

          {/* Arrival */}
          <div>
            <p className="text-gray-400">
              Arrival
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {train.arrival || train.arrival_time || "N/A"}
            </h3>
          </div>

          {/* Coach */}
          <div>
            <p className="text-gray-400">
              Recommended Coach
            </p>

            <h3 className="text-2xl font-bold mt-2">
              🚃 {train.coach || "General Coach"}
            </h3>
          </div>

          {/* Platform */}
          <div>
            <p className="text-gray-400">
              Platform
            </p>

            <h3 className="text-2xl font-bold mt-2">
              🚉 {train.platform || "To be announced"}
            </h3>
          </div>

        </div>

        {/* Occupancy Progress */}
        <div className="mt-10">

          <div className="flex justify-between mb-3">

            <p className="text-gray-300 font-semibold">
              Expected Occupancy
            </p>

            <p className="text-blue-400 font-semibold">
              {train.occupancy}%
            </p>

          </div>

          <div className="w-full bg-gray-700 rounded-full h-4">

            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${train.occupancy}%`,
              }}
            ></div>

          </div>

        </div>

        {/* AI Confidence */}
        <div className="mt-10">

          <p className="mb-3 text-gray-300 font-semibold">
            🤖 AI Confidence
          </p>

          <div className="w-full bg-gray-700 rounded-full h-4">

            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${train.confidence}%`,
              }}
            ></div>

          </div>

          <p className="mt-3 text-blue-400 font-semibold">
            {train.confidence}% Accurate Prediction
          </p>

        </div>

        {/* AI Recommendation */}
        <div className="mt-10 bg-[#0d1327] rounded-xl p-6 border border-gray-700">

          <h3 className="text-2xl font-bold mb-4">
            💡 AI Recommendation
          </h3>

          <p className="text-gray-300 leading-8">
            {train.recommendation}
          </p>

        </div>

        {/* Journey Summary */}
        <div className="mt-8 bg-[#0d1327] rounded-xl p-6 border border-gray-700">

          <h3 className="text-2xl font-bold mb-5">
            📋 Journey Summary
          </h3>

          <div className="space-y-3 text-gray-300">

            <p>
              🚆 <strong>Train:</strong>{" "}
              {train.train_name || train.name}
            </p>

            <p>
              🔢 <strong>Train Number:</strong>{" "}
              {train.train_number || train.number}
            </p>

            <p>
              📍 <strong>Route:</strong>{" "}
              {train.from || train.source_station}
              {" → "}
              {train.to || train.destination_station}
            </p>

            <p>
              🕒 <strong>Departure:</strong>{" "}
              {train.departure || train.departure_time || "N/A"}
            </p>

            <p>
              🕓 <strong>Arrival:</strong>{" "}
              {train.arrival || train.arrival_time || "N/A"}
            </p>

            <p>
              👥 <strong>Crowd:</strong>{" "}
              <span className={crowdColor}>
                {train.crowd}
              </span>
            </p>

            <p>
              📊 <strong>Occupancy:</strong>{" "}
              {train.occupancy}%
            </p>

            <p>
              🤖 <strong>AI Confidence:</strong>{" "}
              {train.confidence}%
            </p>

            <p>
              🚃 <strong>Suggested Coach:</strong>{" "}
              {train.coach || "General Coach"}
            </p>

            <p>
              🚉 <strong>Platform:</strong>{" "}
              {train.platform || "To be announced"}
            </p>

          </div>

        </div>

        {/* Back Button */}
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
  );
}

export default Prediction;