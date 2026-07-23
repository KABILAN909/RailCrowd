import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import TrainSearch from "./pages/TrainSearch";
import Prediction from "./pages/Prediction";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="bg-[#05081c] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* All Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trains" element={<TrainSearch />} />
        <Route path="/prediction/:id" element={<Prediction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;