import { Link } from "react-router-dom";

function TrainCard({ train }) {
  // ---------------------------------------------------------
  // Data coming from Flask API
  // ---------------------------------------------------------

  const trainNumber = train?.train_number || "";
  const trainName = train?.train_name || "Unknown Train";

  const fromStation =
    train?.from_station_name || train?.from_station_code || "Unknown";

  const toStation =
    train?.to_station_name || train?.to_station_code || "Unknown";

  const departure = train?.departure_time || "--:--";
  const arrival = train?.arrival_time || "--:--";

  // ---------------------------------------------------------
  // Crowd prediction
  //
  // At this stage the search API does not return occupancy.
  // Prediction API will be connected later.
  // ---------------------------------------------------------

  const occupancy =
    train?.occupancy !== undefined && train?.occupancy !== null
      ? Number(train.occupancy)
      : null;

  let crowd = "Not Available";
  let confidence = 0;
  let crowdColor = "bg-gray-600";

  if (occupancy !== null && !Number.isNaN(occupancy)) {
    if (occupancy < 50) {
      crowd = "Low";
      confidence = 98;
      crowdColor = "bg-green-600";
    } else if (occupancy <= 80) {
      crowd = "Medium";
      confidence = 95;
      crowdColor = "bg-yellow-500";
    } else {
      crowd = "High";
      confidence = 92;
      crowdColor = "bg-red-600";
    }
  }

  // ---------------------------------------------------------
  // Prediction page
  // IMPORTANT:
  // Use train number instead of train.id
  // ---------------------------------------------------------

  const predictionUrl = `/prediction/${encodeURIComponent(trainNumber)}`;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:border-blue-500 transition duration-300">

      {/* -------------------------------------------------- */}
      {/* Train Name */}
      {/* -------------------------------------------------- */}

      <h2 className="text-2xl font-bold text-white mb-2">
        🚆 {trainName}
      </h2>

      {/* -------------------------------------------------- */}
      {/* Train Number */}
      {/* -------------------------------------------------- */}

      <p className="text-gray-400 mb-6">
        Train No:{" "}
        <span className="text-blue-400 font-semibold">
          {trainNumber}
        </span>
      </p>

      {/* -------------------------------------------------- */}
      {/* Route */}
      {/* -------------------------------------------------- */}

      <div className="flex items-center justify-between gap-3 text-white">

        <div className="flex-1">
          <p className="text-gray-400 text-sm">
            From
          </p>

          <p className="font-semibold text-lg">
            {fromStation}
          </p>

          {train?.from_station_code && (
            <p className="text-blue-400 text-sm">
              {train.from_station_code}
            </p>
          )}
        </div>

        <div className="text-2xl text-blue-400">
          →
        </div>

        <div className="flex-1 text-right">
          <p className="text-gray-400 text-sm">
            To
          </p>

          <p className="font-semibold text-lg">
            {toStation}
          </p>

          {train?.to_station_code && (
            <p className="text-blue-400 text-sm">
              {train.to_station_code}
            </p>
          )}
        </div>

      </div>

      {/* -------------------------------------------------- */}
      {/* Timings */}
      {/* -------------------------------------------------- */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Departure
          </p>

          <p className="text-white text-xl font-semibold mt-1">
            {departure}
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Arrival
          </p>

          <p className="text-white text-xl font-semibold mt-1">
            {arrival}
          </p>
        </div>

      </div>

      {/* -------------------------------------------------- */}
      {/* Distance */}
      {/* -------------------------------------------------- */}

      {train?.from_distance_km !== undefined &&
        train?.to_distance_km !== undefined && (
          <div className="mt-5 text-gray-400">
            Distance:{" "}
            <span className="text-white font-semibold">
              {(
                Number(train.to_distance_km) -
                Number(train.from_distance_km)
              ).toFixed(2)}{" "}
              km
            </span>
          </div>
        )}

      {/* -------------------------------------------------- */}
      {/* Crowd Level */}
      {/* -------------------------------------------------- */}

      <div className="mt-6">

        <p className="text-gray-400 text-sm mb-2">
          Predicted Crowd
        </p>

        <span
          className={`inline-block px-5 py-2 rounded-full text-white font-semibold ${crowdColor}`}
        >
          {crowd === "Not Available"
            ? "🤖 Prediction Pending"
            : `👥 Crowd: ${crowd}`}
        </span>

      </div>

      {/* -------------------------------------------------- */}
      {/* Occupancy */}
      {/* -------------------------------------------------- */}

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <p className="text-gray-300">
            Expected Occupancy
          </p>

          <p className="text-blue-400 font-semibold">
            {occupancy !== null
              ? `${occupancy}%`
              : "Pending"}
          </p>

        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">

          {occupancy !== null ? (
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(occupancy, 0), 100)}%`,
              }}
            />
          ) : (
            <div
              className="bg-gray-600 h-3 rounded-full"
              style={{ width: "5%" }}
            />
          )}

        </div>

      </div>

      {/* -------------------------------------------------- */}
      {/* AI Information */}
      {/* -------------------------------------------------- */}

      <div className="mt-6 space-y-3 text-gray-300">

        <p>
          🤖 AI Confidence:{" "}
          <span className="text-white font-semibold">
            {confidence > 0 ? `${confidence}%` : "Pending"}
          </span>
        </p>

        <p>
          🚃 Recommended Coach:{" "}
          <span className="text-white font-semibold">
            {train?.coach || "Pending"}
          </span>
        </p>

        <p>
          🚉 Platform:{" "}
          <span className="text-white font-semibold">
            {train?.platform || "Pending"}
          </span>
        </p>

      </div>

      {/* -------------------------------------------------- */}
      {/* Prediction Button */}
      {/* -------------------------------------------------- */}

      <Link
        to={predictionUrl}
        className="block w-full mt-8 bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
      >
        🤖 View AI Prediction
      </Link>

    </div>
  );
}

export default TrainCard;