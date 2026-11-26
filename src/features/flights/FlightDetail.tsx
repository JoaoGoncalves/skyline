import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';
import { lazy, Suspense, useState } from 'react';
import { RelatedFlights, RelatedSkeleton } from './RelatedFlights';
import { Modal } from '../../ui/Modal';
import { BookingForm } from '../bookings/BookingForm';

//const SeatMap = lazy( () => import('./SeatMap').then( m => ({default: m.SeatMap})));
const SeatMap = lazy( () => import('./SeatMap'));

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const {flight, related, bookings} = useLoaderData<typeof flightLoader>();
  const navigate = useNavigate();
  const [showSeats, setShowSeats] = useState(false);

  return (
    <Panel
      title={`Flight #${flight.id} · ${flight.from} ➜ ${flight.to}`}
      actions={flight.delayed ? <Badge variant="warn">+{flight.delay} min</Badge> : <Badge>on Time</Badge>}
    >
      <title>{`Skyline • Flight #${flight.id}`}</title>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p>{flight.aircraft.type} · {flight.aircraft.registration}</p>
      <table className="prices">
        <tbody>
          {flight.prices.map((p) => (
            <tr key={p.flightClass}>
              <td>{p.flightClass}</td>
              <td>{p.amount} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h3>Bookings</h3>
      <BookingForm key={`booking-${flight.id}`} flightId={flight.id} initialBookings={bookings} />
      <hr />
      <h3>Other Flights on this route</h3>
      <Suspense key={flight.id} fallback={<RelatedSkeleton />}>
          <RelatedFlights related={related} />
      </Suspense>
      {
        showSeats && (
         <Modal title={`Seats . Flight #${flight.id}`} onClose={()=>setShowSeats(false)}>
            <Suspense fallback={<p className='empty'>Loading seat map...</p>}>
              <SeatMap flight={flight} />
            </Suspense>
         </Modal>
        )
      }
      <Button variant='ghost' onClick={()=>setShowSeats( s => !s)}>{showSeats ? 'Hide Seats' : 'Seats'}</Button>
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}