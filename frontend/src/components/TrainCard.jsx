import { Link } from "react-router-dom";

function TrainCard({ train }) {

  // --------------------------------------------------
  // Train Details
  // --------------------------------------------------

  const trainNumber =
    train.train_number ||
    train.number ||
    "";

  const trainName =
    train.train_name ||
    train.name ||
    "Unknown Train";

  const from =
    train.from_station_code ||
    train.source_station ||
    train.from ||
    "";

  const to =
    train.to_station_code ||
    train.destination_station ||
    train.to ||
    "";

  const departure =
    train.departure_time ||
    train.departure ||
    "";

  const arrival =
    train.arrival_time ||
    train.arrival ||
    "";

  // --------------------------------------------------
  // Prediction Values
  // --------------------------------------------------

  const occupancy =
    typeof train.occupancy === "number"
      ? train.occupancy
      : null;

  const crowd =
    train.crowd ||
    (
      occupancy === null
        ? "Unknown"
        : occupancy < 50
        ? "Low"
        : occupancy <= 80
        ? "Medium"
        : "High"
    );

  const confidence =
    typeof train.confidence === "number"
      ? train.confidence
      : null;

  const coach =
    train.coach ||
    "To be announced";

  const platform =
    train.platform ||
    "To be announced";

  // --------------------------------------------------
  // Crowd Color
  // --------------------------------------------------

  const crowdColor =
    crowd === "Low"
      ? "bg-green-600"
      : crowd === "Medium"
      ? "bg-yellow-500"
      : crowd === "High"
      ? "bg-red-600"
      : "bg-gray-600";

  // --------------------------------------------------
  // Prediction URL
  // Backend expects TRAIN NUMBER
  //
  // Example:
  // /prediction/12608
  // --------------------------------------------------

  const predictionUrl =
    `/prediction/${trainNumber}`;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="bg-[#131b31] border border-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-blue-900/30 transition duration-300">

      {/* Train Name */}

      <h2 className="text-3xl font-bold text-white mb-2">

        🚆 {trainName}

      </h2>


      {/* Train Number */}

      <p className="text-gray-400 mb-5">

        Train No: {trainNumber}

      </p>


      {/* Route */}

      <div className="flex justify-between items-center text-lg text-gray-300">

        <span>
          {from || "N/A"}
        </span>

        <span className="text-blue-400 text-2xl">
          →
        </span>

        <span>
          {to || "N/A"}
        </span>

      </div>


      {/* Timings */}

      <div className="flex justify-between mt-3 text-gray-400">

        <span>
          🕒 {departure || "N/A"}
        </span>

        <span>
          🕒 {arrival || "N/A"}
        </span>

      </div>


      {/* Crowd Badge */}

      <div className="mt-6">

        <span
          className={`px-5 py-2 rounded-full text-white font-semibold ${crowdColor}`}
        >
          Crowd: {crowd}
        </span>

      </div>


      {/* Occupancy */}

      <div className="mt-6">

        <p className="text-gray-300 mb-2">

          Occupancy:{" "}

          {occupancy !== null
            ? `${occupancy}%`
            : "Available in Prediction"}

        </p>


        {occupancy !== null && (

          <div className="w-full bg-gray-700 rounded-full h-3">

            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(occupancy, 0),
                  100
                )}%`
              }}
            ></div>

          </div>

        )}

      </div>


      {/* AI Details */}

      <div className="mt-6 space-y-3 text-gray-300">

        <p>

          🤖 AI Confidence:{" "}

          <span className="text-blue-400 font-semibold">

            {confidence !== null
              ? `${confidence}%`
              : "Available in Prediction"}

          </span>

        </p>


        <p>

          🚃 Recommended Coach:{" "}

          <span className="font-semibold text-white">

            {coach}

          </span>

        </p>


        <p>

          🚉 Platform:{" "}

          <span className="font-semibold text-white">

            {platform}

          </span>

        </p>

      </div>


      {/* Prediction Button */}

      <Link
        to={predictionUrl}
        className="block mt-8 bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-3 rounded-xl transition duration-300"
      >

        🤖 View AI Prediction

      </Link>

    </div>

  );

}

export default TrainCard;