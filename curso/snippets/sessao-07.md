# React Avançado · Sessão 7 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

> **React Router 7 → 8, no que usamos hoje:** `hasErrorBoundary` saiu dos route objects (basta `ErrorBoundary` ou `errorElement`) · `onError` no `RouterProvider` (`ClientOnErrorFunction`) · `lazy` nas rotas e `<Await>`: iguais à v7.

## SLIDE 10 · E1 · Um 404 a sério: throw data()

### Ficheiro: src/features/flights/data/flights-api.ts  (SUBSTITUIR só a function `fetchFlight`)

**O que muda (em relação à tag `sessao-06`):**
- return type: `Promise<Flight>` → `Promise<Flight | null>`
- nova linha `if (response.status === 404) return null;`, antes do `if (!response.ok)`
- o resto do ficheiro não muda

```ts
export async function fetchFlight(id: string, signal?: AbortSignal): Promise<Flight | null> {   // ← MUDOU: | null
  const response = await fetch(`${API_URL}/flights/${id}`, { signal });
  if (response.status === 404) return null; // ← NOVO: não existe → quem decide é o loader
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

### Ficheiro: src/features/flights/loaders.ts  (SUBSTITUIR o ficheiro todo — ou só o import e a function `flightLoader`)

**O que muda (em relação à tag `sessao-06`):**
- import: entra o `data` (value) ao lado do `type LoaderFunctionArgs`
- `flightLoader`: o `throw Error('Missing flight ID')` passa a `throw data(…, { status: 400 })`
- `flightLoader`: novo `if (!flight)` com `throw data(…, { status: 404 })`
- `flightsLoader`: **não muda** — quem fez o bónus da S6 (`capitalize` + `throw redirect`) mexe só no import e no `flightLoader`

```ts
import { data, type LoaderFunctionArgs } from "react-router";   // ← MUDOU: + data
import type { Flight } from "./data/flight";
import type { Filter } from "./SearchForm"
import { fetchFlight, fetchFlights } from "./data/flights-api";

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

export async function flightLoader({params, request}: LoaderFunctionArgs): Promise<Flight>{
    if(!params.id) throw data('Missing flight ID', { status: 400 });          // ← MUDOU: throw data
    const flight = await fetchFlight(params.id, request.signal);
    if(!flight) throw data(`Flight ${params.id} not found`, { status: 404 });  // ← NOVO
    return flight;
}
```

## SLIDE 11 · E1 · RouteError: um component para os errors

### Ficheiro: src/pages/RouteError.tsx  (CRIAR)

```tsx
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { Panel } from '../ui/Panel';

export function RouteError() {
  const error = useRouteError(); // unknown: o que foi lançado (throw)

  if (isRouteErrorResponse(error)) {
    // veio de um throw data(...) → tem status e data
    return (
      <Panel title={`Error ${error.status}`}>
        <p>{String(error.data)}</p>
        <Link to="/flights">← Back to flights</Link>
      </Panel>
    );
  }

  // qualquer outro erro: fetch falhou, bug no render, ...
  return (
    <Panel title="Something went wrong">
      <p>{error instanceof Error ? error.message : String(error)}</p>
      <Link to="/flights">← Back to flights</Link>
    </Panel>
  );
}
```

### Ficheiro: src/router.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação à tag `sessao-06`):**
- novo import do `RouteError`
- `ErrorBoundary: RouteError` nas duas rotas com loader: `flights` e `flights/:id`
- quem tem a rota `basket` do exercício da S6: **mantém-na** (o snippet parte da tag `sessao-06`, sem ela)

```tsx
import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { AboutPage } from "./pages/AboutPage";
import { flightLoader, flightsLoader } from "./features/flights/loaders";
import { FlightDetail } from "./features/flights/FlightDetail";
import { RouteError } from "./pages/RouteError";   // ← NOVO

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
        children: [
            {index: true, element: <Navigate to='/flights' replace/>},
            {path: 'flights', Component: FlightSearch, loader: flightsLoader, ErrorBoundary: RouteError },   // ← MUDOU: + ErrorBoundary
            {path: 'flights/:id', Component: FlightDetail, loader: flightLoader, ErrorBoundary: RouteError },   // ← MUDOU: + ErrorBoundary
            {path: 'about', Component: AboutPage },
        ]
    }
])
```

## SLIDE 12 · E2 · Uma página 404 para URLs que não existem

### Ficheiro: src/pages/NotFoundPage.tsx  (CRIAR)

```tsx
import { Link } from 'react-router';
import { Panel } from '../ui/Panel';

