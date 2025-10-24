import { User, Schedule, Vehicle, Booking } from '../types';

const STORAGE_KEYS = {
  USERS: 'travel_users',
  SCHEDULES: 'travel_schedules',
  VEHICLES: 'travel_vehicles',
  BOOKINGS: 'travel_bookings',
  CURRENT_USER: 'travel_current_user',
};

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getSchedules: (): Schedule[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return data ? JSON.parse(data) : [];
  },

  setSchedules: (schedules: Schedule[]) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  },

  getVehicles: (): Vehicle[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return data ? JSON.parse(data) : [];
  },

  setVehicles: (vehicles: Vehicle[]) => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  getBookings: (): Booking[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  setBookings: (bookings: Booking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  clear: () => {
    localStorage.clear();
  },
};

export const initializeData = () => {
  if (storage.getUsers().length === 0) {
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@travel.com',
        password: 'admin123',
        name: 'Administrator',
        phone: '081234567890',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
    storage.setUsers(defaultUsers);
  }

  if (storage.getVehicles().length === 0) {
    const defaultVehicles: Vehicle[] = [
      { id: 'v1', plateNumber: 'B 1234 XYZ', capacity: 12, driverName: 'Ahmad Wijaya', type: 'Hiace' },
      { id: 'v2', plateNumber: 'B 5678 ABC', capacity: 7, driverName: 'Budi Santoso', type: 'Innova' },
      { id: 'v3', plateNumber: 'B 9012 DEF', capacity: 15, driverName: 'Candra Pratama', type: 'Elf' },
      { id: 'v4', plateNumber: 'B 3456 GHI', capacity: 6, driverName: 'Dedi Hermawan', type: 'Avanza' },
    ];
    storage.setVehicles(defaultVehicles);
  }

  if (storage.getSchedules().length === 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultSchedules: Schedule[] = [
      {
        id: 's1',
        origin: 'Jakarta',
        destination: 'Bandung',
        date: today.toISOString().split('T')[0],
        time: '08:00',
        price: 150000,
        availableSeats: 12,
        totalSeats: 12,
        vehicleId: 'v1',
        status: 'active',
      },
      {
        id: 's2',
        origin: 'Jakarta',
        destination: 'Bandung',
        date: today.toISOString().split('T')[0],
        time: '14:00',
        price: 150000,
        availableSeats: 7,
        totalSeats: 7,
        vehicleId: 'v2',
        status: 'active',
      },
      {
        id: 's3',
        origin: 'Jakarta',
        destination: 'Yogyakarta',
        date: tomorrow.toISOString().split('T')[0],
        time: '06:00',
        price: 250000,
        availableSeats: 15,
        totalSeats: 15,
        vehicleId: 'v3',
        status: 'active',
      },
      {
        id: 's4',
        origin: 'Bandung',
        destination: 'Jakarta',
        date: today.toISOString().split('T')[0],
        time: '10:00',
        price: 150000,
        availableSeats: 6,
        totalSeats: 6,
        vehicleId: 'v4',
        status: 'active',
      },
      {
        id: 's5',
        origin: 'Jakarta',
        destination: 'Surabaya',
        date: tomorrow.toISOString().split('T')[0],
        time: '05:00',
        price: 350000,
        availableSeats: 12,
        totalSeats: 12,
        vehicleId: 'v1',
        status: 'active',
      },
      {
        id: 's6',
        origin: 'Bandung',
        destination: 'Yogyakarta',
        date: tomorrow.toISOString().split('T')[0],
        time: '07:00',
        price: 200000,
        availableSeats: 7,
        totalSeats: 7,
        vehicleId: 'v2',
        status: 'active',
      },
    ];
    storage.setSchedules(defaultSchedules);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateBookingCode = (): string => {
  return `TRV${Date.now().toString().slice(-8)}`;
};
