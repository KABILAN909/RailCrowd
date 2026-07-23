import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Low", value: 40 },
  { name: "Medium", value: 35 },
  { name: "High", value: 25 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

function CrowdPieChart() {
  return (
    <div className="bg-[#131b31] rounded-2xl p-6 border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        🥧 Crowd Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CrowdPieChart;