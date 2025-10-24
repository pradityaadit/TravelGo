import { Link, useLocation } from "react-router-dom";
import { Bus, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">WanderGo</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors ${isActive("/")}`}>
              Home
            </Link>
            <Link
              to="/search"
              className={`transition-colors ${isActive("/search")}`}
            >
              Pesan Tiket
            </Link>
            {user && (
              <Link
                to="/bookings"
                className={`transition-colors ${isActive("/bookings")}`}
              >
                Riwayat
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${isActive("/admin")}`}
              >
                <LayoutDashboard className="w-5 h-5 inline mr-1" />
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center justify-around mt-4 pt-4 border-t">
          <Link
            to="/"
            className={`flex flex-col items-center ${isActive("/")}`}
          >
            <span className="text-sm">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center ${isActive("/search")}`}
          >
            <span className="text-sm">Pesan</span>
          </Link>
          {user && (
            <Link
              to="/bookings"
              className={`flex flex-col items-center ${isActive("/bookings")}`}
            >
              <span className="text-sm">Riwayat</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex flex-col items-center ${isActive("/admin")}`}
            >
              <span className="text-sm">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
