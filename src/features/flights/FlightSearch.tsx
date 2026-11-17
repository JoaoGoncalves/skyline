import { useState } from "react";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm } from "./SearchForm";
import { useFlights } from "./useFlights";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const {flights, loading, error} = useFlights(filter);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});
    

    // state derivado
    const selectedCount = Object.values(basket).filter(Boolean).length;

 
    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }


  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={()=>setFilter(null)} />
        {loading && <p className="empty">Loading flights…</p>}
        {error && <p className="empty">Could not load flights: {error}</p>}
        {!loading && !error && (
          <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
        )}
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
