function InsightsCard({ icon, title, value }) {
  return (
    <div className="bg-[#131b31] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-blue-500 transition">

      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-gray-400 text-lg">
        {title}
      </h3>

      <h2 className="text-2xl font-bold mt-3 text-white">
        {value}
      </h2>

    </div>
  );
}

export default InsightsCard;