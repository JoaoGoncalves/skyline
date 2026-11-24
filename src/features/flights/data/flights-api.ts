
import type { Filter } from '../SearchForm';
import type { Flight } from './flight';

const API_URL = 'http://localhost:3000';

export async function fetchFlights(filter: Filter, signal?: AbortSignal): Promise<Flight[]> {
 
  const params = new URLSearchParams({ from: filter.from, to: filter.to });
  const response = await fetch(`${API_URL}/flights?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchFlight(id: string, signal?: AbortSignal): Promise<Flight | null> {
  const response = await fetch(`${API_URL}/flights/${id}`, { signal });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}


export async function fetchRelatedFlights(flight: Flight, signal?: AbortSignal): Promise<Flight[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // simula um endpoint lento
  const flights = await fetchFlights({ from: flight.from, to: flight.to }, signal);
  return flights.filter((f) => f.id !== flight.id);
}