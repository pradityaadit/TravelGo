import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Car,
  Users,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isAdmin === false) navigate("/");
  }, [isAdmin, navigate]);

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      path: "/admin/schedules",
      icon: <Calendar className="w-5 h-5" />,
      label: "Jadwal",
    },
    {
      path: "/admin/bookings",
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Pemesanan",
    },
    {
      path: "/admin/vehicles",
      icon: <Car className="w-5 h-5" />,
      label: "Kendaraan",
    },
    {
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      label: "User",
    },
    { divider: true },
    {
      path: "/",
      icon: <Home className="w-5 h-5" />,
      label: "Kembali ke Home",
      isLink: true,
    },
    { action: "logout", icon: <LogOut className="w-5 h-5" />, label: "Logout" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleMenuClick = (
    path?: string,
    action?: string,
    isLink?: boolean
  ) => {
    if (action === "logout") {
      logout();
      navigate("/");
    } else if (isLink && path) {
      navigate(path);
    } else if (path) {
      navigate(path);
    }

    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl lg:translate-x-0"
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-blue-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-blue-800 rounded-lg p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Sidebar */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, i) =>
            item.divider ? (
              <hr key={i} className="border-blue-700/40 my-3" />
            ) : (
              <button
                key={item.label}
                onClick={() =>
                  handleMenuClick(item.path, item.action, item.isLink)
                }
                className={`flex w-full items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive(item.path ?? "")
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            )
          )}
        </nav>
      </motion.aside>

      {/* Overlay hitam di mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="h-8 relative flex-1">
              <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
                TravelGo Admin
              </h2>
            </div>
          </div>
        </header>

        {/* Isi Halaman */}
        <main className="flex-1 p-4 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