export function NotFoundPage() {
  return (
    <Panel title="404 · Page not found">
      <p className="empty">This page doesn't exist.</p>
      <Link to="/flights">← Back to flights</Link>
    </Panel>
  );
}
```

### Ficheiro: src/router.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação ao slide 11):**
- novo import do `NotFoundPage`
- nova rota `{ path: '*', Component: NotFoundPage }`, a última dos `children`
- quem tem a rota `basket` do exercício da S6: **mantém-na** (o snippet parte da tag `sessao-06`, sem ela)

```tsx
import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { AboutPage } from "./pages/AboutPage";
import { flightLoader, flightsLoader } from "./features/flights/loaders";
import { FlightDetail } from "./features/flights/FlightDetail";
import { RouteError } from "./pages/RouteError";
import { NotFoundPage } from "./pages/NotFoundPage";   // ← NOVO

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
        children: [
            {index: true, element: <Navigate to='/flights' replace/>},
            {path: 'flights', Component: FlightSearch, loader: flightsLoader, ErrorBoundary: RouteError },
            {path: 'flights/:id', Component: FlightDetail, loader: flightLoader, ErrorBoundary: RouteError },
            {path: 'about', Component: AboutPage },
            {path: '*', Component: NotFoundPage }, // ← NOVO: qualquer outro URL
        ]
    }
])
```

## SLIDE 14 · E3 · Um ErrorBoundary para todas as rotas (pathless route)

### Ficheiro: src/router.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação ao slide 12):**
- os `children` do `/` passam para dentro de um object **sem `path`** (pathless route), com `ErrorBoundary: RouteError` — um nível a mais de `{ … children: [ … ] }`
- **atenção:** o `ErrorBoundary` vai nesse object novo, **não** na rota `'/'` ao lado do `Component: App`
- os `ErrorBoundary` de `flights` e `flights/:id` **saem** (o da pathless route serve a todas)
- imports: não mudam
- quem tem a rota `basket` do exercício da S6: **mantém-na** (o snippet parte da tag `sessao-06`, sem ela)

```tsx
import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { AboutPage } from "./pages/AboutPage";
import { flightLoader, flightsLoader } from "./features/flights/loaders";
import { FlightDetail } from "./features/flights/FlightDetail";
import { RouteError } from "./pages/RouteError";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
        children: [
            {                                // ← NOVO: abre a pathless route (sem path)
                // pathless route: não muda o URL, só agrupa as rotas
                // um ErrorBoundary para todas → o erro aparece dentro do layout (no <Outlet /> do App)
                ErrorBoundary: RouteError,   // ← NOVO: aqui, NÃO na rota '/' (aí substituía o App e a nav)
                children: [                  // ← NOVO: as rotas de antes passam para aqui, um nível abaixo
                    {index: true, element: <Navigate to='/flights' replace/>},
                    {path: 'flights', Component: FlightSearch, loader: flightsLoader },   // ← MUDOU: sem ErrorBoundary
                    {path: 'flights/:id', Component: FlightDetail, loader: flightLoader },   // ← MUDOU: sem ErrorBoundary
                    {path: 'about', Component: AboutPage },
                    {path: '*', Component: NotFoundPage }, // qualquer outro URL
                ]                            // ← NOVO: fecha os children da pathless route
            }                                // ← NOVO: fecha a pathless route
        ]
    }
])
```

## SLIDE 15 · E3 · onError: registar cada error, uma vez

### Ficheiro: src/main.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação à tag `sessao-06`):**
- novo `import type { ClientOnErrorFunction }`
- nova const `logError`, antes do `createRoot`
- no `<RouterProvider>`: + `onError={logError}`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom'
import { router } from './router';
import type { ClientOnErrorFunction } from 'react-router';   // ← NOVO

// chamado 1 vez por erro (loader, action ou render) → logging / Sentry / ...
const logError: ClientOnErrorFunction = (error, { location, pattern }) => {   // ← NOVO
  console.error(`[Skyline] ${location.pathname} (${pattern})`, error);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} onError={logError} />
  </StrictMode>,
)
```

