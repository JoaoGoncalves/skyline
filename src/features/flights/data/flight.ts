export type FlightClass = 'economy' | 'business' | 'first';

export interface Price {
  flightClass: FlightClass;
  amount: number;
}

export interface Aircraft {
  type: string;
  registration: string;
}

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string; // ISO, ex.: 2026-10-09T08:15:00.000Z
  delayed: boolean;
  delay: number; // minutos
  aircraft: Aircraft;
  prices: Price[];
}