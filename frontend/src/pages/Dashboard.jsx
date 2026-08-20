import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5000/api/analytics";

function Dashboard() {
    // =========================================================
    // State
    // =========================================================

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // =========================================================
    // Fetch Dashboard Analytics
    // =========================================================

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load dashboard analytics"
                );
            }

            setAnalytics(data.analytics);
        } catch (error) {
            console.error(
                "Dashboard analytics error:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // Load Analytics
    // =========================================================

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // =========================================================
    // Loading State
    // =========================================================

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <h2>
                        🤖 Loading RailCrowd Analytics...
                    </h2>

                    <p>
                        Analyzing general coach crowd predictions.
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // Error State
    // =========================================================

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <h2>
                        ⚠️ Unable to Load Dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button onClick={fetchAnalytics}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // =========================================================
    // Safety Check
    // =========================================================

    if (!analytics) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <h2>
                        No analytics data available
                    </h2>

                    <p>
                        RailCrowd could not find any prediction data.
                    </p>

                    <button onClick={fetchAnalytics}>
                        Refresh Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // =========================================================
    // Extract Analytics Data
    // =========================================================

    const summary = analytics.summary || {};

    const distribution =
        analytics.crowd_distribution || {};

    const allPredictions =
        analytics.all_predictions || [];

    const highCrowdTrains =
        analytics.high_crowd_trains || [];

    const mediumCrowdTrains =
        analytics.medium_crowd_trains || [];

    const lowCrowdTrains =
        analytics.low_crowd_trains || [];

    // =========================================================
    // Helper: Crowd CSS Class
    // =========================================================

    const getCrowdClass = (crowd) => {
        if (!crowd) {
            return "medium";
        }

        const level = String(crowd).toLowerCase();

        if (level === "high") {
            return "high";
        }

        if (level === "medium") {
            return "medium";
        }

        return "low";
    };

    // =========================================================
    // Helper: Safe Occupancy
    // =========================================================

    const getOccupancy = (value) => {
        const occupancy = Number(value) || 0;

        if (occupancy < 0) {
            return 0;
        }

        if (occupancy > 100) {
            return 100;
        }

        return occupancy;
    };

    // =========================================================
    // Most Crowded Train
    // =========================================================

    const mostCrowdedTrain =
        allPredictions.length > 0
            ? [...allPredictions].sort(
                (a, b) =>
                    getOccupancy(b.occupancy) -
                    getOccupancy(a.occupancy)
            )[0]
            : null;

    // =========================================================
    // Least Crowded Train
    // =========================================================

    const leastCrowdedTrain =
        allPredictions.length > 0
            ? [...allPredictions].sort(
                (a, b) =>
                    getOccupancy(a.occupancy) -
                    getOccupancy(b.occupancy)
            )[0]
            : null;

    // =========================================================
    // Dashboard UI
    // =========================================================

    return (
        <div className="dashboard-page">

            {/* ================================================= */}
            {/* Header */}
            {/* ================================================= */}

            <div className="dashboard-header">
                <div>
                    <h1>
                        📊 RailCrowd Dashboard
                    </h1>

                    <p>
                        Crowd intelligence for general and
                        unreserved railway passengers.
                    </p>
                </div>
            </div>

            {/* ================================================= */}
            {/* Summary Cards */}
            {/* ================================================= */}

            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">
                        🚆
                    </div>

                    <div>
                        <p>
                            Trains Analyzed
                        </p>

                        <h2>
                            {summary.total_trains || 0}
                        </h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        📈
                    </div>

                    <div>
                        <p>
                            Average Occupancy
                        </p>

                        <h2>
                            {summary.average_occupancy || 0}%
                        </h2>
                    </div>
                </div>

                <div className="stat-card high-card">
                    <div className="stat-icon">
                        🔴
                    </div>

                    <div>
                        <p>
                            High Crowd
                        </p>

                        <h2>
                            {summary.high_crowd_trains || 0}
                        </h2>
                    </div>
                </div>

                <div className="stat-card medium-card">
                    <div className="stat-icon">
                        🟡
                    </div>

                    <div>
                        <p>
                            Medium Crowd
                        </p>

                        <h2>
                            {summary.medium_crowd_trains || 0}
                        </h2>
                    </div>
                </div>

                <div className="stat-card low-card">
                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>
                        <p>
                            Low Crowd
                        </p>

                        <h2>
                            {summary.low_crowd_trains || 0}
                        </h2>
                    </div>
                </div>

            </div>

            {/* ================================================= */}
            {/* Crowd Distribution */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <h2>
                    📊 Crowd Distribution
                </h2>

                <div className="distribution-container">

                    {/* Low Crowd */}

                    <div className="distribution-item">

                        <div className="distribution-header">

                            <span>
                                🟢 Low Crowd
                            </span>

                            <strong>
                                {distribution.low?.percentage || 0}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill low-progress"
                                style={{
                                    width: `${getOccupancy(
                                        distribution.low?.percentage
                                    )}%`
                                }}
                            />

                        </div>

                        <p>
                            {distribution.low?.count || 0} trains
                        </p>

                    </div>

                    {/* Medium Crowd */}

                    <div className="distribution-item">

                        <div className="distribution-header">

                            <span>
                                🟡 Medium Crowd
                            </span>

                            <strong>
                                {distribution.medium?.percentage || 0}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill medium-progress"
                                style={{
                                    width: `${getOccupancy(
                                        distribution.medium?.percentage
                                    )}%`
                                }}
                            />

                        </div>

                        <p>
                            {distribution.medium?.count || 0} trains
                        </p>

                    </div>

                    {/* High Crowd */}

                    <div className="distribution-item">

                        <div className="distribution-header">

                            <span>
                                🔴 High Crowd
                            </span>

                            <strong>
                                {distribution.high?.percentage || 0}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill high-progress"
                                style={{
                                    width: `${getOccupancy(
                                        distribution.high?.percentage
                                    )}%`
                                }}
                            />

                        </div>

                        <p>
                            {distribution.high?.count || 0} trains
                        </p>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* Travel Insights */}
            {/* ================================================= */}

            <div className="crowd-summary-grid">

                <div className="crowd-summary-card high-summary">

                    <div>
                        <h3>
                            🔴 Most Crowded
                        </h3>

                        <p>
                            {mostCrowdedTrain
                                ? mostCrowdedTrain.train_name ||
                                  mostCrowdedTrain.train_number ||
                                  "Unknown Train"
                                : "No data available"}
                        </p>
                    </div>

                    <span>
                        {mostCrowdedTrain
                            ? `${getOccupancy(
                                mostCrowdedTrain.occupancy
                            )}%`
                            : "--"}
                    </span>

                </div>

                <div className="crowd-summary-card medium-summary">

                    <div>
                        <h3>
                            📊 Average Crowd
                        </h3>

                        <p>
                            Across all analyzed trains
                        </p>
                    </div>

                    <span>
                        {summary.average_occupancy || 0}%
                    </span>

                </div>

                <div className="crowd-summary-card low-summary">

                    <div>
                        <h3>
                            🟢 Least Crowded
                        </h3>

                        <p>
                            {leastCrowdedTrain
                                ? leastCrowdedTrain.train_name ||
                                  leastCrowdedTrain.train_number ||
                                  "Unknown Train"
                                : "No data available"}
                        </p>
                    </div>

                    <span>
                        {leastCrowdedTrain
                            ? `${getOccupancy(
                                leastCrowdedTrain.occupancy
                            )}%`
                            : "--"}
                    </span>

                </div>

            </div>

            {/* ================================================= */}
            {/* Train Predictions */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <h2>
                    🚆 General Coach Crowd Predictions
                </h2>

                {allPredictions.length === 0 ? (

                    <div className="empty-state">
                        <p>
                            No train prediction data available yet.
                        </p>

                        <p>
                            Generate a crowd prediction to see
                            RailCrowd analytics here.
                        </p>
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
                                    <th>Crowd Level</th>
                                    <th>AI Confidence</th>
                                </tr>

                            </thead>

                            <tbody>

                                {allPredictions.map(
                                    (train, index) => {

                                        const occupancy =
                                            getOccupancy(
                                                train.occupancy
                                            );

                                        return (

                                            <tr
                                                key={
                                                    `${train.train_number}-${index}`
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {train.train_name ||
                                                            "Unknown Train"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {train.train_number ||
                                                        "--"}
                                                </td>

                                                <td>
                                                    {train.source ||
                                                        "Unknown"}

                                                    {" → "}

                                                    {train.destination ||
                                                        "Unknown"}
                                                </td>

                                                <td>

                                                    <div className="occupancy-cell">

                                                        <div className="mini-progress">

                                                            <div
                                                                className="mini-progress-fill"
                                                                style={{
                                                                    width: `${occupancy}%`
                                                                }}
                                                            />

                                                        </div>

                                                        <span>
                                                            {occupancy}%
                                                        </span>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`crowd-badge ${getCrowdClass(
                                                            train.crowd
                                                        )}`}
                                                    >
                                                        {train.crowd ||
                                                            "Medium"}
                                                    </span>

                                                </td>

                                                <td>
                                                    {train.confidence || 0}%
                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ================================================= */}
            {/* Crowd Summary */}
            {/* ================================================= */}

            <div className="crowd-summary-grid">

                <div className="crowd-summary-card high-summary">

                    <div>
                        <h3>
                            🔴 High Crowd Trains
                        </h3>

                        <p>
                            Consider alternative trains or travel times.
                        </p>
                    </div>

                    <span>
                        {highCrowdTrains.length}
                    </span>

                </div>

                <div className="crowd-summary-card medium-summary">

                    <div>
                        <h3>
                            🟡 Medium Crowd Trains
                        </h3>

                        <p>
                            Moderate passenger congestion expected.
                        </p>
                    </div>

                    <span>
                        {mediumCrowdTrains.length}
                    </span>

                </div>

                <div className="crowd-summary-card low-summary">

                    <div>
                        <h3>
                            🟢 Low Crowd Trains
                        </h3>

                        <p>
                            Better options for a comfortable journey.
                        </p>
                    </div>

                    <span>
                        {lowCrowdTrains.length}
                    </span>

                </div>

            </div>

            {/* ================================================= */}
            {/* Refresh Analytics */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <h2>
                    🔄 Update RailCrowd Analytics
                </h2>

                <p
                    style={{
                        color: "#94a3b8",
                        marginBottom: "20px"
                    }}
                >
                    Refresh the dashboard to load the latest
                    available crowd prediction data.
                </p>

                <button
                    onClick={fetchAnalytics}
                    style={{
                        padding: "12px 22px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "#ffffff",
                        fontSize: "15px",
                        cursor: "pointer"
                    }}
                >
                    🔄 Refresh Analytics
                </button>

            </div>

        </div>
    );
}

export default Dashboard;