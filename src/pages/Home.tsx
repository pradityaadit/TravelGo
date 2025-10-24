import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Shield, ArrowRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const destinations = [
    { name: 'Jakarta', image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Bandung', image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Yogyakarta', image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Surabaya', image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  const features = [
    {
      icon: <MapPin className="w-12 h-12 text-blue-600" />,
      title: 'Banyak Destinasi',
      description: 'Tersedia rute ke berbagai kota di Indonesia',
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: 'Tepat Waktu',
      description: 'Jaminan keberangkatan sesuai jadwal',
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: 'Aman & Nyaman',
      description: 'Kendaraan terawat dengan sopir berpengalaman',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/70"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Pesan tiket travel antar kota dengan mudah dan cepat
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/search')}
            className="px-8 py-4 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Pesan Tiket Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Mengapa Memilih TravelKu?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Destinasi Populer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white text-2xl font-bold p-6">{dest.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
