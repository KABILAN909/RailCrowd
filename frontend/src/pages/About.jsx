import { motion } from "framer-motion";
import {
  Brain,
  Train,
  ShieldCheck,
  BarChart3,
  Cpu,
  Globe,
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-[#05081c] text-white pt-28 pb-16 px-6">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h1 className="text-6xl font-bold">
          About <span className="text-blue-500">RailCrowd</span>
        </h1>

        <p className="text-gray-400 text-xl mt-6 max-w-4xl mx-auto">
          RailCrowd is an AI-powered railway crowd prediction platform designed
          to help passengers make smarter travel decisions by predicting train
          occupancy before their journey.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-20">

        <div className="bg-[#131b31] p-8 rounded-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">
            🎯 Our Mission
          </h2>

          <p className="text-gray-300 leading-8">
            Our mission is to make railway travel more comfortable and efficient
            by providing intelligent crowd predictions, enabling passengers to
            choose less crowded trains and coaches before they travel.
          </p>
        </div>

        <div className="bg-[#131b31] p-8 rounded-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            🚀 Our Vision
          </h2>

          <p className="text-gray-300 leading-8">
            We aim to become India's leading smart railway analytics platform by
            integrating Artificial Intelligence, Machine Learning, and real-time
            railway data into one intelligent ecosystem.
          </p>
        </div>

      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto mt-24">

        <h2 className="text-5xl font-bold text-center mb-14">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-[#131b31] rounded-2xl p-8">
            <Brain className="text-blue-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              AI Prediction
            </h3>
            <p className="text-gray-400">
              Intelligent crowd prediction using occupancy analysis.
            </p>
          </div>

          <div className="bg-[#131b31] rounded-2xl p-8">
            <Train className="text-green-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              Smart Train Search
            </h3>
            <p className="text-gray-400">
              Search trains instantly with AI-powered recommendations.
            </p>
          </div>

          <div className="bg-[#131b31] rounded-2xl p-8">
            <BarChart3 className="text-yellow-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              Live Dashboard
            </h3>
            <p className="text-gray-400">
              Interactive analytics with crowd insights and occupancy trends.
            </p>
          </div>

          <div className="bg-[#131b31] rounded-2xl p-8">
            <ShieldCheck className="text-red-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              Secure Authentication
            </h3>
            <p className="text-gray-400">
              Secure login, registration, and protected user access.
            </p>
          </div>

          <div className="bg-[#131b31] rounded-2xl p-8">
            <Cpu className="text-purple-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              AI Analytics
            </h3>
            <p className="text-gray-400">
              AI-generated confidence scores and occupancy insights.
            </p>
          </div>

          <div className="bg-[#131b31] rounded-2xl p-8">
            <Globe className="text-cyan-500 mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-3">
              Future Ready
            </h3>
            <p className="text-gray-400">
              Designed for future integration with real-time Indian Railways
              data.
            </p>
          </div>

        </div>

      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto mt-24">

        <h2 className="text-5xl font-bold text-center mb-10">
          Technology Stack
        </h2>

        <div className="bg-[#131b31] rounded-2xl p-10 border border-slate-700">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="text-blue-400 text-2xl font-bold">
                Frontend
              </h3>

              <p className="mt-3 text-gray-300">
                React.js
                <br />
                Tailwind CSS
                <br />
                Framer Motion
              </p>
            </div>

            <div>
              <h3 className="text-green-400 text-2xl font-bold">
                Backend
              </h3>

              <p className="mt-3 text-gray-300">
                Flask
                <br />
                Python
                <br />
                REST API
              </p>
            </div>

            <div>
              <h3 className="text-yellow-400 text-2xl font-bold">
                AI & Data
              </h3>

              <p className="mt-3 text-gray-300">
                Crowd Prediction
                <br />
                JSON Dataset
                <br />
                Analytics
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;