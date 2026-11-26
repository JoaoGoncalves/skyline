import type {  OptimisticBooking } from './data/booking';

type BookingListProps = {
  bookings: OptimisticBooking[];
};

export function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) return <p className="empty">No bookings yet.</p>;

  return (
    <ul className="bookings">
      {bookings.map((b) => (
        <li key={b.id} className={b.pending ? 'pending' : undefined}>
          {b.passenger} · {b.seats} × {b.flightClass}
          {b.pending && '. booking'}
        </li>
      ))}
    </ul>
  );
}