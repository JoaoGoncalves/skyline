import { data, type LoaderFunctionArgs } from "react-router";
import type { Flight } from "./data/flight";
import type { Filter } from "./SearchForm"
import { fetchFlight, fetchFlights, fetchRelatedFlights } from "./data/flights-api";

type FlightsData = {
    filter: Filter | null;
    flights: Flight[];
}

type FlightData = {   // ← NOVO
    flight: Flight;
    related: Promise<Flight[]>; // ainda não resolvida
}


export async function flightsLoader({url, request}: LoaderFunctionArgs): Promise<FlightsData>{
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if(!from || !to) return {filter: null, flights: []};

    const filter: Filter = {from, to};
    const flights = await fetchFlights(filter, request.signal);
    return {filter, flights}
}

export async function flightLoader({params, request}: LoaderFunctionArgs): Promise<FlightData>{
    if(!params.id) throw data('Missing flight ID', {status: 400});
    const flight = await fetchFlight(params.id, request.signal);
    if(!flight) throw data(`Flight ${params.id} not found`, {status: 404})
    
    const related = fetchRelatedFlights(flight, request.signal);
    return {flight, related};
}