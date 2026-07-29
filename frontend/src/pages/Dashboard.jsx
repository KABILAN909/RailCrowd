import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import CrowdChart from "../components/CrowdChart";
import CrowdPieChart from "../components/CrowdPieChart";
import InsightsCard from "../components/InsightsCard";
import RecentPredictions from "../components/RecentPredictions";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData([
          {
            id: 1,
            title: "Total Trains",
            value: data.totalTrains,
            color: "text-blue-400",
          },
          {
            id: 2,
            title: "Low Crowd",
            value: data.lowCrowd,
            color: "text-green-400",
          },
          {
            id: 3,
            title: "Medium Crowd",
            value: data.mediumCrowd,
            color: "text-yellow-400",
          },
          {
            id: 4,
            title: "High Crowd",
            value: data.highCrowd,
            color: "text-red-400",
          },
          {
            id: 5,
            title: "Average Occupancy",
            value: `${data.averageOccupancy}%`,
            color: "text-cyan-400",
          },
        ]);
      })
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#05081c] text-white pt-28 px-8 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h1 className="text-5xl font-bold">
          🤖 AI Dashboard
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Real-time crowd analytics and smart railway insights.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
          {dashboardData.map((item) => (
            <DashboardCard
              key={item.id}
              title={item.title}
              value={item.value}
              color={item.color}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <CrowdChart />
          <CrowdPieChart />
        </div>

        {/* Insights */}
        <h2 className="text-4xl font-bold mt-16 mb-8">
          🚉 Live Railway Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <InsightsCard
            icon="🚉"
            title="Busiest Station"
            value="KSR Bengaluru"
          />

          <InsightsCard
            icon="🚆"
            title="Most Crowded Level"
            value="High"
          />

          <InsightsCard
            icon="📊"
            title="Average Occupancy"
            value={dashboardData[4]?.value || "0%"}
          />

          <InsightsCard
            icon="🤖"
            title="AI Status"
            value="Online"
          />

        </div>

        <RecentPredictions />

      </div>
    </div>
  );
}

export default Dashboard;