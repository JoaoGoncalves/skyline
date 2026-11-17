
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