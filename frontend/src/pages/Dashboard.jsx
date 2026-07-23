import DashboardCard from "../components/DashboardCard";
import CrowdChart from "../components/CrowdChart";
import CrowdPieChart from "../components/CrowdPieChart";
import InsightsCard from "../components/InsightsCard";
import RecentPredictions from "../components/RecentPredictions";

import dashboardData from "../data/dashboard";

function Dashboard() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
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

        {/* Live Railway Insights */}
        <h2 className="text-4xl font-bold mt-16 mb-8">
          🚉 Live Railway Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <InsightsCard
            icon="🚉"
            title="Busiest Station"
            value="Chennai Central"
          />

          <InsightsCard
            icon="🚆"
            title="Most Crowded Train"
            value="Brindavan Express"
          />

          <InsightsCard
            icon="⏱"
            title="Average Delay"
            value="5 Minutes"
          />

          <InsightsCard
            icon="🤖"
            title="AI Status"
            value="Online"
          />

        </div>

        {/* Recent AI Predictions */}
        <RecentPredictions />

      </div>
    </div>
  );
}

export default Dashboard;