import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const flight = useLoaderData<typeof flightLoader>();
  const navigate = useNavigate();

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
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}