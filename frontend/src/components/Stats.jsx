import { motion } from "framer-motion";

const stats = [
  {
    number: "98%",
    title: "Prediction Accuracy",
  },
  {
    number: "500+",
    title: "Railway Stations",
  },
  {
    number: "1M+",
    title: "Happy Travelers",
  },
  {
    number: "24/7",
    title: "AI Monitoring",
  },
];

function Stats() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="max-w-6xl mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Trusted by <span className="text-blue-500">Thousands</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-lg"
            >
              <h1 className="text-5xl font-bold text-blue-500">
                {item.number}
              </h1>

              <p className="mt-4 text-gray-400">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;