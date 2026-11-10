import { useState } from "react";
import type { Flight } from "./data/flight";
import { Panel } from "../../ui/Panel";
import { sampleFlights } from "./data/sample-flights";
import { FlightList } from "./FlightList";
import { SearchForm } from "./SearchForm";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});
    

    // state derivado
    const selectedCount = Object.values(basket).filter(Boolean).length;

    function updatebasket(flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

    function search(filter: Filter): void {
        setFlights(sampleFlights.filter( f => f.from === filter.from && f.to === filter.to));
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={search} onClear={()=>setFlights([])} />
        <FlightList flights={flights} basket={basket} onToggle={updatebasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
