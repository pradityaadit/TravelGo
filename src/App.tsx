import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Search } from "./pages/Search";
import { BookingPage } from "./pages/Booking";
import { Bookings } from "./pages/Bookings";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Schedules } from "./pages/admin/Schedules";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { Vehicles } from "./pages/admin/Vehicles";
import { Users } from "./pages/admin/Users";
import { initializeData } from "./utils/storage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ===================== ADMIN ROUTES ===================== */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* ===================== USER ROUTES ===================== */}
          <Route
            path="/"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <Home />
                </div>
                <Footer />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <Login />
                </div>
                <Footer />
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <Search />
                </div>
                <Footer />
              </div>
            }
          />
          <Route
            path="/booking"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <BookingPage />
                </div>
                <Footer />
              </div>
            }
          />
          <Route
            path="/bookings"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <Bookings />
                </div>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
