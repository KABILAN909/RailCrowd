function DashboardCard({ title, value, color }) {
  return (
    <div className="bg-[#131b31] rounded-2xl p-6 border border-gray-700 shadow-lg hover:border-blue-500 transition">

      <h3 className="text-gray-400 text-lg">
        {title}
      </h3>

      <h2 className={`text-4xl font-bold mt-4 ${color}`}>
        {value}
      </h2>

    </div>
  );
}

export default DashboardCard;