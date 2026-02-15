import { useState, useEffect } from "react";
import { storage } from "../../utils/storage";
import { BookingWithDetails } from "../../types";

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBookings = storage.getBookings();
    const schedules = storage.getSchedules();
    const vehicles = storage.getVehicles();

    const enrichedBookings = allBookings
      .map((booking) => {
        const schedule = schedules.find((s) => s.id === booking.scheduleId);
        const vehicle = schedule
          ? vehicles.find((v) => v.id === schedule.vehicleId)
          : undefined;
        return { ...booking, schedule, vehicle };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    setBookings(enrichedBookings);
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    const allBookings = storage.getBookings();
    const updated = allBookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus as any } : b,
    );
    storage.setBookings(updated);
    loadData();
  };

  const openProof = (src?: string) => {
    if (!src) return;
    setModalImage(src);
  };

  const closeModal = () => setModalImage(null);

  const handleDelete = (bookingId: string) => {
    const ok = window.confirm(
      "Hapus riwayat pemesanan ini? Tindakan ini tidak bisa dibatalkan.",
    );
    if (!ok) return;

    const allBookings = storage.getBookings();
    const target = allBookings.find((b) => b.id === bookingId);
    const remaining = allBookings.filter((b) => b.id !== bookingId);
    storage.setBookings(remaining);

    if (target) {
      const schedules = storage.getSchedules();
      const updatedSchedules = schedules.map((s) =>
        s.id === target.scheduleId
          ? { ...s, availableSeats: s.availableSeats + target.numberOfSeats }
          : s,
      );
      storage.setSchedules(updatedSchedules);
    }

    loadData();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Manajemen Pemesanan
      </h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Kode Booking
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Penumpang
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rute
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Bukti
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {booking.bookingCode}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-800">
                        {booking.passengerName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {booking.passengerEmail}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {booking.passengerPhone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.schedule
                      ? `${booking.schedule.origin} - ${booking.schedule.destination}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.schedule ? (
                      <div>
                        <p>{booking.schedule.date}</p>
                        <p className="text-xs text-gray-500">
                          {booking.schedule.time}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.numberOfSeats} orang
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {formatPrice(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.paymentProof ? (
                      <img
                        src={booking.paymentProof}
                        alt="bukti"
                        className="w-28 h-20 object-cover rounded-md border cursor-pointer"
                        onClick={() => openProof(booking.paymentProof)}
                      />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status,
                      )} border-0 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Lunas</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm flex items-center space-x-2">
                    {booking.status === "awaiting_verification" &&
                    booking.paymentProof ? (
                      <button
                        onClick={() => handleStatusChange(booking.id, "paid")}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                      >
                        Konfirmasi
                      </button>
                    ) : null}
                    {booking.paymentProof ? (
                      <button
                        onClick={() => openProof(booking.paymentProof)}
                        className="px-3 py-1 bg-white border text-sm rounded-md"
                      >
                        Lihat
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Belum ada pemesanan
          </div>
        )}

        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-4 rounded shadow-lg max-w-[90%] max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="bukti"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="text-right mt-3">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
