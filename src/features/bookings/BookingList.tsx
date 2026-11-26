import type { Booking } from './data/booking';

type BookingListProps = {
  bookings: Booking[];
};

export function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) return <p className="empty">No bookings yet.</p>;

  return (
    <ul className="bookings">
      {bookings.map((b) => (
        <li key={b.id}>
          {b.passenger} · {b.seats} × {b.flightClass}
        </li>
      ))}
    </ul>
  );
}