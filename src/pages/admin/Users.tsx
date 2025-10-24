import { useState, useEffect } from 'react';
import { Trash2, UserCircle } from 'lucide-react';
import { storage } from '../../utils/storage';
import { User } from '../../types';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = storage.getUsers();
    setUsers(allUsers.filter((u) => u.role === 'user'));
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const allUsers = storage.getUsers();
      const updated = allUsers.filter((u) => u.id !== id);
      storage.setUsers(updated);
      loadData();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manajemen User</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  No. HP
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Terdaftar
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <UserCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Belum ada user terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
};
