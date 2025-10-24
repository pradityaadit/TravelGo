import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, MapPin, Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { Schedule } from '../types';

export const Search = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<Schedule[]>([]);
  const [searched, setSearched] = useState(false);

  const cities = ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Semarang', 'Malang'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const schedules = storage.getSchedules();
    const filtered = schedules.filter(
      (schedule) =>
        schedule.origin === origin &&
        schedule.destination === destination &&
        schedule.date === date &&
        schedule.availableSeats >= passengers &&
        schedule.status === 'active'
    );
    setResults(filtered);
    setSearched(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBook = (schedule: Schedule) => {
    navigate('/booking', { state: { schedule, passengers } });
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
            Cari Tiket Travel
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Kota Asal</span>
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kota asal</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Kota Tujuan</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kota tujuan</option>
                    {cities
                      .filter((city) => city !== origin)
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Tanggal Keberangkatan</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Jumlah Penumpang</span>
                  </label>
                  <input
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SearchIcon className="w-5 h-5" />
                <span>Cari Tiket</span>
              </motion.button>
            </form>
          </div>

          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Hasil Pencarian ({results.length} tiket ditemukan)
              </h2>

              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    Tidak ada jadwal yang tersedia untuk pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((schedule) => {
                    const vehicles = storage.getVehicles();
                    const vehicle = vehicles.find((v) => v.id === schedule.vehicleId);

                    return (
                      <motion.div
                        key={schedule.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="text-2xl font-bold text-gray-800">
                                {schedule.origin}
                              </div>
                              <ArrowRight className="w-6 h-6 text-gray-400" />
                              <div className="text-2xl font-bold text-gray-800">
                                {schedule.destination}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{schedule.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{schedule.availableSeats} kursi tersisa</span>
                              </div>
                              {vehicle && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{vehicle.type}</span>
                                  <span>({vehicle.plateNumber})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-3">
                            <div className="text-3xl font-bold text-blue-600">
                              {formatPrice(schedule.price * passengers)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatPrice(schedule.price)} / orang
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBook(schedule)}
                              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                            >
                              Pesan Sekarang
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
