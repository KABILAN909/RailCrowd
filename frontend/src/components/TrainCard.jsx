
import { Link } from "react-router-dom";

function TrainCard({ train }) {
  const trainNumber = String(
    train.train_number ?? train.number ?? ""
  );

  const trainName =
    train.train_name ?? train.name ?? "Unknown Train";

  const from =
    train.from_station_code ??
    train.from_station_name ??
    train.source_station ??
    train.from ??
    "N/A";

  const to =
    train.to_station_code ??
    train.to_station_name ??
    train.destination_station ??
    train.to ??
    "N/A";

  const departure =
    train.departure_time ?? train.departure ?? null;

  const arrival =
    train.arrival_time ?? train.arrival ?? null;

  const rawOccupancy = Number(train.occupancy);
  const occupancy =
    train.occupancy !== null &&
    train.occupancy !== undefined &&
    train.occupancy !== "" &&
    Number.isFinite(rawOccupancy)
      ? Math.min(100, Math.max(0, rawOccupancy))
      : null;

  const rawConfidence = Number(train.confidence);
  const confidence =
    train.confidence !== null &&
    train.confidence !== undefined &&
    train.confidence !== "" &&
    Number.isFinite(rawConfidence)
      ? rawConfidence
      : null;

  const crowd =
    train.crowd ??
    (occupancy === null
      ? "Unknown"
      : occupancy < 50
      ? "Low"
      : occupancy <= 80
      ? "Medium"
      : "High");

  const crowdColor =
    crowd === "Low"
      ? "bg-green-600"
      : crowd === "Medium"
      ? "bg-yellow-500"
      : crowd === "High"
      ? "bg-red-600"
      : "bg-gray-600";

  const coach = train.coach ?? "To be announced";
  const platform = train.platform ?? "To be announced";

  return (
    <div className="bg-[#131b31] border border-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-blue-900/30 transition duration-300">
      <h2 className="text-2xl font-bold text-white mb-2">
        🚆 {trainName}
      </h2>

      <p className="text-gray-400 mb-5">
        Train No: {trainNumber || "N/A"}
      </p>

      <div className="flex justify-between items-center gap-3 text-gray-300">
        <span className="flex-1">
          <span className="block text-xs text-gray-500">FROM</span>
          <span className="font-semibold">{from}</span>
        </span>

        <span className="text-blue-400 text-2xl">→</span>

        <span className="flex-1 text-right">
          <span className="block text-xs text-gray-500">TO</span>
          <span className="font-semibold">{to}</span>
        </span>
      </div>

      <div className="flex justify-between gap-3 mt-4 text-sm text-gray-400">
        <span>🕒 {departure || "Time unavailable"}</span>
        <span>🕒 {arrival || "Time unavailable"}</span>
      </div>

      <div className="mt-6">
        <span className={`px-5 py-2 rounded-full text-white font-semibold ${crowdColor}`}>
          Crowd: {crowd}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-gray-300 mb-2">
          Occupancy: {occupancy !== null ? `${occupancy}%` : "Unavailable"}
        </p>

        {occupancy !== null && (
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${occupancy}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 text-gray-300">
        <p>
          🤖 AI Confidence:{" "}
          <span className="text-blue-400 font-semibold">
            {confidence !== null ? `${confidence}%` : "Unavailable"}
          </span>
        </p>

        <p>
          🚃 Recommended Coach:{" "}
          <span className="font-semibold text-white">{coach}</span>
        </p>

        <p>
          🚉 Platform:{" "}
          <span className="font-semibold text-white">{platform}</span>
        </p>
      </div>

      <Link
        to={`/prediction/${encodeURIComponent(trainNumber)}`}
        className="block mt-8 bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
      >
        🤖 View AI Prediction
      </Link>
    </div>
  );
}

export default TrainCard;
