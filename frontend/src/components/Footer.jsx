import { Link } from "react-router-dom";
import { TrainFront, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0b1023] text-gray-300 mt-20 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-8 py-12 grid md:grid-cols-3 gap-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3">
            <TrainFront className="text-blue-500" size={30} />
            <h2 className="text-2xl font-bold text-white">RailCrowd</h2>
          </div>

          <p className="mt-4 leading-7">
            AI-powered railway crowd prediction platform helping passengers
            travel smarter with crowd analytics and occupancy predictions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">
            <Link to="/">Home</Link>
            <Link to="/trains">Trains</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Contact
          </h3>

          <div className="space-y-4">

            <p className="flex items-center gap-3">
              <Mail size={18} />
              support@railcrowd.ai
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} />
              +91 98765 43210
            </p>

            <p className="flex items-center gap-3">
              <MapPin size={18} />
              Bengaluru, India
            </p>

          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 py-6 text-center text-gray-500">
        © 2026 RailCrowd. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;