# React Avançado · Sessão 6 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

> **React Router 7 → 8, no que usamos hoje** (8.0 saiu a 17 jun 2026; usamos a 8.5): `react-router-dom` deixou de existir → `react-router` + `react-router/dom` (S1) · o loader recebe `url` (desde a 7.15; antes `new URL(request.url)`) (S3) · `hasErrorBoundary` removido dos route objects (S7) · requisitos: Node 22.22+, React 19.2.7+, Vite 7+, só ESM. `createBrowserRouter`, `loader`, `useLoaderData`, `useSearchParams`, `useNavigation`, `NavLink`, `redirect`: iguais à v7.

## SLIDE 4 · R1 · Da Sessão 5: useEffectEvent no Skyline

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

## SLIDE 12 · S1 · createBrowserRouter e RouterProvider

### Terminal  (parar o `npm start` com Ctrl+C, instalar, voltar a arrancar)

```bash
npm install react-router
npm start
```

### Ficheiro: src/index.css  (ACRESCENTAR no fim — CSS pronto para toda a sessão)

```css
/* Sessão 6 · React Router */
.nav { display: flex; gap: 1rem; margin-left: auto; }
.nav a { color: var(--chip); text-decoration: none; }
.nav a.active { color: var(--accent); font-weight: 600; }
.card-header h3 a { color: inherit; text-decoration: none; }
.card-header h3 a:hover { text-decoration: underline; }
.prices { border-collapse: collapse; margin: 0.75rem 0 1rem; }
.prices td { padding: 0.3rem 1.5rem 0.3rem 0; border-bottom: 1px solid var(--chip); text-transform: capitalize; }
.busy { opacity: 0.5; transition: opacity 0.2s; }
```

### Ficheiro: src/router.tsx  (CRIAR)

```tsx
import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { FlightSearch } from './features/flights/FlightSearch';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App, // layout: AppShell + <Outlet />
    children: [
      { index: true, element: <Navigate to="/flights" replace /> },
      { path: 'flights', Component: FlightSearch },
    ],
  },
]);
```

### Ficheiro: src/main.tsx  (SUBSTITUIR)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

> **v7 → v8:** o `RouterProvider` vem de `react-router/dom`; o resto vem de `react-router`. Na v7 vinha tudo de `react-router-dom`, que deixou de existir na v8.

## SLIDE 13 · S1 · O App passa a layout route

### Ficheiro: src/App.tsx  (SUBSTITUIR)

```tsx
import { Outlet } from 'react-router';
import { AppShell } from './ui/AppShell';

export default function App() {
  return (
    <AppShell brand="Skyline" actions={<span>flights, simplified</span>}>
      <Outlet />
    </AppShell>
  );
}
```

## SLIDE 14 · S2 · NavLink e uma página About

### Ficheiro: src/App.tsx  (SUBSTITUIR)

```tsx
import { NavLink, Outlet } from 'react-router';
import { AppShell } from './ui/AppShell';

export default function App() {
  return (
    <AppShell
      brand="Skyline"
      actions={
        <>
          <span>flights, simplified</span>
          <nav className="nav">
            <NavLink to="/flights">Flights</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </>
      }
    >
      <Outlet />
    </AppShell>
  );
}
```

### Ficheiro: src/pages/AboutPage.tsx  (CRIAR — pasta nova: páginas só de conteúdo)

```tsx
import { Panel } from '../ui/Panel';

export function AboutPage() {
  return (
    <Panel title="About">
      <p>Skyline · o projeto do curso React Avançado 2026.</p>
    </Panel>
  );
}
```

### Ficheiro: src/router.tsx  (SUBSTITUIR)

```tsx
import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { AboutPage } from './pages/AboutPage';
import { FlightSearch } from './features/flights/FlightSearch';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App, // layout: AppShell + <Outlet />
    children: [
      { index: true, element: <Navigate to="/flights" replace /> },
      { path: 'flights', Component: FlightSearch },
      { path: 'about', Component: AboutPage },
    ],
  },
]);
```

## SLIDE 19 · S3 · flightsLoader

### Ficheiro: src/features/flights/loaders.ts  (CRIAR)

