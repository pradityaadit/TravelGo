export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Schedule {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  vehicleId: string;
  status: "active" | "inactive";
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  capacity: number;
  driverName: string;
  type: string;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  numberOfSeats: number;
  totalPrice: number;
  bookingCode: string;
  status:
    | "pending"
    | "awaiting_verification"
    | "paid"
    | "completed"
    | "cancelled";
  paymentProof?: string; // base64 image data or URL
  createdAt: string;
}

export interface BookingWithDetails extends Booking {
  schedule?: Schedule;
  vehicle?: Vehicle;
}
