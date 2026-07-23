import { Link } from "react-router-dom";
import { TrainFront } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-[#05081c] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <TrainFront className="text-blue-500" size={34} />
          <h1 className="text-3xl font-bold">RailCrowd</h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-lg">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/trains"
            className="hover:text-blue-400 transition"
          >
            Trains
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-blue-400 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/about"
            className="hover:text-blue-400 transition"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-400 transition"
          >
            Contact
          </Link>

        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-5">

          <button className="hover:text-blue-400 transition">
            Login
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-semibold transition">
            Get Started
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;