## SLIDE 23 · L1 · lazy nas rotas

### Ficheiro: src/router.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação ao slide 14, paragem 1):**
- **saem** os imports de `FlightDetail` e `AboutPage` (passam a `import()` dentro do `lazy`)
- `flights/:id`: o `Component` passa a `lazy`; o `loader` **fica** estático
- `about`: o `Component` passa a `lazy`
- quem tem a rota `basket` do exercício da S6: **mantém-na** (o snippet parte da tag `sessao-06`, sem ela)

```tsx
import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { flightLoader, flightsLoader } from "./features/flights/loaders";
import { RouteError } from "./pages/RouteError";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
        children: [
            {
                // pathless route: não muda o URL, só agrupa as rotas
                // um ErrorBoundary para todas → o erro aparece dentro do layout
                ErrorBoundary: RouteError,
                children: [
                    {index: true, element: <Navigate to='/flights' replace/>},
                    {path: 'flights', Component: FlightSearch, loader: flightsLoader },
                    {
                        path: 'flights/:id',
                        loader: flightLoader, // estático (não muda): arranca logo, em paralelo com o chunk
                        lazy: async () => {   // ← NOVO
                            const { FlightDetail } = await import('./features/flights/FlightDetail');
                            return { Component: FlightDetail };
                        },
                    },
                    {
                        path: 'about',
                        lazy: async () => {   // ← NOVO
                            const { AboutPage } = await import('./pages/AboutPage');
                            return { Component: AboutPage };
                        },
                    },
                    {path: '*', Component: NotFoundPage }, // qualquer outro URL
                ]
            }
        ]
    }
])
```

## SLIDE 24 · L1 · Experimentar: os chunks

### Terminal  (num terminal à parte; o `npm start` continua)

```bash
npm run build
```

## SLIDE 26 · L2 · O SeatMap

### Ficheiro: src/index.css  (ACRESCENTAR no fim — CSS pronto para toda a sessão)

```css
/* Sessão 7 · seat map, skeleton, modal */
.seatmap { margin: 0.5rem 0 1rem; }
.seats { display: grid; grid-template-columns: repeat(6, 2.6rem); gap: 0.3rem; margin-top: 0.5rem; }
.seat { text-align: center; font-size: 0.75rem; padding: 0.25rem 0; border-radius: 4px; background: var(--chip); color: var(--primary); }
.seat.taken { background: var(--muted); color: #fff; opacity: 0.5; }
.skeleton { height: 1rem; margin: 0.4rem 0; border-radius: 4px; background: linear-gradient(90deg, var(--chip) 25%, #fff 50%, var(--chip) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.skeleton:nth-child(2) { width: 80%; }
.skeleton:nth-child(3) { width: 60%; }
@keyframes shimmer { to { background-position: -200% 0; } }
.related { list-style: none; padding: 0; }
.related li { padding: 0.3rem 0; border-bottom: 1px solid var(--chip); }
.modal-backdrop { position: fixed; inset: 0; background: rgb(0 0 0 / 0.45); display: grid; place-items: center; z-index: 10; }
.modal { background: #fff; border-radius: 8px; padding: 1rem 1.25rem; min-width: 22rem; box-shadow: 0 10px 30px rgb(0 0 0 / 0.3); }
.modal-header { display: flex; justify-content: space-between; align-items: center; }
```

### Ficheiro: src/features/flights/SeatMap.tsx  (CRIAR)

```tsx
import type { Flight } from './data/flight';

const ROWS = 12;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// lugares ocupados "fingidos", mas sempre iguais para o mesmo voo
const isTaken = (flightId: number, row: number, col: number) => (row * 7 + col * 3 + flightId) % 4 === 0;

export function SeatMap({ flight }: { flight: Flight }) {
  const seats = Array.from({ length: ROWS }, (_, r) =>
    LETTERS.map((letter, c) => ({ id: `${r + 1}${letter}`, taken: isTaken(flight.id, r, c) })),
  ).flat();
  const free = seats.filter((s) => !s.taken).length;

  return (
    <div className="seatmap">
      <p className="empty">{flight.aircraft.type} · {free} free seats</p>
      <div className="seats">
        {seats.map((s) => (
          <span key={s.id} className={s.taken ? 'seat taken' : 'seat'}>{s.id}</span>
        ))}
      </div>
    </div>
  );
}
```

