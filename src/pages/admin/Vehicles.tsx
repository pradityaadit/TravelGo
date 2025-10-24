import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Car } from 'lucide-react';
import { storage, generateId } from '../../utils/storage';
import { Vehicle } from '../../types';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    plateNumber: '',
    capacity: 0,
    driverName: '',
    type: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVehicles(storage.getVehicles());
  };

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      capacity: 0,
      driverName: '',
      type: '',
    });
    setEditingVehicle(null);
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        plateNumber: vehicle.plateNumber,
        capacity: vehicle.capacity,
        driverName: vehicle.driverName,
        type: vehicle.type,
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

    const allVehicles = storage.getVehicles();

    if (editingVehicle) {
      const updated = allVehicles.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...formData } : v
      );
      storage.setVehicles(updated);
    } else {
      const newVehicle: Vehicle = {
        id: generateId(),
        ...formData,
      };
      allVehicles.push(newVehicle);
      storage.setVehicles(allVehicles);
    }

    loadData();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
      const updated = vehicles.filter((v) => v.id !== id);
      storage.setVehicles(updated);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manajemen Kendaraan</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Kendaraan</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 flex justify-center">
              <Car className="w-16 h-16 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{vehicle.type}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor Plat:</span>
                  <span className="font-medium text-gray-800">{vehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kapasitas:</span>
                  <span className="font-medium text-gray-800">{vehicle.capacity} kursi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sopir:</span>
                  <span className="font-medium text-gray-800">{vehicle.driverName}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-6">
                <button
                  onClick={() => handleOpenModal(vehicle)}
                  className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Car className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Belum ada kendaraan terdaftar</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tipe Kendaraan</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Contoh: Hiace, Innova, Elf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Nomor Plat</label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="Contoh: B 1234 XYZ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Kapasitas Kursi</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Nama Sopir</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="Nama lengkap sopir"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingVehicle ? 'Update' : 'Simpan'}
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
