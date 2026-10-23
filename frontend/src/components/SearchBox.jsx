import { Search, MapPin, Calendar, Users, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function StationAutocomplete({
  label,
  value,
  onChange,
  stations,
  placeholder,
  excludeCode = "",
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const selectedStation = stations.find(
    (station) => station.station_code === value
  );

  useEffect(() => {
    setQuery(
      selectedStation
        ? `${selectedStation.station_name} (${selectedStation.station_code})`
        : ""
    );
  }, [selectedStation]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);

        if (selectedStation) {
          setQuery(
            `${selectedStation.station_name} (${selectedStation.station_code})`
          );
        } else {
          setQuery("");
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [selectedStation]);

  const filteredStations = stations
    .filter((station) => {
      const searchText = query.trim().toLowerCase();

      if (!searchText) return true;

      const stationName = String(station.station_name || "").toLowerCase();
      const stationCode = String(station.station_code || "").toLowerCase();

      return (
        stationName.includes(searchText) ||
        stationCode.includes(searchText) ||
        `${stationName} (${stationCode})`.includes(searchText)
      );
    })
    .filter((station) => station.station_code !== excludeCode)
    .slice(0, 8);

  const handleInputChange = (event) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setIsOpen(true);
    setActiveIndex(-1);

    // Clear the old selection when the user starts typing a new station.
    if (value) {
      onChange("");
    }
  };

  const selectStation = (station) => {
    onChange(station.station_code);
    setQuery(`${station.station_name} (${station.station_code})`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((current) =>
        Math.min(current + 1, filteredStations.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      if (isOpen && filteredStations.length > 0) {
        event.preventDefault();

        const station =
          filteredStations[activeIndex >= 0 ? activeIndex : 0];

        selectStation(station);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
        <MapPin size={18} />
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 pr-10 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange("");
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            aria-label={`Clear ${label}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
          {filteredStations.length > 0 ? (
            filteredStations.map((station, index) => (
              <button
                key={station.id ?? station.station_code}
                type="button"
                role="option"
                aria-selected={station.station_code === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectStation(station)}
                className={`block w-full border-b border-slate-800 px-4 py-3 text-left last:border-b-0 hover:bg-slate-800 ${
                  index === activeIndex ? "bg-slate-800" : ""
                }`}
              >
                <span className="block font-medium text-white">
                  {station.station_name}
                </span>
                <span className="text-sm text-blue-400">
                  {station.station_code}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-sm text-gray-400">
              No matching station found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchBox() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [loadingStations, setLoadingStations] = useState(true);
  const [stationsError, setStationsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStations() {
      try {
        setLoadingStations(true);
        setStationsError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/stations",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not load stations from the server.");
        }

        const data = await response.json();

        if (!data.success && !Array.isArray(data.stations)) {
          throw new Error(data.message || "Invalid stations response.");
        }

        setStations(Array.isArray(data.stations) ? data.stations : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading stations:", error);
          setStationsError(
            "Unable to load stations. Please check that the Flask backend is running."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingStations(false);
        }
      }
    }

    loadStations();

    return () => controller.abort();
  }, []);

  const handleSearch = () => {
    if (loadingStations) {
      alert("Please wait while stations are loading.");
      return;
    }

    if (stationsError) {
      alert("Stations could not be loaded. Please restart the backend and try again.");
      return;
    }

    if (!from || !to) {
      alert("Please type and select both From and To stations.");
      return;
    }

    if (from === to) {
      alert("From and To stations cannot be the same.");
      return;
    }

    const params = new URLSearchParams({
      from,
      to,
      date: journeyDate,
      passengers,
    });

    navigate(`/trains?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-20 mx-auto -mt-20 max-w-5xl px-4"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StationAutocomplete
          label="From Station"
          value={from}
          onChange={setFrom}
          stations={stations}
          excludeCode={to}
          placeholder={loadingStations ? "Loading stations..." : "Type station name or code"}
        />

        <StationAutocomplete
          label="To Station"
          value={to}
          onChange={setTo}
          stations={stations}
          excludeCode={from}
          placeholder={loadingStations ? "Loading stations..." : "Type station name or code"}
        />

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <Calendar size={18} />
            Journey Date
          </label>

          <input
            type="date"
            value={journeyDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(event) => setJourneyDate(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <Users size={18} />
            Passengers
          </label>

          <select
            value={passengers}
            onChange={(event) => setPassengers(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4 Passengers</option>
          </select>
        </div>
      </div>

      {stationsError && (
        <p className="mt-4 text-center text-sm text-red-400">
          {stationsError}
        </p>
      )}

      {!loadingStations && !stationsError && stations.length === 0 && (
        <p className="mt-4 text-center text-sm text-yellow-400">
          No stations are available in the database yet.
        </p>
      )}

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleSearch}
          disabled={loadingStations || Boolean(stationsError)}
          className="mx-auto flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={20} />
          {loadingStations ? "Loading Stations..." : "Search Trains"}
        </button>
      </div>
    </motion.div>
  );
}

export default SearchBox;