## SLIDE 27 · L2 · O FlightDetail mostra o seat map a pedido

### Ficheiro: src/features/flights/FlightDetail.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação à tag `sessao-06`):**
- novo import de `lazy, Suspense, useState` (de `'react'`)
- nova const `SeatMap = lazy(…)`, **fora** do component
- novo state `showSeats`
- JSX: novo bloco `{showSeats && <Suspense …><SeatMap … /></Suspense>}`, a seguir à tabela de preços
- JSX: novo botão **Seats / Hide seats**, antes do `← Back`

```tsx
import { lazy, Suspense, useState } from 'react';   // ← NOVO
import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';

// só é descarregado quando for renderizado pela 1ª vez
const SeatMap = lazy(() => import('./SeatMap').then((m) => ({ default: m.SeatMap })));   // ← NOVO

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const flight = useLoaderData<typeof flightLoader>();
  const navigate = useNavigate();
  const [showSeats, setShowSeats] = useState(false);   // ← NOVO

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
      {showSeats && (
        <Suspense fallback={<p className="empty">Loading seat map...</p>}>
          <SeatMap flight={flight} />
        </Suspense>
      )}
      <Button variant="ghost" onClick={() => setShowSeats((s) => !s)}>
        {showSeats ? 'Hide seats' : 'Seats'}
      </Button>
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}
```

## SLIDE 27 · L2 · Ajustar para export default (a forma dos docs)

Depois de ver o `.then` a funcionar: o `lazy` espera um module com **`default`**. Com um export default no `SeatMap`, o `.then` deixa de ser preciso.

### Ficheiro: src/features/flights/SeatMap.tsx  (ALTERAR uma linha: + `default`)

```tsx
export default function SeatMap({ flight }: { flight: Flight }) {   // ← MUDOU: + default
```

### Ficheiro: src/features/flights/FlightDetail.tsx  (ALTERAR uma linha: o `lazy` sem `.then`)

```tsx
const SeatMap = lazy(() => import('./SeatMap'));   // ← MUDOU: já há default, sem .then
```

## SLIDE 35 · D1 · Uma promise no resultado do loader

### Ficheiro: src/features/flights/data/flights-api.ts  (ACRESCENTAR no fim)

```ts
// outros voos na mesma rota (from → to), sem o próprio
export async function fetchRelatedFlights(flight: Flight, signal?: AbortSignal): Promise<Flight[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // simula um endpoint lento
  const flights = await fetchFlights({ from: flight.from, to: flight.to }, signal);
  return flights.filter((f) => f.id !== flight.id);
}
```

### Ficheiro: src/features/flights/loaders.ts  (SUBSTITUIR o ficheiro todo — ou só o import, o type novo e a function `flightLoader`)

**O que muda (em relação ao slide 10):**
- import: + `fetchRelatedFlights`
- novo `type FlightData` (`flight` + `related: Promise<Flight[]>`)
- `flightLoader`: return type `Promise<Flight>` → `Promise<FlightData>`
- `flightLoader`: no fim, `related` **sem await** e `return { flight, related }`
- `flightsLoader`: não muda

```ts
import { data, type LoaderFunctionArgs } from "react-router";
import type { Flight } from "./data/flight";
import type { Filter } from "./SearchForm"
import { fetchFlight, fetchFlights, fetchRelatedFlights } from "./data/flights-api";   // ← MUDOU: + fetchRelatedFlights

type FlightData = {   // ← NOVO
    flight: Flight;
    related: Promise<Flight[]>; // ainda não resolvida
}

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

export async function flightLoader({params, request}: LoaderFunctionArgs): Promise<FlightData>{   // ← MUDOU: era Promise<Flight>
    if(!params.id) throw data('Missing flight ID', { status: 400 });
    const flight = await fetchFlight(params.id, request.signal);
    if(!flight) throw data(`Flight ${params.id} not found`, { status: 404 });

    const related = fetchRelatedFlights(flight, request.signal); // ← NOVO: SEM await
    return { flight, related }; // ← MUDOU: o essencial já, o resto quando chegar
}
```

