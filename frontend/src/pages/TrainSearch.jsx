import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TrainCard from "../components/TrainCard";

function TrainSearch() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // ==========================================================
  // Fetch trains
  // ==========================================================

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      setError("");
      setTrains([]);

      try {
        // ----------------------------------------------------
        // Check route parameters
        // ----------------------------------------------------

        if (!from || !to) {
          setError("Please select both From and To stations.");
          setLoading(false);
          return;
        }

        // ----------------------------------------------------
        // Build backend URL
        // ----------------------------------------------------

        const url =
          `http://127.0.0.1:5000/api/trains/search` +
          `?from=${encodeURIComponent(from)}` +
          `&to=${encodeURIComponent(to)}`;

        console.log("🚆 Searching trains:");
        console.log("From:", from);
        console.log("To:", to);
        console.log("API:", url);

        // ----------------------------------------------------
        // API request
        // ----------------------------------------------------

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "🚆 Train search response:",
          data
        );

        // ----------------------------------------------------
        // Backend validation
        // ----------------------------------------------------

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to search trains"
          );
        }

        // ----------------------------------------------------
        // Backend response:
        //
        // {
        //   success: true,
        //   from: "SBC",
        //   to: "MAS",
        //   count: 1,
        //   trains: [...]
        // }
        // ----------------------------------------------------

        const trainList = Array.isArray(
          data.trains
        )
          ? data.trains
          : [];

        setTrains(trainList);

      } catch (err) {
        console.error(
          "❌ Error fetching trains:",
          err
        );

        setError(
          err.message ||
            "Unable to fetch trains"
        );

        setTrains([]);

      } finally {
        setLoading(false);
      }
    };

    fetchTrains();

  }, [from, to]);

  // ==========================================================
  // Page
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-6 pt-32 pb-10">

      {/* ================================================== */}
      {/* Heading */}
      {/* ================================================== */}

      <div className="text-center mb-12">

        <h1 className="text-5xl font-bold text-white">
          🚆 Available Trains
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          AI-powered crowd prediction for your journey
        </p>

        {/* Route */}

        {from && to && (
          <p className="text-blue-400 mt-4 text-2xl font-semibold">
            📍 {from} → {to}
          </p>
        )}

        {/* Train Count */}

        {!loading &&
          !error &&
          from &&
          to && (
            <p className="text-green-400 mt-2 text-lg font-semibold">
              {trains.length}{" "}
              {trains.length === 1
                ? "Train"
                : "Trains"}{" "}
              Found
            </p>
          )}

      </div>

      {/* ================================================== */}
      {/* Error */}
      {/* ================================================== */}

      {error && (
        <div className="text-center mb-8">

          <p className="text-red-400 text-xl font-semibold">
            ❌ {error}
          </p>

        </div>
      )}

      {/* ================================================== */}
      {/* Train Cards */}
      {/* ================================================== */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* Loading */}

        {loading && (
          <p className="text-white text-center col-span-full text-xl">
            🚆 Loading trains...
          </p>
        )}

        {/* Results */}

        {!loading &&
          !error &&
          trains.length > 0 &&
          trains.map((train) => (

            <TrainCard
              key={
                train.train_id ||
                train.train_number
              }
              train={train}
            />

          ))}

        {/* No Results */}

        {!loading &&
          !error &&
          trains.length === 0 &&
          from &&
          to && (
            <p className="text-red-400 text-center col-span-full text-2xl font-semibold">
              ❌ No trains found for this route.
            </p>
          )}

      </div>

    </div>
  );
}

export default TrainSearch;