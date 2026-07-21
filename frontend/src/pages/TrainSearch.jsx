import { useState } from "react";
import trains from "../data/trains";
import TrainCard from "../components/TrainCard";

function TrainSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filteredTrains = trains.filter((train) => {
    return (
      train.from.toLowerCase().includes(from.toLowerCase()) &&
      train.to.toLowerCase().includes(to.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-8 py-12">
      <h1 className="text-5xl font-bold text-center mb-10">
        Search Available Trains
      </h1>

      {/* Search Box */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
        <input
          type="text"
          placeholder="From Station"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-[#131b31] p-3 rounded-lg border border-gray-700 w-64"
        />

        <input
          type="text"
          placeholder="To Station"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-[#131b31] p-3 rounded-lg border border-gray-700 w-64"
        />
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrains.length > 0 ? (
          filteredTrains.map((train) => (
            <TrainCard key={train.id} train={train} />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-400 text-xl">
            No trains found.
          </p>
        )}
      </div>
    </div>
  );
}

export default TrainSearch;