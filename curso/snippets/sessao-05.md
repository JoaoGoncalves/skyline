# React Avançado · Sessão 5 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

## SLIDE 16 · S1 · fetchFlights: os voos vêm do json-server

### Ficheiro: src/dev/slow-network.ts  (CRIAR)

```ts
// Só para a demo da Sessão 5: simula uma rede lenta.
// Pesquisas para o Porto demoram 2 s; as outras, 0,3 s.
// Retirar antes do commit final.
export function simulateSlowNetwork(to: string, signal?: AbortSignal): Promise<void> {
  const ms = to === 'Porto' ? 2000 : 300;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}
```

### Ficheiro: src/features/flights/data/flights-api.ts  (CRIAR)

```ts
import { simulateSlowNetwork } from '../../../dev/slow-network';
import type { Filter } from '../SearchForm';
import type { Flight } from './flight';

const API_URL = 'http://localhost:3000';

export async function fetchFlights(filter: Filter, signal?: AbortSignal): Promise<Flight[]> {
  await simulateSlowNetwork(filter.to, signal); // só para a demo
  const params = new URLSearchParams({ from: filter.from, to: filter.to });
  const response = await fetch(`${API_URL}/flights?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

### Ficheiro: src/features/flights/data/sample-flights.ts  (APAGAR)

A cópia estática dos voos já não é precisa.

## SLIDE 17 · S1 · Um effect no FlightSearch

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useEffect, useState } from "react";
import type { Flight } from "./data/flight";
import { fetchFlights } from "./data/flights-api";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});

    // derived state
    const selectedCount = Object.values(basket).filter(Boolean).length;

    // sincronizar com o server: sempre que o filter muda, ir buscar os voos
    useEffect(() => {
        if (!filter) return;
        fetchFlights(filter).then(setFlights);
    }, [filter]);

    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

    function clear(): void {
        setFilter(null);
        setFlights([]);
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={clear} />
        <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
```

## SLIDE 19 · S2 · AbortController: cancelar no cleanup

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useEffect, useState } from "react";
import type { Flight } from "./data/flight";
import { fetchFlights } from "./data/flights-api";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});

    // derived state
    const selectedCount = Object.values(basket).filter(Boolean).length;

    // sincronizar com o server: sempre que o filter muda, ir buscar os voos
    useEffect(() => {
        if (!filter) return;
        const controller = new AbortController();
        fetchFlights(filter, controller.signal)
            .then(setFlights)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) console.error(error);   // cancelado de propósito: ignorar
            });
        return () => controller.abort();   // cleanup: cancela o request anterior
    }, [filter]);

    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

    function clear(): void {
        setFilter(null);
        setFlights([]);
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={clear} />
        <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
```

### Ver o `(canceled)` no Network  (TEMPORÁRIO — ≈ 2 min, repor no fim)

Com a rede lenta simulada, o abort acontece **antes** do `fetch`: o Network não mostra nada. Para ver o request cancelado, o atraso tem de vir da rede.

#### Ficheiro: src/features/flights/data/flights-api.ts  (COMENTAR uma linha)

```ts
  // await simulateSlowNetwork(filter.to, signal); // só para a demo
```

> **Repor antes do S3:** descomentar a linha do `simulateSlowNetwork` e voltar a **No throttling** (o S3 precisa da rede lenta para mostrar o "Loading flights…").
> **Atenção:** passar o `controller.signal` ao `fetchFlights`. O parameter é opcional: sem ele o TypeScript não avisa, e o abort não chega ao request.

## SLIDE 21 · S3 · useFlights

### Ficheiro: src/features/flights/useFlights.ts  (CRIAR)

```ts
import { useEffect, useState } from 'react';
import type { Flight } from './data/flight';
import { fetchFlights } from './data/flights-api';
import type { Filter } from './SearchForm';

type FlightsResult = {
  flights: Flight[];
  loading: boolean;
  error: string | null;
};

// a response guarda a pesquisa a que pertence
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
        if (controller.signal.aborted) return; // cancelado de propósito: ignorar
        setResponse({ filter, flights: [], error: e instanceof Error ? e.message : String(e) });
      });
    return () => controller.abort();
  }, [filter]);

  // tudo o resto é derived state: nada de setLoading dentro do effect
  if (!filter) return { flights: [], loading: false, error: null };
  if (response?.filter !== filter) return { flights: [], loading: true, error: null };
  return { flights: response.flights, loading: false, error: response.error };
}
```

## SLIDE 22 · S3 · O FlightSearch só pede os voos

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useState } from "react";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";
import { useFlights } from "./useFlights";

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const { flights, loading, error } = useFlights(filter);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});

    // derived state
    const selectedCount = Object.values(basket).filter(Boolean).length;

    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={() => setFilter(null)} />
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
```

## SLIDE 25 · S4 · useLocalStorage<T>

### Ficheiro: src/hooks/useLocalStorage.ts  (CRIAR — pasta nova)

```ts
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // lazy initializer: só lê o localStorage no primeiro render
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : initialValue;
  });

  // sincronizar com o localStorage sempre que o value muda
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

