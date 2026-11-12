import type { Flight } from "./data/flight";
import { FlightCard } from "./FlightCard";

type FlightListProps = {
  flights: Flight[];
  basket: Record<number, boolean>;
  onToggle: (flightId: number, selected: boolean) => void;
};

export function FlightList({ flights, basket, onToggle }: FlightListProps) {

    if(flights.length === 0){
        return <p className="empty">No Flights found</p>
    }

  return (
    <div className="grid">
      {flights.map( (flight) => (
        <FlightCard 
            key={flight.id}
            flight={flight}
            selected= {basket[flight.id] ?? false}
            onToggle={onToggle}
        />
      ))}
    </div>
  );
}
