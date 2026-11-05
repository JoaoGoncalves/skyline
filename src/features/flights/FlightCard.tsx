import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import type { Flight } from "./data/flight";

type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onSelectedChange: (selected: boolean) => void;
};

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

export function FlightCard({ flight, selected = false, onSelectedChange }: FlightCardProps) {

    const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));

  return (
    <article className={selected ? 'card selected' : 'card'}>
      <header className="card-header">
        <h3>
            {flight.from} ➜ {flight.to}
        </h3>
        {flight.delayed ? (
          <Badge variant="warn">+{flight.delay} min</Badge>
        ) : (
          <Badge>on Time</Badge>
        )}
      </header>
      <p>Flight #{flight.id} . {flight.aircraft.type}</p>
       <p>{dateFormat.format(new Date(flight.date))}</p>
      <p className="price">from {lowestPrice} €</p>
      <Button variant={selected ? 'ghost' : 'primary'} onClick={()=>onSelectedChange(!selected)}>
        {selected ? 'Remove' : 'Select'}
      </Button>
    </article>
  );
}