```ts
import type { LoaderFunctionArgs } from 'react-router';
import type { Flight } from './data/flight';
import { fetchFlights } from './data/flights-api';
import type { Filter } from './SearchForm';

type FlightsData = {
  filter: Filter | null;
  flights: Flight[];
};

// /flights?from=Lisbon&to=Porto · corre ANTES de o FlightSearch renderizar
export async function flightsLoader({ url, request }: LoaderFunctionArgs): Promise<FlightsData> {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!from || !to) return { filter: null, flights: [] };

  const filter: Filter = { from, to };
  const flights = await fetchFlights(filter, request.signal); // o router aborta o request se a navegação mudar
  return { filter, flights };
}
```

> **`LoaderFunctionArgs`** — o que o router passa a cada loader: `request` (com o `signal`) · `url` (o que vem depois do `?`) · `params` (o que está no path, `:id` — no `flightLoader`, bloco 03) · `pattern` (o path declarado, `'/flights/:id'`, para logging) · `context` (dados dos middlewares). O `ActionFunctionArgs` (Sessão 8) tem os mesmos campos.

> **v7 → v8:** o argument `url` do loader só existe a partir da 7.15. Antes: `new URL(request.url).searchParams.get('from')` — funciona nas duas versões.

## SLIDE 20 · S3 · O loader entra na rota

### Ficheiro: src/router.tsx  (SUBSTITUIR)

```tsx
import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { AboutPage } from './pages/AboutPage';
import { FlightSearch } from './features/flights/FlightSearch';
import { flightsLoader } from './features/flights/loaders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App, // layout: AppShell + <Outlet />
    hydrateFallbackElement: <p className="empty">Loading…</p>, // 1.º load, antes de haver UI
    children: [
      { index: true, element: <Navigate to="/flights" replace /> },
      { path: 'flights', Component: FlightSearch, loader: flightsLoader },
      { path: 'about', Component: AboutPage },
    ],
  },
]);
```

> **Nota:** nada muda no ecrã: o `FlightSearch` ainda usa o `useFlights`. O loader corre em `/flights`, mas sem search params devolve a lista vazia sem ir ao server.

## SLIDE 21 · S4 · O FlightSearch lê o loader

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useEffect, useEffectEvent } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Panel } from "../../ui/Panel";
import { FlightList } from "./FlightList";
import { SearchForm, type Filter } from "./SearchForm";
import type { flightsLoader } from "./loaders";