## SLIDE 26 · S4 · O cesto no localStorage

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";
import { useFlights } from "./useFlights";

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const { flights, loading, error } = useFlights(filter);
    const [basket, setBasket] = useLocalStorage<Record<number, boolean>>("skyline.basket", {});

    // derived state
    const selectedCount = Object.values(basket).filter(Boolean).length;

    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={() => setFilter(null)} />
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
```

## SLIDE 27 · S5 · useEffectEvent: registar cada pesquisa

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useEffect, useEffectEvent, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";
import { useFlights } from "./useFlights";

export function FlightSearch() {

    const [filter, setFilter] = useState<Filter | null>(null);
    const { flights, loading, error } = useFlights(filter);
    const [basket, setBasket] = useLocalStorage<Record<number, boolean>>("skyline.basket", {});

    // derived state
    const selectedCount = Object.values(basket).filter(Boolean).length;

    // effect event: lê sempre o selectedCount atual, mas não faz o effect correr
    const logSearch = useEffectEvent((searched: Filter) => {
        console.info(`[Skyline] ${searched.from} → ${searched.to} · ${selectedCount} no cesto`);
    });

    useEffect(() => {
        if (filter) logSearch(filter);
    }, [filter]);

    function updateBasket (flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={setFilter} onClear={() => setFilter(null)} />
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
```

## SLIDE 28 · S6 · Retirar a rede lenta

### Ficheiro: src/dev/slow-network.ts  (APAGAR)

### Ficheiro: src/features/flights/data/flights-api.ts  (SUBSTITUIR)

```ts
import type { Filter } from '../SearchForm';
import type { Flight } from './flight';

const API_URL = 'http://localhost:3000';

export async function fetchFlights(filter: Filter, signal?: AbortSignal): Promise<Flight[]> {
  const params = new URLSearchParams({ from: filter.from, to: filter.to });
  const response = await fetch(`${API_URL}/flights?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

## Para ler mais

- [useRef — react.dev](https://react.dev/reference/react/useRef) — guardar um value sem renderizar (slides 6–8)
- [useEffectEvent — react.dev](https://react.dev/reference/react/useEffectEvent) — ler o current value num effect, sem o reiniciar (slides 11 e 27)
- [Synchronizing with Effects — react.dev](https://react.dev/learn/synchronizing-with-effects) — effects, cleanup e fetch (slides 14–19)
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect) — derivar em vez de guardar (slide 21)
- [Reusing Logic with Custom Hooks — react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks) — custom hooks (slides 20–26)
- [AbortController — MDN](https://developer.mozilla.org/docs/Web/API/AbortController) — cancelar um request (slide 19)
