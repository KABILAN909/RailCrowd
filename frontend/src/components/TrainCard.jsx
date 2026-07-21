function TrainCard({ train }) {
  return (
    <div className="bg-[#131b31] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-blue-500 hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold text-white">
        {train.name}
      </h2>

      <p className="text-gray-400 mt-2">
        Train No: {train.number}
      </p>

      <div className="flex justify-between mt-5 text-gray-300">
        <span>{train.from}</span>
        <span>➡</span>
        <span>{train.to}</span>
      </div>

      <div className="flex justify-between mt-3 text-sm text-gray-400">
        <span>Departure: {train.departure}</span>
        <span>Arrival: {train.arrival}</span>
      </div>

      <div className="mt-5">
        <span
          className={`px-4 py-2 rounded-full text-white font-semibold ${
            train.crowd === "Low"
              ? "bg-green-600"
              : train.crowd === "Medium"
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}
        >
          Crowd: {train.crowd}
        </span>
      </div>
    </div>
  );
}

export default TrainCard;