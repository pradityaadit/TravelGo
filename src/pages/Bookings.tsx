import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { storage } from "../utils/storage";
import { BookingWithDetails } from "../types";

export const Bookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
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
          const vehicle = schedule
            ? vehicles.find((v) => v.id === schedule.vehicleId)
            : undefined;
          return { ...booking, schedule, vehicle };
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setBookings(userBookings);
    }
  }, [isAuthenticated, navigate, user]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Lunas";
      case "awaiting_verification":
        return "Menunggu Verifikasi Pembayaran";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return "Pending";
    }
  };

  const handlePrint = (booking: BookingWithDetails) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <html>
        <head>
          <title>Tiket - ${booking.bookingCode}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            :root{--brand:#1e3a8a;--muted:#6b7280}
            body{font-family: Inter, Arial, Helvetica, sans-serif; background:#f3f4f6; padding:24px}
            .container{max-width:900px;margin:0 auto}
            .ticket{display:flex; gap:0; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(2,6,23,0.08)}
            .left{flex:1;padding:28px}
            .right{width:320px;background:linear-gradient(180deg,#eef2ff,#e0e7ff);padding:22px;display:flex;flex-direction:column;align-items:center;justify-content:center}
            .brand{color:var(--brand);font-weight:800;font-size:18px;margin-bottom:8px}
            .code{font-size:28px;font-weight:800;color:var(--brand);letter-spacing:2px;margin-bottom:8px}
            .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
            .label{font-size:12px;color:var(--muted)}
            .value{font-size:16px;font-weight:700;color:#0f172a}
            .small{font-size:13px;color:#374151}
            .qr{width:150px;height:150px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(30,58,138,0.2)}
            img.proof{max-width:100%;border-radius:8px;border:1px solid #e6edf8}
            .footer{margin-top:14px;font-size:13px;color:#374151}
            @media print{ body{background:#fff} .ticket{box-shadow:none} }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="ticket">
              <div class="left">
                <div class="brand">TravelGo - Tiket Elektronik</div>
                <div class="code">${booking.bookingCode}</div>
                <div style="margin-top:8px;margin-bottom:12px" class="small">Di keluarkan: ${new Date(booking.createdAt).toLocaleString("id-ID")}</div>

                <div class="row"><div><div class="label">Nama Penumpang</div><div class="value">${booking.passengerName}</div></div><div></div></div>
                <div class="row"><div><div class="label">Rute</div><div class="value">${booking.schedule?.origin || "-"} → ${booking.schedule?.destination || "-"}</div></div></div>
                <div class="row"><div><div class="label">Tanggal & Waktu</div><div class="value">${booking.schedule?.date || "-"} ${booking.schedule?.time || ""}</div></div></div>
                <div class="row"><div><div class="label">Jumlah Penumpang</div><div class="value">${booking.numberOfSeats} orang</div></div><div></div></div>
                <div class="row"><div><div class="label">Total Pembayaran</div><div class="value">${formatPrice(booking.totalPrice)}</div></div></div>

                ${booking.paymentProof ? `<div style="margin-top:12px"><div class="label">Bukti Pembayaran</div><div style="margin-top:6px"><img class="proof" src="${booking.paymentProof}" alt="bukti"/></div></div>` : ""}

                <div class="footer">Harap tunjukkan tiket ini kepada petugas saat boarding.</div>
              </div>
              <div class="right">
                <div style="text-align:center">
                  <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Kode Booking</div>
                  <div style="font-size:20px;font-weight:800;color:var(--brand);margin-bottom:12px">${booking.bookingCode}</div>
                </div>
                <div class="qr">QR / Barcode<br/><small style="color:var(--muted)">scan di loket</small></div>
                <div style="height:12px"></div>
                <div style="font-size:12px;color:var(--muted);text-align:center">${booking.vehicle ? `${booking.vehicle.type} • ${booking.vehicle.plateNumber}` : ""}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
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
              <p className="text-gray-600 text-lg mb-6">
                Anda belum memiliki pemesanan.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
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
                          booking.status,
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
                                {booking.schedule.origin} -{" "}
                                {booking.schedule.destination}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">Tanggal</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(
                                  booking.schedule.date,
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Waktu Keberangkatan
                              </p>
                              <p className="font-semibold text-gray-800">
                                {booking.schedule.time} WIB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Nama Penumpang
                            </p>
                            <p className="font-semibold text-gray-800">
                              {booking.passengerName}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">
                              Jumlah Penumpang
                            </p>
                            <p className="font-semibold text-gray-800">
                              {booking.numberOfSeats} orang
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">
                              Total Pembayaran
                            </p>
                            <p className="font-bold text-2xl text-blue-600">
                              {formatPrice(booking.totalPrice)}
                            </p>
                          </div>

                          {booking.paymentProof && (
                            <div>
                              <p className="text-sm text-gray-600">
                                Bukti Pembayaran
                              </p>
                              <img
                                src={booking.paymentProof}
                                alt="bukti"
                                className="mt-2 w-40 h-28 object-cover rounded-md border"
                              />
                            </div>
                          )}

                          {booking.vehicle && (
                            <div>
                              <p className="text-sm text-gray-600">Kendaraan</p>
                              <p className="font-semibold text-gray-800">
                                {booking.vehicle.type} -{" "}
                                {booking.vehicle.plateNumber}
                              </p>
                            </div>
                          )}
                          {booking.status === "paid" && (
                            <div className="mt-4">
                              <button
                                onClick={() => handlePrint(booking)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold"
                              >
                                Cetak Tiket
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Detail jadwal tidak tersedia
                      </p>
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
