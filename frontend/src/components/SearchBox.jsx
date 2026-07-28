import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Error loading stations:", err));
  }, []);

  const handleSearch = () => {
    if (!from || !to) {
      alert("Please select both From and To stations.");
      return;
    }

    if (from === to) {
      alert("From and To stations cannot be the same.");
      return;
    }

    navigate(
      `/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto -mt-20 relative z-20"
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* From */}
          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <MapPin size={18} />
              From Station
            </label>

            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
            >
              <option value="" disabled>
                Select Station
              </option>

              {stations.map((station) => (
                <option
                  key={station.id}
                  value={station.stationName}
                >
                  {station.stationName}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <MapPin size={18} />
              To Station
            </label>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
            >
              <option value="" disabled>
                Select Station
              </option>

              {stations.map((station) => (
                <option
                  key={station.id}
                  value={station.stationName}
                >
                  {station.stationName}
                </option>
              ))}
            </select>
          </div>

          {/* Journey Date */}
          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Journey Date
            </label>

            <input
              type="date"
              className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none border border-slate-700"
            />
          </div>

          {/* Passengers */}
          <div>
            <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <Users size={18} />
              Passengers
            </label>

            <select className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700">
              <option>1 Passenger</option>
              <option>2 Passengers</option>
              <option>3 Passengers</option>
              <option>4 Passengers</option>
            </select>
          </div>

        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 transition px-10 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto"
          >
            <Search size={20} />
            Search Trains
          </button>
        </div>

      </div>
    </motion.div>
  );
}

export default SearchBox;