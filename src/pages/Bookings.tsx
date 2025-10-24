import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { BookingWithDetails } from '../types';

export const Bookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      const allBookings = storage.getBookings();
      const schedules = storage.getSchedules();
      const vehicles = storage.getVehicles();

      const userBookings = allBookings
        .filter((b) => b.userId === user.id)
        .map((booking) => {
          const schedule = schedules.find((s) => s.id === booking.scheduleId);
          const vehicle = schedule ? vehicles.find((v) => v.id === schedule.vehicleId) : undefined;
          return { ...booking, schedule, vehicle };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(userBookings);
    }
  }, [isAuthenticated, navigate, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Riwayat Pemesanan
          </h1>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Ticket className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">Anda belum memiliki pemesanan.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Pesan Tiket Sekarang
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Ticket className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-lg">
                          {booking.bookingCode}
                        </span>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {booking.schedule ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Rute</p>
                              <p className="font-semibold text-gray-800">
                                {booking.schedule.origin} - {booking.schedule.destination}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Tanggal</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.schedule.date).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Waktu Keberangkatan</p>
                              <p className="font-semibold text-gray-800">
                                {booking.schedule.time} WIB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Nama Penumpang</p>
                            <p className="font-semibold text-gray-800">{booking.passengerName}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Jumlah Penumpang</p>
                            <p className="font-semibold text-gray-800">
                              {booking.numberOfSeats} orang
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Total Pembayaran</p>
                            <p className="font-bold text-2xl text-blue-600">
                              {formatPrice(booking.totalPrice)}
                            </p>
                          </div>

                          {booking.vehicle && (
                            <div>
                              <p className="text-sm text-gray-600">Kendaraan</p>
                              <p className="font-semibold text-gray-800">
                                {booking.vehicle.type} - {booking.vehicle.plateNumber}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Detail jadwal tidak tersedia</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
