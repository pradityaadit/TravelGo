import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, User, Mail, Phone, CreditCard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { storage, generateId, generateBookingCode } from "../utils/storage";
import { Schedule, Booking } from "../types";

export const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paymentUploaded, setPaymentUploaded] = useState(false);
  const [tempPaymentProof, setTempPaymentProof] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (location.state?.schedule) {
      setSchedule(location.state.schedule);
      setPassengers(location.state.passengers || 1);
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
      }
    } else {
      navigate("/search");
    }
  }, [isAuthenticated, location.state, navigate, user]);

  // sync paymentUploaded if user reloads page and proof already saved
  useEffect(() => {
    if (bookingConfirmed && bookingId) {
      const cb = storage.getBookings().find((b) => b.id === bookingId);
      if (cb?.paymentProof) setPaymentUploaded(true);
    }
  }, [bookingConfirmed, bookingId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!schedule || !user) return;

    const code = generateBookingCode();
    const newBooking: Booking = {
      id: generateId(),
      userId: user.id,
      scheduleId: schedule.id,
      passengerName: name,
      passengerEmail: email,
      passengerPhone: phone,
      numberOfSeats: passengers,
      totalPrice: schedule.price * passengers,
      bookingCode: code,
      status: tempPaymentProof
        ? ("awaiting_verification" as any)
        : ("pending" as any),
      paymentProof: tempPaymentProof || undefined,
      createdAt: new Date().toISOString(),
    };

    const bookings = storage.getBookings();
    bookings.push(newBooking);
    storage.setBookings(bookings);

    const schedules = storage.getSchedules();
    const updatedSchedules = schedules.map((s) => {
      if (s.id === schedule.id) {
        return { ...s, availableSeats: s.availableSeats - passengers };
      }
      return s;
    });
    storage.setSchedules(updatedSchedules);

    setBookingCode(code);
    setBookingId(newBooking.id);
    setBookingConfirmed(true);
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // if booking already exists (edge-case), update it; otherwise keep temp proof
      if (bookingId) {
        const all = storage.getBookings();
        const updated = all.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                paymentProof: result,
                status: "awaiting_verification" as any,
              }
            : b,
        );
        storage.setBookings(updated);
      } else {
        setTempPaymentProof(result);
      }
      setUploading(false);
      setPaymentUploaded(true);
    };
    reader.readAsDataURL(file);
  };

  if (!schedule) return null;

  if (bookingConfirmed) {
    const currentBooking = bookingId
      ? storage.getBookings().find((b) => b.id === bookingId)
      : null;

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Pemesanan Berhasil!
          </h2>
          <p className="text-gray-600 mb-8">
            Tiket Anda telah berhasil dipesan. Simpan kode booking di bawah ini.
          </p>

          <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Kode Booking</p>
            <p className="text-4xl font-bold text-blue-600 tracking-wider">
              {bookingCode}
            </p>
          </div>

          {paymentUploaded && (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 mb-6">
              <h3 className="text-xl font-bold text-green-700">
                Pembayaran Berhasil!
              </h3>
              <p className="text-sm text-green-700">
                Bukti pembayaran telah diunggah. Menunggu verifikasi admin.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-800 mb-4">Detail Pemesanan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rute:</span>
                <span className="font-medium">
                  {schedule.origin} - {schedule.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal:</span>
                <span className="font-medium">{schedule.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jam:</span>
                <span className="font-medium">{schedule.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Penumpang:</span>
                <span className="font-medium">{passengers} orang</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-600 font-bold">
                  Total Pembayaran:
                </span>
                <span className="font-bold text-blue-600">
                  {formatPrice(schedule.price * passengers)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/bookings")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Lihat Riwayat Pemesanan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Kembali ke Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Form Pemesanan
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Data Penumpang
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Nama Lengkap</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <div className="bg-white rounded-xl  text-left shadow-sm">
                      <h4 className="font-bold mb-2">Instruksi Pembayaran</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Silakan lakukan transfer ke rekening berikut. Bukti
                        transfer wajib diunggah pada form pemesanan.
                      </p>
                      <div className="mb-3">
                        <p className="text-sm">
                          <strong>Bank:</strong> BCA
                        </p>
                        <p className="text-sm">
                          <strong>Nama:</strong> PT TravelGo
                        </p>
                        <p className="text-sm">
                          <strong>Nomor Rekening:</strong> 123-456-7890
                        </p>
                      </div>
                    </div>
                    <label className="block text-sm font-medium mb-2">
                      Unggah Bukti Transfer (wajib)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                      className="block mb-2"
                    />
                    {uploading && (
                      <p className="text-sm text-gray-500">Mengunggah...</p>
                    )}
                    {tempPaymentProof && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Preview bukti:</p>
                        <img
                          src={tempPaymentProof}
                          alt="preview"
                          className="mt-2 w-40 h-28 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>Nomor HP</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={uploading || !tempPaymentProof}
                    className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
                      uploading || !tempPaymentProof
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Konfirmasi Pemesanan</span>
                  </motion.button>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Bukti pembayaran yang diunggah akan disimpan bersama
                      pesanan.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Ringkasan Pesanan
                </h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rute:</span>
                    <span className="font-medium text-right">
                      {schedule.origin} - {schedule.destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">{schedule.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jam:</span>
                    <span className="font-medium">{schedule.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga per tiket:</span>
                    <span className="font-medium">
                      {formatPrice(schedule.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah penumpang:</span>
                    <span className="font-medium">{passengers}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(schedule.price * passengers)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
