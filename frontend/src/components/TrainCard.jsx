import { Link } from "react-router-dom";

function TrainCard({ train }) {
  const crowdColor =
    train.crowd === "Low"
      ? "bg-green-600"
      : train.crowd === "Medium"
      ? "bg-yellow-500"
      : "bg-red-600";

  return (
    <div className="bg-[#131b31] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-blue-500 hover:scale-105 transition duration-300">

      {/* Train Name */}
      <h2 className="text-3xl font-bold text-white mb-2">
        🚆 {train.name}
      </h2>

      {/* Train Number */}
      <p className="text-gray-400 mb-5">
        Train No: {train.number}
      </p>

      {/* Route */}
      <div className="flex justify-between items-center text-lg text-gray-300">
        <span>{train.from}</span>
        <span>→</span>
        <span>{train.to}</span>
      </div>

      {/* Timings */}
      <div className="flex justify-between mt-3 text-gray-400">
        <span>{train.departure}</span>
        <span>{train.arrival}</span>
      </div>

      {/* Crowd Badge */}
      <div className="mt-6">
        <span
          className={`px-5 py-2 rounded-full text-white font-semibold ${crowdColor}`}
        >
          Crowd : {train.crowd}
        </span>
      </div>

      {/* Occupancy */}
      <div className="mt-6">
        <p className="text-gray-300 mb-2">
          Occupancy : {train.occupancy}%
        </p>

        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full"
            style={{ width: `${train.occupancy}%` }}
          ></div>
        </div>
      </div>

      {/* AI Details */}
      <div className="mt-6 space-y-3 text-gray-300">
        <p>🤖 AI Confidence : {train.confidence}%</p>
        <p>🚃 Recommended Coach : {train.coach}</p>
        <p>🚉 Platform : {train.platform}</p>
      </div>

      {/* Prediction Button */}
      <Link
        to={`/prediction/${train.id}`}
        className="block mt-8 bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
      >
        View Prediction
      </Link>

    </div>
  );
}

export default TrainCard;