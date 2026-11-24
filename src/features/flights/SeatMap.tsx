import type { Flight } from './data/flight';

const ROWS = 12;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// lugares ocupados "fingidos", mas sempre iguais para o mesmo voo
const isTaken = (flightId: number, row: number, col: number) => (row * 7 + col * 3 + flightId) % 4 === 0;

export default function SeatMap({ flight }: { flight: Flight }) {
  const seats = Array.from({ length: ROWS }, (_, r) =>
    LETTERS.map((letter, c) => ({ id: `${r + 1}${letter}`, taken: isTaken(flight.id, r, c) })),
  ).flat();
  const free = seats.filter((s) => !s.taken).length;

  return (
    <div className="seatmap">
      <p className="empty">{flight.aircraft.type} · {free} free seats</p>
      <div className="seats">
        {seats.map((s) => (
          <span key={s.id} className={s.taken ? 'seat taken' : 'seat'}>{s.id}</span>
        ))}
      </div>
    </div>
  );
}