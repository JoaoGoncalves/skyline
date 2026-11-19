import { useEffect, useEffectEvent } from "react";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm } from "./SearchForm";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useLoaderData, useSearchParams } from "react-router";
import { flightsLoader } from "./loaders";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const {filter, flights} = useLoaderData< typeof flightsLoader>()
    const [searchParams, setSearchParams] = useSearchParams();
    const [basket, setBasket] = useLocalStorage<Record<number, boolean>>('skyline.basket',{});
    
    // state derivado
    const selectedCount = Object.values(basket).filter(Boolean).length;

    const logSearch = useEffectEvent( (searched: Filter)=> {
      console.info(`[Skyline] ${searched.from} -> ${searched.to} - ${selectedCount} no cesto.`);
    })

    useEffect(() => {
     if(filter) logSearch(filter)
    }, [filter])

 
    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }


  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm 
          key={searchParams.toString()}
          initialFilter={filter}
          onSearch={ f => setSearchParams(f)} 
          onClear={()=> setSearchParams({})} />
       
        <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
