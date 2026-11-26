import type { FlightClass } from "../../flights/data/flight";

export interface Booking {
  id: number;
  flightId: number;
  passenger: string;
  email: string;
  seats: number;
  flightClass: FlightClass;
  createdAt: string; // ISO
}

export type NewBooking = Omit<Booking, 'id' | 'createdAt'>;

