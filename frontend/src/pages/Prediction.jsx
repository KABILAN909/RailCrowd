import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Prediction() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/prediction/${id}`)
      .then((response) => response.json())
      .then((data) => setTrain(data))
      .catch((error) => console.error("Error fetching prediction:", error));
  }, [id]);

  if (!train) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05081c] text-white">
        <h1 className="text-3xl font-bold">Loading Prediction...</h1>
      </div>
    );
  }

  if (train.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05081c] text-white">
        <h1 className="text-3xl font-bold">🚆 Train Not Found</h1>
      </div>
    );
  }

  const crowdColor =
    train.crowd === "Low"
      ? "text-green-400"
      : train.crowd === "Medium"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-6 pt-32 pb-10">

      <h1 className="text-5xl font-bold text-center mb-12">
        🤖 AI Crowd Prediction
      </h1>

      <div className="max-w-5xl mx-auto bg-[#131b31] rounded-2xl p-8 border border-blue-600 shadow-xl">

        <h2 className="text-3xl font-bold mb-10">
          🚆 {train.name}
        </h2>

        {/* Train Details */}
        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <p className="text-gray-400">Train Number</p>
            <h3 className="text-3xl font-bold">{train.number}</h3>
          </div>

          <div>
            <p className="text-gray-400">Route</p>
            <h3 className="text-3xl font-bold">
              {train.from} → {train.to}
            </h3>
          </div>

          <div>
            <p className="text-gray-400">Crowd Level</p>
            <h3 className={`text-3xl font-bold ${crowdColor}`}>
              {train.crowd}
            </h3>
          </div>

          <div>
            <p className="text-gray-400">Expected Occupancy</p>
            <h3 className="text-3xl font-bold">
              {train.occupancy}%
            </h3>
          </div>

          <div>
            <p className="text-gray-400">Recommended Coach</p>
            <h3 className="text-3xl font-bold">
              {train.coach}
            </h3>
          </div>

          <div>
            <p className="text-gray-400">Platform</p>
            <h3 className="text-3xl font-bold">
              {train.platform}
            </h3>
          </div>

        </div>

        {/* AI Confidence */}
        <div className="mt-10">

          <p className="mb-3 text-gray-300 font-semibold">
            🤖 AI Confidence
          </p>

          <div className="w-full bg-gray-700 rounded-full h-4">

            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${train.confidence}%` }}
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

            {train.crowd === "High" &&
              "Heavy crowd is expected. Reserved passengers should board near the recommended coach. Unreserved passengers are advised to arrive 30–45 minutes early, as general coaches may fill quickly."}

            {train.crowd === "Medium" &&
              "Moderate crowd is expected. Reach the station about 20 minutes early and board the recommended coach for a smoother journey."}

            {train.crowd === "Low" &&
              "Low crowd is expected. You can expect a comfortable journey with easier boarding, shorter waiting time, and better seat availability."}

          </p>

        </div>

        {/* Journey Summary */}
        <div className="mt-8 bg-[#0d1327] rounded-xl p-6 border border-gray-700">

          <h3 className="text-2xl font-bold mb-5">
            📋 Journey Summary
          </h3>

          <div className="space-y-3 text-gray-300">

            <p>🚆 <strong>Train:</strong> {train.name}</p>
            <p>📍 <strong>Route:</strong> {train.from} → {train.to}</p>
            <p>🕒 <strong>Departure:</strong> {train.departure}</p>
            <p>🕓 <strong>Arrival:</strong> {train.arrival}</p>
            <p>🚉 <strong>Platform:</strong> {train.platform}</p>
            <p>🚃 <strong>Suggested Coach:</strong> {train.coach}</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Prediction;