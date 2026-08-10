import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengers, setPassengers] = useState("1");

  // ============================================================
  // Load stations from backend
  // ============================================================

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stations")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load stations");
        }

        return res.json();
      })
      .then((data) => {
        setStations(data.stations || []);
      })
      .catch((error) => {
        console.error("Error loading stations:", error);
      });
  }, []);

  // ============================================================
  // Search trains
  // ============================================================

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
      `/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(journeyDate)}&passengers=${passengers}`
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto -mt-20 relative z-20"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* ======================================================
            FROM STATION
        ====================================================== */}

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
            <option value="">Select Station</option>

            {stations.map((station) => (
              <option
                key={station.id}
                value={station.station_code}
              >
                {station.station_name} ({station.station_code})
              </option>
            ))}
          </select>
        </div>

        {/* ======================================================
            TO STATION
        ====================================================== */}

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
            <option value="">Select Station</option>

            {stations.map((station) => (
              <option
                key={station.id}
                value={station.station_code}
              >
                {station.station_name} ({station.station_code})
              </option>
            ))}
          </select>
        </div>

        {/* ======================================================
            JOURNEY DATE
        ====================================================== */}

        <div>
          <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
            <Calendar size={18} />
            Journey Date
          </label>

          <input
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none border border-slate-700"
          />
        </div>

        {/* ======================================================
            PASSENGERS
        ====================================================== */}

        <div>
          <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
            <Users size={18} />
            Passengers
          </label>

          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4 Passengers</option>
          </select>
        </div>
      </div>

      {/* ========================================================
          SEARCH BUTTON
      ======================================================== */}

      <div className="text-center mt-8">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 transition px-10 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto text-white"
        >
          <Search size={20} />
          Search Trains
        </button>
      </div>
    </motion.div>
  );
}

export default SearchBox;