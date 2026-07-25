import { useEffect, useState } from "react";
import TrainCard from "../components/TrainCard";

function TrainSearch() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/trains")
      .then((response) => response.json())
      .then((data) => setTrains(data))
      .catch((error) => console.error("Error fetching trains:", error));
  }, []);

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
      </div>

      {/* Train Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {trains.length > 0 ? (
          trains.map((train) => (
            <TrainCard key={train.id} train={train} />
          ))
        ) : (
          <p className="text-white text-center col-span-3">
            Loading trains...
          </p>
        )}
      </div>
    </div>
  );
}

export default TrainSearch;