### Ficheiro: src/features/flights/FlightDetail.tsx  (ALTERAR uma linha: `const flight = useLoaderData…` passa a destructuring)

```tsx
  const { flight } = useLoaderData<typeof flightLoader>();
```

## SLIDE 36 · D2 · RelatedFlights e o skeleton

### Ficheiro: src/features/flights/RelatedFlights.tsx  (CRIAR)

```tsx
import { use } from 'react';
import { Link } from 'react-router';
import type { Flight } from './data/flight';

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

export function RelatedFlights({ related }: { related: Promise<Flight[]> }) {
  const flights = use(related); // suspende até a promise resolver

  if (flights.length === 0) return <p className="empty">No other flights on this route.</p>;

  return (
    <ul className="related">
      {flights.map((f) => (
        <li key={f.id}>
          <Link to={`/flights/${f.id}`}>#{f.id} · {dateFormat.format(new Date(f.date))}</Link>
          {f.delayed && <> · +{f.delay} min</>}
        </li>
      ))}
    </ul>
  );
}

export function RelatedSkeleton() {
  return (
    <div aria-busy="true">
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}
```

## SLIDE 37 · D2 · O Suspense no detalhe

### Ficheiro: src/features/flights/FlightDetail.tsx  (SUBSTITUIR o ficheiro todo)

**O que muda (em relação ao slide 35):**
- novo import de `RelatedFlights, RelatedSkeleton`
- `useLoaderData`: `{ flight }` → `{ flight, related }`
- JSX: novo `<h3>` + `<Suspense fallback={<RelatedSkeleton />}>` com `<RelatedFlights related={related} />`, a seguir à tabela de preços

```tsx
import { lazy, Suspense, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import type { flightLoader } from './loaders';
import { RelatedFlights, RelatedSkeleton } from './RelatedFlights';   // ← NOVO

// só é descarregado quando for renderizado pela 1ª vez
const SeatMap = lazy(() => import('./SeatMap'));

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'full', timeStyle: 'short' });

export function FlightDetail() {
  const { flight, related } = useLoaderData<typeof flightLoader>();   // ← MUDOU: + related
  const navigate = useNavigate();
  const [showSeats, setShowSeats] = useState(false);

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
      <h3>Other flights on this route</h3>
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedFlights related={related} />
      </Suspense>
      {showSeats && (
        <Suspense fallback={<p className="empty">Loading seat map...</p>}>
          <SeatMap flight={flight} />
        </Suspense>
      )}
      <Button variant="ghost" onClick={() => setShowSeats((s) => !s)}>
        {showSeats ? 'Hide seats' : 'Seats'}
      </Button>
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
    </Panel>
  );
}
```

## SLIDE 39 · D3 · Um key no Suspense

### Ficheiro: src/features/flights/FlightDetail.tsx  (ALTERAR uma linha: o `<Suspense>` do `RelatedFlights` ganha `key={flight.id}`)

```tsx
      <Suspense key={flight.id} fallback={<RelatedSkeleton />}>
```

## Para ler mais

- [Error Boundaries — reactrouter.com](https://reactrouter.com/how-to/error-boundary) — `ErrorBoundary`, `useRouteError`, `throw data()` (slides 7–15)
- [RouterProvider — reactrouter.com](https://reactrouter.com/api/data-routers/RouterProvider) — `onError` (slide 15)
- [Route Object · lazy — reactrouter.com](https://reactrouter.com/start/data/route-object) — rotas lazy (slides 21–23)
- [lazy — react.dev](https://react.dev/reference/react/lazy) e [Suspense — react.dev](https://react.dev/reference/react/Suspense) — `React.lazy`, fallback, reset com key (slides 25–27, 38–39)
- [use — react.dev](https://react.dev/reference/react/use) — ler uma promise no render (slide 33)
- [Streaming with Suspense — reactrouter.com](https://reactrouter.com/how-to/suspense) — promise sem await no loader, `<Await>` (slides 32, 40)
