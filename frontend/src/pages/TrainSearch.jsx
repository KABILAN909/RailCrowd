import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TrainCard from "../components/TrainCard";

function TrainSearch() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);

      try {
        let url = "http://127.0.0.1:5000/api/trains";

        if (from && to) {
          url = `http://127.0.0.1:5000/api/trains?from=${encodeURIComponent(
            from
          )}&to=${encodeURIComponent(to)}`;
        }

        console.log("Fetching trains from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Train API response:", data);

        if (data.success) {
          setTrains(data.trains || []);
        } else {
          setTrains([]);
        }
      } catch (error) {
        console.error("Error fetching trains:", error);
        setTrains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [from, to]);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-6">

      {/* Heading */}
      <div className="text-center mb-12">

        <h1 className="text-5xl font-bold text-white">
          🚆 Available Trains
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          AI-powered crowd prediction for your journey
        </p>

        {from && to && (
          <>
            <p className="text-blue-400 mt-4 text-2xl font-semibold">
              📍 {from} → {to}
            </p>

            {!loading && (
              <p className="text-green-400 mt-2 text-lg font-semibold">
                {trains.length}{" "}
                {trains.length === 1 ? "Train" : "Trains"} Found
              </p>
            )}
          </>
        )}

      </div>

      {/* Train Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {loading ? (
          <p className="text-white text-center col-span-3 text-xl">
            Loading trains...
          </p>
        ) : trains.length > 0 ? (
          trains.map((train, index) => (
            <TrainCard
              key={train.train_number || index}
              train={train}
            />
          ))
        ) : (
          <p className="text-red-400 text-center col-span-3 text-2xl font-semibold">
            ❌ No trains found for this route.
          </p>
        )}

      </div>

    </div>
  );
}

export default TrainSearch;