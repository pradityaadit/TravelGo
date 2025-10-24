import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { storage } from "../../utils/storage";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeSchedules: 0,
  });

  useEffect(() => {
    const bookings = storage.getBookings();
    const users = storage.getUsers();
    const schedules = storage.getSchedules();

    const revenue = bookings
      .filter((b) => b.status === "paid" || b.status === "completed")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const activeSchedules = schedules.filter(
      (s) => s.status === "active"
    ).length;

    setStats({
      totalRevenue: revenue,
      totalBookings: bookings.length,
      totalUsers: users.filter((u) => u.role === "user").length,
      activeSchedules,
    });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statCards = [
    {
      title: "Total Pendapatan",
      value: formatPrice(stats.totalRevenue),
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Total Pemesanan",
      value: stats.totalBookings.toString(),
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Total User",
      value: stats.totalUsers.toString(),
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: "Jadwal Aktif",
      value: stats.activeSchedules.toString(),
      icon: <Calendar className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${card.color} p-4`}>
              <div className="text-white">{card.icon}</div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di Panel Admin</h3>
        <p className="text-gray-600 mb-4">
          Gunakan menu di sidebar untuk mengelola berbagai aspek sistem pemesanan tiket travel:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span><strong>Jadwal:</strong> Kelola jadwal keberangkatan travel</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span><strong>Pemesanan:</strong> Lihat dan kelola pemesanan dari user</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span><strong>Kendaraan:</strong> Kelola data kendaraan dan sopir</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span><strong>User:</strong> Kelola akun pengguna terdaftar</span>
          </li>
        </ul>
      </div> */}
    </div>
  );
};
