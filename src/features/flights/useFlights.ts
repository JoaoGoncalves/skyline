import { useEffect, useState } from "react";
import type { Flight } from "./data/flight";
import type { Filter } from "./SearchForm";
import { fetchFlights } from "./data/flights-api";

type FlightsResult = {
  flights: Flight[];
  loading: boolean;
  error: string | null;
};

type FlightsResponse = {
  filter: Filter;
  flights: Flight[];
  error: string | null;
};

export function useFlights(filter: Filter | null): FlightsResult {
  const [response, setResponse] = useState<FlightsResponse | null>(null);

  useEffect(() => {
    if (!filter) return;
    const controller = new AbortController();
    fetchFlights(filter, controller.signal)
      .then((flights) => setResponse({ filter, flights, error: null }))
      .catch((e: unknown) => {
        if (!controller.signal.aborted) console.error(e);
        setResponse({
          filter,
          flights: [],
          error: e instanceof Error ? e.message : String(e),
        });
      });
    return () => controller.abort(); // cleanup: cancela o request anterior
  }, [filter]);

  // states derivados
  if (!filter) return { flights: [], loading: false, error: null };
  if (response?.filter !== filter)
    return { flights: [], loading: true, error: null };
  return { flights: response.flights, loading: false, error: response.error };
}
