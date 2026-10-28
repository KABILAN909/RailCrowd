
import { useCallback, useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5000/api/analytics";

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchAnalytics = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !data.success || !data.analytics) {
                throw new Error(data.message || "Failed to load analytics.");
            }

            setAnalytics(data.analytics);
        } catch (err) {
            console.error("Analytics error:", err);
            setError(err.message || "Unable to connect to the backend.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const summary = analytics?.summary || {};
    const distribution = analytics?.crowd_distribution || {};
    const trains = Array.isArray(analytics?.all_predictions)
        ? analytics.all_predictions
        : [];

    const occupancy = (value) => {
        const number = Number(value ?? 0);
        return Number.isFinite(number)
            ? Math.min(100, Math.max(0, number))
            : 0;
    };

    const crowdClass = (crowd) => {
        const level = String(crowd || "Medium").toLowerCase();
        return ["low", "medium", "high"].includes(level) ? level : "medium";
    };

    const sortedTrains = [...trains].sort(
        (a, b) => occupancy(b.occupancy) - occupancy(a.occupancy)
    );

    const mostCrowded = sortedTrains[0];
    const leastCrowded = sortedTrains[sortedTrains.length - 1];

    const low = occupancy(distribution.low?.percentage);
    const medium = occupancy(distribution.medium?.percentage);
    const high = occupancy(distribution.high?.percentage);

    if (loading) {
        return (
            <div className="dashboard-page dashboard-center">
                <div className="dashboard-loading">
                    <div className="loading-spinner" />
                    <h2>🤖 Loading RailCrowd Analytics...</h2>
                    <p>Analyzing train crowd predictions.</p>
                </div>
            </div>
        );
    }

    if (error && !analytics) {
        return (
            <div className="dashboard-page dashboard-center">
                <div className="dashboard-error">
                    <h2>⚠️ Unable to Load Dashboard</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => fetchAnalytics()}
                        disabled={refreshing}
                    >
                        🔄 Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>📊 RailCrowd Dashboard</h1>
                    <p>
                        Crowd intelligence for general and unreserved railway
                        passengers.
                    </p>
                </div>

                <button
                    className="header-refresh-button"
                    onClick={() => fetchAnalytics(true)}
                    disabled={refreshing}
                >
                    {refreshing ? "⏳ Updating..." : "🔄 Refresh"}
                </button>
            </div>

            {error && (
                <div className="dashboard-error">
                    <p>{error}</p>
                </div>
            )}

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">🚆</div>
                    <div>
                        <p>Trains Analyzed</p>
                        <h2>{summary.total_trains ?? trains.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div>
                        <p>Average Occupancy</p>
                        <h2>{summary.average_occupancy ?? 0}%</h2>
                    </div>
                </div>

                <div className="stat-card high-card">
                    <div className="stat-icon">🔴</div>
                    <div>
                        <p>High Crowd</p>
                        <h2>{summary.high_crowd_trains ?? 0}</h2>
                    </div>
                </div>

                <div className="stat-card medium-card">
                    <div className="stat-icon">🟡</div>
                    <div>
                        <p>Medium Crowd</p>
                        <h2>{summary.medium_crowd_trains ?? 0}</h2>
                    </div>
                </div>

                <div className="stat-card low-card">
                    <div className="stat-icon">🟢</div>
                    <div>
                        <p>Low Crowd</p>
                        <h2>{summary.low_crowd_trains ?? 0}</h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>📊 Crowd Distribution</h2>
                <p>Predicted crowd levels across analyzed trains.</p>

                <div className="distribution-container">
                    {[
                        {
                            label: "Low Crowd",
                            level: "low",
                            percentage: low,
                            count: distribution.low?.count ?? 0,
                        },
                        {
                            label: "Medium Crowd",
                            level: "medium",
                            percentage: medium,
                            count: distribution.medium?.count ?? 0,
                        },
                        {
                            label: "High Crowd",
                            level: "high",
                            percentage: high,
                            count: distribution.high?.count ?? 0,
                        },
                    ].map((item) => (
                        <div
                            className={`distribution-item ${item.level}-distribution`}
                            key={item.level}
                        >
                            <div className="distribution-header">
                                <span>
                                    {item.level === "low"
                                        ? "🟢"
                                        : item.level === "medium"
                                        ? "🟡"
                                        : "🔴"}{" "}
                                    {item.label}
                                </span>
                                <strong>{item.percentage}%</strong>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className={`progress-fill ${item.level}-progress`}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>

                            <p>
                                {item.count}{" "}
                                {Number(item.count) === 1 ? "train" : "trains"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="crowd-summary-grid">
                <div className="crowd-summary-card high-summary">
                    <div>
                        <h3>🔴 Most Crowded Train</h3>
                        <p>{mostCrowded?.train_name || "No data available"}</p>
                        {mostCrowded && (
                            <small>Train No: {mostCrowded.train_number}</small>
                        )}
                    </div>
                    <span>
                        {mostCrowded
                            ? `${occupancy(mostCrowded.occupancy)}%`
                            : "--"}
                    </span>
                </div>

                <div className="crowd-summary-card average-summary">
                    <div>
                        <h3>📊 Network Average</h3>
                        <p>Average predicted occupancy across analyzed trains.</p>
                    </div>
                    <span>{summary.average_occupancy ?? 0}%</span>
                </div>

                <div className="crowd-summary-card low-summary">
                    <div>
                        <h3>🟢 Least Crowded Train</h3>
                        <p>{leastCrowded?.train_name || "No data available"}</p>
                        {leastCrowded && (
                            <small>Train No: {leastCrowded.train_number}</small>
                        )}
                    </div>
                    <span>
                        {leastCrowded
                            ? `${occupancy(leastCrowded.occupancy)}%`
                            : "--"}
                    </span>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-heading">
                    <div>
                        <h2>🚆 General Coach Crowd Predictions</h2>
                        <p>
                            Estimated crowd levels from RailCrowd's prediction
                            engine.
                        </p>
                    </div>
                    <div className="prediction-count">
                        {trains.length} {trains.length === 1 ? "Train" : "Trains"}
                    </div>
                </div>

                {trains.length === 0 ? (
                    <div className="empty-state">
                        <h3>📭 No Prediction Data</h3>
                        <p>No train prediction data is available.</p>
                        <button
                            onClick={() => fetchAnalytics(true)}
                            disabled={refreshing}
                        >
                            {refreshing ? "⏳ Updating..." : "🔄 Try Again"}
                        </button>
                    </div>
                ) : (
                    <div className="train-table-container">
                        <table className="train-table">
                            <thead>
                                <tr>
                                    <th>Train</th>
                                    <th>Number</th>
                                    <th>Route</th>
                                    <th>Occupancy</th>
                                    <th>Crowd</th>
                                    <th>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trains.map((train, index) => {
                                    const level = crowdClass(train.crowd);

                                    return (
                                        <tr
                                            key={`${train.train_number || "train"}-${index}`}
                                        >
                                            <td>
                                                <strong>
                                                    {train.train_name || "Unknown Train"}
                                                </strong>
                                            </td>
                                            <td>{train.train_number || "--"}</td>
                                            <td>
                                                <div className="route-cell">
                                                    <span>{train.source || "Unknown"}</span>
                                                    <span className="route-arrow">→</span>
                                                    <span>
                                                        {train.destination || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="occupancy-cell">
                                                    <div className="mini-progress">
                                                        <div
                                                            className="mini-progress-fill"
                                                            style={{
                                                                width: `${occupancy(train.occupancy)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span>
                                                        {occupancy(train.occupancy)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`crowd-badge ${level}`}>
                                                    {level === "high"
                                                        ? "🔴 High"
                                                        : level === "low"
                                                        ? "🟢 Low"
                                                        : "🟡 Medium"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="confidence-value">
                                                    🤖 {occupancy(train.confidence)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="dashboard-section">
                <h2>🚦 Crowd Level Guide</h2>

                <div className="crowd-guide-grid">
                    <div className="guide-card low-guide">
                        <span className="guide-icon">🟢</span>
                        <div>
                            <h3>Low Crowd</h3>
                            <p>
                                Relatively lower occupancy and better space
                                availability.
                            </p>
                        </div>
                    </div>

                    <div className="guide-card medium-guide">
                        <span className="guide-icon">🟡</span>
                        <div>
                            <h3>Medium Crowd</h3>
                            <p>
                                Moderate congestion. Early boarding is
                                recommended.
                            </p>
                        </div>
                    </div>

                    <div className="guide-card high-guide">
                        <span className="guide-icon">🔴</span>
                        <div>
                            <h3>High Crowd</h3>
                            <p>
                                Heavy crowd expected in general / unreserved
                                coaches.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
