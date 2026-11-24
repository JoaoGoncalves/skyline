import { use } from 'react';
import { Link } from 'react-router';
import type { Flight } from './data/flight';

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

export function RelatedFlights({ related }: { related: Promise<Flight[]> }) {
  const flights = use(related); // suspende até a promise resolver

  if (flights.length === 0) return <p className="empty">No other flights on this route.</p>;

  return (
    <ul className="related">
      {flights.map((f) => (
        <li key={f.id}>
          <Link to={`/flights/${f.id}`}>#{f.id} · {dateFormat.format(new Date(f.date))}</Link>
          {f.delayed && <> · +{f.delay} min</>}
        </li>
      ))}
    </ul>
  );
}

export function RelatedSkeleton() {
  return (
    <div aria-busy="true">
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}