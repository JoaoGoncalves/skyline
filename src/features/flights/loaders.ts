import type { LoaderFunctionArgs } from "react-router";
import type { Flight } from "./data/flight";
import type { Filter } from "./SearchForm"
import { fetchFlights } from "./data/flights-api";

type FlightsData = {
    filter: Filter | null;
    flights: Flight[];
}


export async function flightsLoader({url, request}: LoaderFunctionArgs): Promise<FlightsData>{
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if(!from || !to) return {filter: null, flights: []};

    const filter: Filter = {from, to};
    const flights = await fetchFlights(filter, request.signal);
    return {filter, flights}
}