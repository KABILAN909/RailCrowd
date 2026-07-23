import trains from "../data/trains";

function RecentPredictions() {
  return (
    <div className="bg-[#131b31] rounded-2xl p-6 border border-gray-700 mt-12">
      <h2 className="text-2xl font-bold mb-6">
        🚆 Recent AI Predictions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3">Train</th>
              <th>Route</th>
              <th>Crowd</th>
              <th>AI Confidence</th>
            </tr>
          </thead>

          <tbody>

            {trains.map((train) => (

              <tr
                key={train.id}
                className="border-b border-gray-800 hover:bg-[#1b2440]"
              >

                <td className="py-4">
                  {train.name}
                </td>

                <td>
                  {train.from} → {train.to}
                </td>

                <td>
                  {train.crowd}
                </td>

                <td>
                  {train.confidence}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default RecentPredictions;