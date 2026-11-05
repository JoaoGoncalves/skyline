import { useRef, useState, type SubmitEvent, type ChangeEvent } from "react";
import type { Flight } from "./data/flight";
import { Panel } from "../../ui/Panel";
import { sampleFlights } from "./data/sample-flights";
import { SearchInput } from "./SearchInput";
import { Button } from "../../ui/Button";
import { FlightList } from "./FlightList";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter>({from: 'Lisbon', to: 'Porto'});
    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});
    
    const fromRef = useRef<HTMLInputElement>(null);

    // state derivado
    const canSearch = filter.from !== '' && filter.to !== '';
    const selectedCount = Object.values(basket).filter(Boolean).length;



    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();
        setFlights(sampleFlights.filter( f => f.from === filter.from && f.to === filter.to))
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const {name, value} = event.target;
        setFilter( f => ({...f, [name]: value}))
    }

    function clear(): void {
       setFilter({from: '', to: ''});
       setFlights([]);
       fromRef.current?.focus();
    }

    function updatebasket(flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

  return (
    <>
      {/* Hoisting (elevar) para a Head do DOM */}
      <title>{`Skyline • ${filter.from || '…'} ➜ ${filter.to || '…'}`}</title>

      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <form className="search" onSubmit={handleSubmit}>
            <SearchInput ref={fromRef} label="From" name='from' value={filter.from} onChange={handleChange}/>
            <SearchInput label="To" name='to' value={filter.to} onChange={handleChange}/>
            <Button type='submit' disabled={!canSearch}>
                Search
            </Button>
            <Button variant="ghost" onClick={clear} >
                Clear
            </Button>
        </form>

        <FlightList flights={flights} basket={basket} onToggle={updatebasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
