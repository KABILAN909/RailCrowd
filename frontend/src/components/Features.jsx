import { motion } from "framer-motion";
import {
  BrainCircuit,
  TrainFront,
  BarChart3,
  Map,
} from "lucide-react";

const features = [
  {
    icon: <BrainCircuit size={45} className="text-blue-400" />,
    title: "AI Prediction",
    description:
      "Predict train crowd levels before you start your journey.",
  },
  {
    icon: <TrainFront size={45} className="text-green-400" />,
    title: "Smart Routes",
    description:
      "Get better travel routes with less crowd and more comfort.",
  },
  {
    icon: <BarChart3 size={45} className="text-purple-400" />,
    title: "Live Analytics",
    description:
      "View crowd trends and railway insights in real time.",
  },
  {
    icon: <Map size={45} className="text-orange-400" />,
    title: "Crowd Heatmap",
    description:
      "Visualize crowded railway stations using interactive maps.",
  },
];

function Features() {
  return (
    <section className="bg-slate-950 py-24 px-8 text-white">
      <div className="max-w-7xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Why Choose
          <span className="text-blue-500"> RailCrowd?</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
              }}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-blue-500 transition duration-300 shadow-xl"
            >
              <div className="mb-6">{feature.icon}</div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;