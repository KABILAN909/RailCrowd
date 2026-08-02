import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import TrainSearch from "./pages/TrainSearch";
import Prediction from "./pages/Prediction";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="bg-[#05081c] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/trains" element={<TrainSearch />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction/:id"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;