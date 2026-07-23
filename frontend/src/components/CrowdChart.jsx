import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", crowd: 45 },
  { day: "Tue", crowd: 60 },
  { day: "Wed", crowd: 55 },
  { day: "Thu", crowd: 80 },
  { day: "Fri", crowd: 95 },
  { day: "Sat", crowd: 75 },
  { day: "Sun", crowd: 50 },
];

function CrowdChart() {
  return (
    <div className="bg-[#131b31] rounded-2xl p-6 border border-gray-700 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        📈 Weekly Crowd Prediction
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid stroke="#2d3748" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="crowd"
            stroke="#3B82F6"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CrowdChart;