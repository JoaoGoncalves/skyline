import type { Flight } from './flight';

// Cópia de 10 voos do db.json (Lisbon → Porto / Faro).
// Temporário: na Sessão 4 passamos a ir buscar os voos ao json-server.
export const sampleFlights: Flight[] = [
  {
    id: 5, from: 'Lisbon', to: 'Porto', date: '2026-10-09T08:15:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A321neo', registration: 'CS-1005' },
    prices: [{ flightClass: 'economy', amount: 156 }, { flightClass: 'business', amount: 310 }, { flightClass: 'first', amount: 638 }],
  },
  {
    id: 7, from: 'Lisbon', to: 'Porto', date: '2026-09-08T09:40:00.000Z',
    delayed: true, delay: 15,
    aircraft: { type: 'E195', registration: 'CS-1007' },
    prices: [{ flightClass: 'economy', amount: 103 }, { flightClass: 'business', amount: 285 }, { flightClass: 'first', amount: 552 }],
  },
  {
    id: 8, from: 'Lisbon', to: 'Porto', date: '2026-10-19T06:00:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'B737-800', registration: 'CS-1008' },
    prices: [{ flightClass: 'economy', amount: 126 }, { flightClass: 'business', amount: 344 }, { flightClass: 'first', amount: 533 }],
  },
  {
    id: 9, from: 'Lisbon', to: 'Faro', date: '2026-09-12T14:20:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A220', registration: 'CS-1009' },
    prices: [{ flightClass: 'economy', amount: 188 }, { flightClass: 'business', amount: 426 }, { flightClass: 'first', amount: 634 }],
  },
  {
    id: 15, from: 'Lisbon', to: 'Faro', date: '2026-10-10T11:40:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E190', registration: 'CS-1015' },
    prices: [{ flightClass: 'economy', amount: 184 }, { flightClass: 'business', amount: 402 }, { flightClass: 'first', amount: 605 }],
  },
  {
    id: 16, from: 'Lisbon', to: 'Porto', date: '2026-09-24T10:15:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E195', registration: 'CS-1016' },
    prices: [{ flightClass: 'economy', amount: 147 }, { flightClass: 'business', amount: 331 }, { flightClass: 'first', amount: 632 }],
  },
  {
    id: 21, from: 'Lisbon', to: 'Faro', date: '2026-10-16T06:45:00.000Z',
    delayed: true, delay: 30,
    aircraft: { type: 'A320neo', registration: 'CS-1021' },
    prices: [{ flightClass: 'economy', amount: 109 }, { flightClass: 'business', amount: 264 }, { flightClass: 'first', amount: 586 }],
  },
  {
    id: 25, from: 'Lisbon', to: 'Faro', date: '2026-09-11T13:50:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E195', registration: 'CS-1025' },
    prices: [{ flightClass: 'economy', amount: 144 }, { flightClass: 'business', amount: 384 }, { flightClass: 'first', amount: 640 }],
  },
  {
    id: 28, from: 'Lisbon', to: 'Porto', date: '2026-09-16T10:20:00.000Z',
    delayed: true, delay: 10,
    aircraft: { type: 'A319', registration: 'CS-1028' },
    prices: [{ flightClass: 'economy', amount: 85 }, { flightClass: 'business', amount: 298 }, { flightClass: 'first', amount: 530 }],
  },
  {
    id: 29, from: 'Lisbon', to: 'Faro', date: '2026-09-15T09:50:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A320', registration: 'CS-1029' },
    prices: [{ flightClass: 'economy', amount: 155 }, { flightClass: 'business', amount: 377 }, { flightClass: 'first', amount: 662 }],
  },
];