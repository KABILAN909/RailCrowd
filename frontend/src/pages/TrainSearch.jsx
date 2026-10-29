import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TrainCard from "../components/TrainCard";

const API_BASE = "http://127.0.0.1:5000/api";

function getTrainNumber(train) {
  return String(
    train?.train_number ??
      train?.train_no ??
      train?.number ??
      ""
  ).trim();
}

function getCrowd(train) {
  const value = String(train?.crowd ?? "").toLowerCase();

  if (value.includes("high")) return "High";
  if (value.includes("medium")) return "Medium";
  if (value.includes("low")) return "Low";

  const occupancy = Number(train?.occupancy);

  if (
    train?.occupancy !== null &&
    train?.occupancy !== undefined &&
    train?.occupancy !== "" &&
    Number.isFinite(occupancy)
  ) {
    if (occupancy < 50) return "Low";
    if (occupancy <= 80) return "Medium";
    return "High";
  }

  return "Unknown";
}

function getOccupancy(train) {
  const value = Number(train?.occupancy);

  return (
    train?.occupancy !== null &&
    train?.occupancy !== undefined &&
    train?.occupancy !== "" &&
    Number.isFinite(value)
  )
    ? value
    : -1;
}

async function fetchJSON(url) {
  const response = await fetch(url);

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

function TrainSearch() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [crowdFilter, setCrowdFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const from =
    searchParams.get("from")?.trim().toUpperCase() || "";

  const to =
    searchParams.get("to")?.trim().toUpperCase() || "";

  useEffect(() => {
    let cancelled = false;

    async function fetchTrains() {
      setLoading(true);
      setError("");

      try {
        let trainList = [];

        // Load route search results and enrich them with predictions.
        if (from && to) {
          const routeUrl =
            `${API_BASE}/trains/search?from=${encodeURIComponent(from)}` +
            `&to=${encodeURIComponent(to)}`;

          const [routeData, analyticsData] = await Promise.all([
            fetchJSON(routeUrl),
            fetchJSON(`${API_BASE}/analytics`),
          ]);

          const routeTrains = Array.isArray(routeData.trains)
            ? routeData.trains
            : [];

          const analytics = analyticsData.analytics || {};

          const predictions = Array.isArray(analytics.all_predictions)
            ? analytics.all_predictions
            : [];

          // Index predictions by train number for quick matching.
          const predictionMap = new Map();

          predictions.forEach((prediction) => {
            const number = getTrainNumber(prediction);

            if (number) {
              predictionMap.set(number, prediction);
            }
          });

          trainList = routeTrains.map((routeTrain) => {
            const number = getTrainNumber(routeTrain);
            const prediction = predictionMap.get(number);

            if (!prediction) {
              return {
                ...routeTrain,
                train_number: number,
              };
            }

            // Keep route-specific station details and add prediction data.
            return {
              ...prediction,
              ...routeTrain,

              train_number: number,

              train_name:
                routeTrain.train_name ??
                prediction.train_name ??
                "Unknown Train",

              from_station_code:
                routeTrain.from_station_code ?? from,

              to_station_code:
                routeTrain.to_station_code ?? to,

              departure_time:
                routeTrain.departure_time ??
                prediction.departure_time ??
                null,

              arrival_time:
                routeTrain.arrival_time ??
                prediction.arrival_time ??
                null,

              occupancy: prediction.occupancy ?? null,
              crowd: prediction.crowd ?? null,
              confidence: prediction.confidence ?? null,

              coach:
                prediction.coach ??
                routeTrain.coach ??
                "To be announced",

              platform:
                prediction.platform ??
                routeTrain.platform ??
                "To be announced",
            };
          });
        } else {
          // No route selected: show trains with available predictions.
          const analyticsData = await fetchJSON(
            `${API_BASE}/analytics`
          );

          const analytics = analyticsData.analytics || {};

          const predictions = Array.isArray(analytics.all_predictions)
            ? analytics.all_predictions
            : [];

          trainList = await Promise.all(
            predictions.map(async (prediction) => {
              const number = getTrainNumber(prediction);

              if (!number) return prediction;

              try {
                const trainData = await fetchJSON(
                  `${API_BASE}/trains/${encodeURIComponent(number)}`
                );

                const stops = Array.isArray(trainData.train)
                  ? trainData.train
                  : [];

                if (!stops.length) return prediction;

                const first = stops[0];
                const last = stops[stops.length - 1];

                return {
                  ...first,
                  ...prediction,

                  train_number: number,

                  train_name:
                    prediction.train_name ??
                    first.train_name ??
                    "Unknown Train",

                  from_station_code:
                    prediction.from_station_code ??
                    first.station_code,

                  from_station_name:
                    prediction.from_station_name ??
                    first.station_name,

                  to_station_code:
                    prediction.to_station_code ??
                    last.station_code,

                  to_station_name:
                    prediction.to_station_name ??
                    last.station_name,

                  departure_time:
                    prediction.departure_time ??
                    first.departure_time,

                  arrival_time:
                    prediction.arrival_time ??
                    last.arrival_time,
                };
              } catch (detailError) {
                console.error(
                  `Station details unavailable for train ${number}:`,
                  detailError
                );

                return prediction;
              }
            })
          );
        }

        if (!cancelled) {
          setTrains(trainList);
        }
      } catch (err) {
        console.error("Train loading error:", err);

        if (!cancelled) {
          setError(err.message || "Unable to load trains.");
          setTrains([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTrains();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const filteredTrains = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    const result = trains.filter((train) => {
      const name = String(
        train.train_name ?? train.name ?? ""
      ).toLowerCase();

      const number = getTrainNumber(train);

      const matchesSearch =
        !query ||
        name.includes(query) ||
        number.toLowerCase().includes(query);

      const matchesCrowd =
        crowdFilter === "All" ||
        getCrowd(train) === crowdFilter;

      return matchesSearch && matchesCrowd;
    });

    if (sortBy === "occupancy-high") {
      result.sort(
        (a, b) => getOccupancy(b) - getOccupancy(a)
      );
    } else if (sortBy === "occupancy-low") {
      result.sort((a, b) => {
        const aValue = getOccupancy(a);
        const bValue = getOccupancy(b);

        if (aValue < 0 && bValue < 0) return 0;
        if (aValue < 0) return 1;
        if (bValue < 0) return -1;

        return aValue - bValue;
      });
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.train_name ?? a.name ?? "").localeCompare(
          String(b.train_name ?? b.name ?? "")
        )
      );
    }

    return result;
  }, [trains, searchText, crowdFilter, sortBy]);

  function resetFilters() {
    setSearchText("");
    setCrowdFilter("All");
    setSortBy("default");
  }

  return (
    <div className="min-h-screen bg-[#05081c] text-white px-6 pt-32 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            🚆 Available Trains
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            AI-powered crowd predictions for your journey
          </p>

          {from && to ? (
            <p className="text-blue-400 mt-4 text-xl font-semibold">
              📍 {from} → {to}
            </p>
          ) : (
            <p className="text-gray-400 mt-3">
              Showing trains with available crowd predictions
            </p>
          )}

          {!loading && !error && (
            <p className="text-green-400 mt-3 font-semibold">
              {filteredTrains.length} of {trains.length} trains shown
            </p>
          )}
        </header>

        {!loading && !error && trains.length > 0 && (
          <section className="mb-8 rounded-2xl border border-slate-700 bg-[#111827] p-5">
            <h2 className="text-xl font-semibold mb-4">
              🔎 Search & Filter Trains
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="train-search"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Train name or number
                </label>

                <input
                  id="train-search"
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="e.g. SBC INTERCITY or 16378"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="crowd-filter"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Crowd level
                </label>

                <select
                  id="crowd-filter"
                  value={crowdFilter}
                  onChange={(event) =>
                    setCrowdFilter(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="All">All crowd levels</option>
                  <option value="Low">Low crowd</option>
                  <option value="Medium">Medium crowd</option>
                  <option value="High">High crowd</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="train-sort"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Sort by
                </label>

                <select
                  id="train-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="default">Default order</option>
                  <option value="occupancy-low">
                    Lowest occupancy first
                  </option>
                  <option value="occupancy-high">
                    Highest occupancy first
                  </option>
                  <option value="name">Train name A–Z</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-blue-500 px-4 py-2 text-blue-300 hover:bg-blue-500/10 transition"
              >
                Clear filters
              </button>
            </div>
          </section>
        )}

        {loading && (
          <p className="text-center text-lg py-12">
            🚆 Loading trains and predictions...
          </p>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 text-lg font-semibold">
              ❌ {error}
            </p>

            <p className="text-gray-400 mt-2">
              Check that the Flask backend is running and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredTrains.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrains.map((train, index) => (
              <TrainCard
                key={
                  train.train_id ||
                  getTrainNumber(train) ||
                  index
                }
                train={train}
              />
            ))}
          </div>
        )}

        {!loading &&
          !error &&
          trains.length > 0 &&
          filteredTrains.length === 0 && (
            <div className="text-center py-12">
              <p className="text-yellow-400 text-xl font-semibold">
                No matching trains found.
              </p>

              <p className="text-gray-400 mt-2">
                Try another train name, number, or crowd level.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 transition"
              >
                Clear filters
              </button>
            </div>
          )}

        {!loading && !error && trains.length === 0 && (
          <div className="text-center py-12">
            <p className="text-yellow-400 text-xl font-semibold">
              No trains available for this search.
            </p>

            <p className="text-gray-400 mt-2">
              Try another route or check the available prediction data.
            </p>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-10">
          Crowd values are estimates, not verified live passenger counts.
        </p>
      </div>
    </div>
  );
}

export default TrainSearch;