import { TrainFront, Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-slate-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <TrainFront className="text-blue-500" size={34} />
          <h1 className="text-2xl font-bold tracking-wide">
            RailCrowd
          </h1>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex gap-8 text-gray-300">
          <li className="hover:text-blue-400 cursor-pointer transition">
            Home
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            Features
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            Prediction
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            About
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            Contact
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <button className="text-gray-300 hover:text-white transition">
            Login
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg font-semibold">
            Get Started
          </button>

          <Menu className="md:hidden" />
        </div>

      </div>
    </nav>
  );
}

export default Navbar;