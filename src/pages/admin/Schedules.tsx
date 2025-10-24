import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { storage, generateId } from '../../utils/storage';
import { Schedule, Vehicle } from '../../types';

export const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    price: 0,
    availableSeats: 0,
    totalSeats: 0,
    vehicleId: '',
    status: 'active' as 'active' | 'inactive',
  });

  const cities = ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Semarang', 'Malang'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSchedules(storage.getSchedules());
    setVehicles(storage.getVehicles());
  };

  const resetForm = () => {
    setFormData({
      origin: '',
      destination: '',
      date: '',
      time: '',
      price: 0,
      availableSeats: 0,
      totalSeats: 0,
      vehicleId: '',
      status: 'active',
    });
    setEditingSchedule(null);
  };

  const handleOpenModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        origin: schedule.origin,
        destination: schedule.destination,
        date: schedule.date,
        time: schedule.time,
        price: schedule.price,
        availableSeats: schedule.availableSeats,
        totalSeats: schedule.totalSeats,
        vehicleId: schedule.vehicleId,
        status: schedule.status,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allSchedules = storage.getSchedules();

    if (editingSchedule) {
      const updated = allSchedules.map((s) =>
        s.id === editingSchedule.id ? { ...s, ...formData } : s
      );
      storage.setSchedules(updated);
    } else {
      const newSchedule: Schedule = {
        id: generateId(),
        ...formData,
      };
      allSchedules.push(newSchedule);
      storage.setSchedules(allSchedules);
    }

    loadData();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      const updated = schedules.filter((s) => s.id !== id);
      storage.setSchedules(updated);
      loadData();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manajemen Jadwal</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Jadwal</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rute</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Waktu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Harga</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kursi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kendaraan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => {
                const vehicle = vehicles.find((v) => v.id === schedule.vehicleId);
                return (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {schedule.origin} - {schedule.destination}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{schedule.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{schedule.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatPrice(schedule.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {schedule.availableSeats}/{schedule.totalSeats}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {vehicle ? `${vehicle.type} (${vehicle.plateNumber})` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          schedule.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {schedule.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(schedule)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kota Asal</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kota</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kota Tujuan</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kota</option>
                    {cities
                      .filter((city) => city !== formData.origin)
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Waktu</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kendaraan</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => {
                      const vehicleId = e.target.value;
                      const vehicle = vehicles.find((v) => v.id === vehicleId);
                      setFormData({
                        ...formData,
                        vehicleId,
                        totalSeats: vehicle?.capacity || 0,
                        availableSeats: vehicle?.capacity || 0,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kendaraan</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.type} - {vehicle.plateNumber} ({vehicle.capacity} kursi)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Total Kursi</label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSeats: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kursi Tersedia</label>
                  <input
                    type="number"
                    value={formData.availableSeats}
                    onChange={(e) =>
                      setFormData({ ...formData, availableSeats: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingSchedule ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
