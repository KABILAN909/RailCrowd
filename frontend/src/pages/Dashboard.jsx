import { useCallback, useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5000/api/analytics";

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH ANALYTICS
    // =========================================================

    const fetchAnalytics = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await fetch(API_URL);

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "Invalid response received from RailCrowd backend."
                );
            }

            console.log("📊 Analytics API response:", data);

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message ||
                    `Analytics request failed with status ${response.status}`
                );
            }

            if (!data.analytics) {
                throw new Error(
                    "Analytics data is missing from the server response."
                );
            }

            setAnalytics(data.analytics);

        } catch (err) {
            console.error(
                "❌ Dashboard analytics error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load RailCrowd analytics."
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchAnalytics(false);
    }, [fetchAnalytics]);

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {
        return (
            <div className="dashboard-page dashboard-center">
                <div className="dashboard-loading">

                    <div className="loading-spinner" />

                    <h2>
                        🤖 Loading RailCrowd Analytics...
                    </h2>

                    <p>
                        Analyzing crowd predictions for
                        general / unreserved coaches.
                    </p>

                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR SCREEN
    // =========================================================

    if (error) {
        return (
            <div className="dashboard-page dashboard-center">

                <div className="dashboard-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() => fetchAnalytics(false)}
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>
        );
    }

    // =========================================================
    // SAFETY CHECK
    // =========================================================

    if (!analytics) {
        return (
            <div className="dashboard-page dashboard-center">

                <div className="dashboard-error">

                    <div className="error-icon">
                        📊
                    </div>

                    <h2>
                        No Analytics Available
                    </h2>

                    <p>
                        RailCrowd could not find prediction
                        analytics at the moment.
                    </p>

                    <button
                        onClick={() => fetchAnalytics(false)}
                    >
                        🔄 Refresh Dashboard
                    </button>

                </div>

            </div>
        );
    }

    // =========================================================
    // DATA
    // =========================================================

    const summary = analytics.summary || {};

    const distribution =
        analytics.crowd_distribution || {};

    const allPredictions =
        Array.isArray(analytics.all_predictions)
            ? analytics.all_predictions
            : [];

    // =========================================================
    // SAFE VALUES
    // =========================================================

    const totalTrains =
        Number(summary.total_trains ?? 0);

    const averageOccupancy =
        Number(summary.average_occupancy ?? 0);

    const highCrowdCount =
        Number(summary.high_crowd_trains ?? 0);

    const mediumCrowdCount =
        Number(summary.medium_crowd_trains ?? 0);

    const lowCrowdCount =
        Number(summary.low_crowd_trains ?? 0);

    // =========================================================
    // HELPERS
    // =========================================================

    const getOccupancy = (value) => {
        const number = Number(value ?? 0);

        if (Number.isNaN(number)) {
            return 0;
        }

        return Math.min(
            Math.max(number, 0),
            100
        );
    };

    const getCrowdClass = (crowd) => {
        const level =
            String(crowd || "")
                .toLowerCase();

        if (level === "high") {
            return "high";
        }

        if (level === "low") {
            return "low";
        }

        return "medium";
    };

    const getCrowdIcon = (crowd) => {
        const level =
            String(crowd || "")
                .toLowerCase();

        if (level === "high") {
            return "🔴";
        }

        if (level === "low") {
            return "🟢";
        }

        return "🟡";
    };

    // =========================================================
    // DISTRIBUTION
    // =========================================================

    const lowPercentage = getOccupancy(
        distribution.low?.percentage
    );

    const mediumPercentage = getOccupancy(
        distribution.medium?.percentage
    );

    const highPercentage = getOccupancy(
        distribution.high?.percentage
    );

    // =========================================================
    // MOST / LEAST CROWDED
    // =========================================================

    const sortedPredictions = [
        ...allPredictions
    ].sort(
        (a, b) =>
            getOccupancy(b.occupancy) -
            getOccupancy(a.occupancy)
    );

    const mostCrowdedTrain =
        sortedPredictions[0] || null;

    const leastCrowdedTrain =
        sortedPredictions[
            sortedPredictions.length - 1
        ] || null;

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {
        fetchAnalytics(true);
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="dashboard-page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="dashboard-header">

                <div>
                    <div className="dashboard-title-row">

                        <span className="dashboard-title-icon">
                            📊
                        </span>

                        <h1>
                            RailCrowd Dashboard
                        </h1>

                    </div>

                    <p>
                        Crowd intelligence for general and
                        unreserved railway passengers.
                    </p>
                </div>

                <button
                    className="header-refresh-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "⏳ Updating..."
                        : "🔄 Refresh"}
                </button>

            </div>

            {/* ================================================= */}
            {/* SUMMARY STATS */}
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
                            {totalTrains}
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
                            {averageOccupancy}%
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
                            {highCrowdCount}
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
                            {mediumCrowdCount}
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
                            {lowCrowdCount}
                        </h2>
                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* CROWD DISTRIBUTION */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            📊 Crowd Distribution
                        </h2>

                        <p>
                            Distribution of predicted crowd
                            levels across analyzed trains.
                        </p>
                    </div>

                </div>

                <div className="distribution-container">

                    {/* LOW */}

                    <div className="distribution-item low-distribution">

                        <div className="distribution-header">

                            <span>
                                🟢 Low Crowd
                            </span>

                            <strong>
                                {lowPercentage}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill low-progress"
                                style={{
                                    width: `${lowPercentage}%`
                                }}
                            />

                        </div>

                        <p>
                            {Number(
                                distribution.low?.count ?? 0
                            )} trains
                        </p>

                    </div>

                    {/* MEDIUM */}

                    <div className="distribution-item medium-distribution">

                        <div className="distribution-header">

                            <span>
                                🟡 Medium Crowd
                            </span>

                            <strong>
                                {mediumPercentage}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill medium-progress"
                                style={{
                                    width: `${mediumPercentage}%`
                                }}
                            />

                        </div>

                        <p>
                            {Number(
                                distribution.medium?.count ?? 0
                            )} trains
                        </p>

                    </div>

                    {/* HIGH */}

                    <div className="distribution-item high-distribution">

                        <div className="distribution-header">

                            <span>
                                🔴 High Crowd
                            </span>

                            <strong>
                                {highPercentage}%
                            </strong>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill high-progress"
                                style={{
                                    width: `${highPercentage}%`
                                }}
                            />

                        </div>

                        <p>
                            {Number(
                                distribution.high?.count ?? 0
                            )} trains
                        </p>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* TRAVEL INSIGHTS */}
            {/* ================================================= */}

            <div className="crowd-summary-grid">

                {/* MOST CROWDED */}

                <div className="crowd-summary-card high-summary">

                    <div>

                        <h3>
                            🔴 Most Crowded Train
                        </h3>

                        <p>
                            {mostCrowdedTrain
                                ? mostCrowdedTrain.train_name ||
                                  "Unknown Train"
                                : "No data available"}
                        </p>

                        {mostCrowdedTrain && (
                            <small>
                                Train No:{" "}
                                {mostCrowdedTrain.train_number}
                            </small>
                        )}

                    </div>

                    <span>
                        {mostCrowdedTrain
                            ? `${getOccupancy(
                                mostCrowdedTrain.occupancy
                            )}%`
                            : "--"}
                    </span>

                </div>

                {/* AVERAGE */}

                <div className="crowd-summary-card average-summary">

                    <div>

                        <h3>
                            📊 Network Average
                        </h3>

                        <p>
                            Average predicted occupancy
                            across analyzed trains.
                        </p>

                    </div>

                    <span>
                        {averageOccupancy}%
                    </span>

                </div>

                {/* LEAST CROWDED */}

                <div className="crowd-summary-card low-summary">

                    <div>

                        <h3>
                            🟢 Least Crowded Train
                        </h3>

                        <p>
                            {leastCrowdedTrain
                                ? leastCrowdedTrain.train_name ||
                                  "Unknown Train"
                                : "No data available"}
                        </p>

                        {leastCrowdedTrain && (
                            <small>
                                Train No:{" "}
                                {leastCrowdedTrain.train_number}
                            </small>
                        )}

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
            {/* TRAIN PREDICTIONS */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            🚆 General Coach Crowd Predictions
                        </h2>

                        <p>
                            Estimated crowd levels based on
                            RailCrowd's prediction engine.
                        </p>

                    </div>

                    <div className="prediction-count">
                        {allPredictions.length}{" "}
                        {allPredictions.length === 1
                            ? "Train"
                            : "Trains"}
                    </div>

                </div>

                {allPredictions.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📭
                        </div>

                        <h3>
                            No Prediction Data
                        </h3>

                        <p>
                            No train prediction data is
                            available at the moment.
                        </p>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            🔄 Refresh Analytics
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

                                {allPredictions.map(
                                    (train, index) => {

                                        const occupancy =
                                            getOccupancy(
                                                train.occupancy
                                            );

                                        const crowd =
                                            train.crowd ||
                                            "Medium";

                                        const confidence =
                                            getOccupancy(
                                                train.confidence
                                            );

                                        return (
                                            <tr
                                                key={`${train.train_number || "train"}-${index}`}
                                            >

                                                {/* TRAIN */}

                                                <td>
                                                    <div className="train-name-cell">

                                                        <strong>
                                                            {train.train_name ||
                                                                "Unknown Train"}
                                                        </strong>

                                                    </div>
                                                </td>

                                                {/* NUMBER */}

                                                <td>
                                                    <span className="train-number">
                                                        {train.train_number ||
                                                            "--"}
                                                    </span>
                                                </td>

                                                {/* ROUTE */}

                                                <td>
                                                    <div className="route-cell">

                                                        <span>
                                                            {train.source ||
                                                                "Unknown"}
                                                        </span>

                                                        <span className="route-arrow">
                                                            →
                                                        </span>

                                                        <span>
                                                            {train.destination ||
                                                                "Unknown"}
                                                        </span>

                                                    </div>
                                                </td>

                                                {/* OCCUPANCY */}

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

                                                {/* CROWD */}

                                                <td>

                                                    <span
                                                        className={`crowd-badge ${getCrowdClass(
                                                            crowd
                                                        )}`}
                                                    >
                                                        {getCrowdIcon(crowd)}{" "}
                                                        {crowd}
                                                    </span>

                                                </td>

                                                {/* CONFIDENCE */}

                                                <td>

                                                    <span className="confidence-value">
                                                        🤖 {confidence}%
                                                    </span>

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
            {/* CROWD STATUS GUIDE */}
            {/* ================================================= */}

            <div className="dashboard-section">

                <h2>
                    🚦 Crowd Level Guide
                </h2>

                <div className="crowd-guide-grid">

                    <div className="guide-card low-guide">

                        <span className="guide-icon">
                            🟢
                        </span>

                        <div>
                            <h3>
                                Low Crowd
                            </h3>

                            <p>
                                Relatively lower occupancy
                                and better space availability.
                            </p>
                        </div>

                    </div>

                    <div className="guide-card medium-guide">

                        <span className="guide-icon">
                            🟡
                        </span>

                        <div>
                            <h3>
                                Medium Crowd
                            </h3>

                            <p>
                                Moderate congestion.
                                Early boarding is recommended.
                            </p>
                        </div>

                    </div>

                    <div className="guide-card high-guide">

                        <span className="guide-icon">
                            🔴
                        </span>

                        <div>
                            <h3>
                                High Crowd
                            </h3>

                            <p>
                                Heavy crowd expected in
                                general / unreserved coaches.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* REFRESH */}
            {/* ================================================= */}

            <div className="dashboard-section refresh-section">

                <div>

                    <h2>
                        🔄 Update RailCrowd Analytics
                    </h2>

                    <p>
                        Refresh to load the latest available
                        crowd prediction calculations.
                    </p>

                </div>

                <button
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "⏳ Updating Analytics..."
                        : "🔄 Refresh Analytics"}
                </button>

            </div>

            {/* ================================================= */}
            {/* DISCLAIMER */}
            {/* ================================================= */}

            <div className="dashboard-disclaimer">

                <p>
                    ℹ️ RailCrowd provides estimated crowd
                    predictions based on available train and
                    travel factors. These values should not be
                    treated as official railway occupancy or
                    real-time passenger counts.
                </p>

            </div>

        </div>
    );
}

export default Dashboard;