export function FlightSearch() {

    const { filter, flights } = useLoaderData<typeof flightsLoader>();
    const [searchParams, setSearchParams] = useSearchParams();
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
        <SearchForm
          key={searchParams.toString()}   // URL nova (back/forward) → form novo, com o filter do URL
          initialFilter={filter}
          onSearch={(f) => setSearchParams(f)}
          onClear={() => setSearchParams({})}
        />
        <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
```

### Ficheiro: src/features/flights/useFlights.ts  (APAGAR)

O `useState` do filter, o effect, o `AbortController` e o loading derivado deixam de ser precisos: o router faz isso.

## SLIDE 22 · S4 · O SearchForm começa com o filter do URL

### Ficheiro: src/features/flights/SearchForm.tsx  (ALTERAR 2 sítios)

No `type SearchFormProps`, antes do `onSearch`:

```tsx
  initialFilter: Filter | null;
```

Na assinatura e no `useState` (o draft começa com o filter do URL, ou vazio):

```tsx
export function SearchForm({ initialFilter, onSearch, onClear }: SearchFormProps) {
  const [filter, setFilter] = useState<Filter>(initialFilter ?? { from: "", to: "" });
```

## SLIDE 23 · Experimentar: a pesquisa vive no URL

## SLIDE 27 · S5 · fetchFlight e flightLoader

### Ficheiro: src/features/flights/data/flights-api.ts  (ACRESCENTAR no fim)

```ts
export async function fetchFlight(id: string, signal?: AbortSignal): Promise<Flight> {
  const response = await fetch(`${API_URL}/flights/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

### Ficheiro: src/features/flights/loaders.ts  (SUBSTITUIR)

```ts
import type { LoaderFunctionArgs } from 'react-router';
import type { Flight } from './data/flight';
import { fetchFlight, fetchFlights } from './data/flights-api';
import type { Filter } from './SearchForm';

type FlightsData = {
  filter: Filter | null;
  flights: Flight[];
};

// /flights?from=Lisbon&to=Porto · corre ANTES de o FlightSearch renderizar
export async function flightsLoader({ url, request }: LoaderFunctionArgs): Promise<FlightsData> {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!from || !to) return { filter: null, flights: [] };

  const filter: Filter = { from, to };
  const flights = await fetchFlights(filter, request.signal); // o router aborta o request se a navegação mudar
  return { filter, flights };
}

// /flights/:id
export async function flightLoader({ params, request }: LoaderFunctionArgs): Promise<Flight> {
  if (!params.id) throw new Error('Missing flight id'); // params.id: string | undefined
  return fetchFlight(params.id, request.signal);
}
```

## SLIDE 28 · S5 · A página FlightDetail

### Ficheiro: src/features/flights/FlightDetail.tsx  (CRIAR)

```tsx
import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const flight = useLoaderData<typeof flightLoader>();
  const navigate = useNavigate();

  return (
    <Panel
      title={`Flight #${flight.id} · ${flight.from} ➜ ${flight.to}`}
      actions={flight.delayed ? <Badge variant="warn">+{flight.delay} min</Badge> : <Badge>on Time</Badge>}
    >
      <title>{`Skyline • Flight #${flight.id}`}</title>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p>{flight.aircraft.type} · {flight.aircraft.registration}</p>
      <table className="prices">
        <tbody>
          {flight.prices.map((p) => (
            <tr key={p.flightClass}>
              <td>{p.flightClass}</td>
              <td>{p.amount} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}
```

### Ficheiro: src/router.tsx  (SUBSTITUIR)

```tsx
import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { AboutPage } from './pages/AboutPage';
import { FlightDetail } from './features/flights/FlightDetail';
import { FlightSearch } from './features/flights/FlightSearch';
import { flightLoader, flightsLoader } from './features/flights/loaders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App, // layout: AppShell + <Outlet />
    hydrateFallbackElement: <p className="empty">Loading…</p>, // 1.º load, antes de haver UI
    children: [
      { index: true, element: <Navigate to="/flights" replace /> },
      { path: 'flights', Component: FlightSearch, loader: flightsLoader },
      { path: 'flights/:id', Component: FlightDetail, loader: flightLoader },
      { path: 'about', Component: AboutPage },
    ],
  },
]);
```

## SLIDE 29 · S6 · Um Link em cada card

### Ficheiro: src/features/flights/FlightCard.tsx  (ALTERAR 2 sítios)

Nos imports:

```tsx
import { Link } from "react-router";
```

No JSX, **em vez** do `<h3>`:

```tsx
        <h3>
          <Link to={`/flights/${flight.id}`}>{flight.from} ➜ {flight.to}</Link>
        </h3>
```

## SLIDE 30 · S7 · useNavigation: pending UI no layout

### Ficheiro: src/App.tsx  (SUBSTITUIR)

```tsx
import { NavLink, Outlet, useNavigation } from 'react-router';
import { AppShell } from './ui/AppShell';

export default function App() {
  const navigation = useNavigation();
  const busy = navigation.state === 'loading'; // um loader está a correr

  return (
    <AppShell
      brand="Skyline"
      actions={
        <>
          <span>flights, simplified</span>
          <nav className="nav">
            <NavLink to="/flights">Flights</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </>
      }
    >
      <div className={busy ? 'busy' : undefined}>
        <Outlet />
      </div>
    </AppShell>
  );
}
```

## SLIDE 31 · Experimentar: lista → detalhe → back

> **v7 → v8 (para a Sessão 7):** os route objects deixaram de aceitar `hasErrorBoundary`; o router deduz isso do `ErrorBoundary` / `errorElement`.

## Para ler mais

- [Picking a Mode — reactrouter.com](https://reactrouter.com/start/modes) — declarative, data e framework (slide 8)
- [Upgrading from v7 / Changelog v8 — reactrouter.com](https://reactrouter.com/changelog) — o que muda na v8 (slide 9)
- [Data Mode · Routing — reactrouter.com](https://reactrouter.com/start/data/routing) — rotas, layout routes, index routes, dynamic segments (slides 10–14, 25)
- [Data Mode · Data Loading — reactrouter.com](https://reactrouter.com/start/data/data-loading) — loaders e `useLoaderData` (slides 16–21, 27–28)
- [useSearchParams — reactrouter.com](https://reactrouter.com/api/hooks/useSearchParams) — search params como state (slides 17, 21)
- [Pending UI — reactrouter.com](https://reactrouter.com/start/data/pending-ui) — `useNavigation` (slide 30)
- [Preserving and Resetting State — react.dev](https://react.dev/learn/preserving-and-resetting-state) — o `key` no `SearchForm` (slide 22)
