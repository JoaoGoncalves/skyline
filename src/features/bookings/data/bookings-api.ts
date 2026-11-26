import { API_URL } from "../../flights/data/flights-api";
import type { Booking, NewBooking } from "./booking";

export async function fetchBookings(flightId: string, signal?: AbortSignal): Promise<Booking[]> {
  const response = await fetch(`${API_URL}/bookings?flightId=${flightId}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // simula um server lento
  //throw new Error('Booking service is down');
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...booking, createdAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}