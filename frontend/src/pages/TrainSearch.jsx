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
    let url = "http://127.0.0.1:5000/api/trains";

    if (from && to) {
      url = `http://127.0.0.1:5000/api/search?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTrains(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trains:", error);
        setLoading(false);
      });
  }, [from, to]);

  return (
    <div className="min-h-screen bg-[#05081c] pt-28 px-8 pb-10">

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
                {trains.length} {trains.length === 1 ? "Train" : "Trains"} Found
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
          trains.map((train) => (
            <TrainCard key={train.id} train={train} />
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