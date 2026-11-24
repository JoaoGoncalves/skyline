import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';
import { lazy, Suspense, useState } from 'react';
import { RelatedFlights, RelatedSkeleton } from './RelatedFlights';

//const SeatMap = lazy( () => import('./SeatMap').then( m => ({default: m.SeatMap})));
const SeatMap = lazy( () => import('./SeatMap'));

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const {flight, related} = useLoaderData<typeof flightLoader>();
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
      <h3>Other Flights on this route</h3>
      <Suspense key={flight.id} fallback={<RelatedSkeleton />}>
          <RelatedFlights related={related} />
      </Suspense>
      {
        showSeats && (
          <Suspense fallback={<p className='empty'>Loading seat map...</p>}>
            <SeatMap flight={flight} />
          </Suspense>
        )
      }
      <Button variant='ghost' onClick={()=>setShowSeats( s => !s)}>{showSeats ? 'Hide Seats' : 'Seats'}</Button>
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}