import { motion } from "framer-motion";
import heroImage from "../assets/hero.png";

function Hero() {
  return (
    <section className="bg-slate-950 text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-8 py-20">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-blue-400 font-semibold uppercase tracking-widest mb-4">
            AI Powered Railway Platform
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Predict.
            <br />
            Plan.
            <br />
            Travel Smart.
          </h1>

          <p className="text-gray-400 text-lg mt-8 leading-8">
            RailCrowd helps passengers predict train crowd levels using
            Artificial Intelligence, making every journey smarter,
            safer and more comfortable.
          </p>

          <div className="flex gap-5 mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-semibold transition">
              Search Trains
            </button>

            <button className="border border-gray-500 hover:border-blue-500 px-7 py-3 rounded-xl transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <img
            src={heroImage}
            alt="RailCrowd Hero"
            className="w-full max-w-md drop-shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;