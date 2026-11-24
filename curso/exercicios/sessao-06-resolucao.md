# Exercício da Sessão 6 — resolução

Ponto de partida: tag `sessao-06`. E1 é a resposta ao obrigatório, E2 ao extra, E3 ao bónus.

---

## E1 · Obrigatório — a rota `/basket`

### Ir buscar vários voos de uma vez

```ts
// src/features/flights/data/flights-api.ts — acrescentar no fim
export async function fetchFlightsByIds(ids: number[], signal?: AbortSignal): Promise<Flight[]> {
  if (ids.length === 0) return []; // sem ids, o json-server devolvia TODOS os voos
  const params = new URLSearchParams(ids.map((id) => ['id', String(id)]));
  const response = await fetch(`${API_URL}/flights?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

- `URLSearchParams` com uma lista de pares → `id=5&id=7`.
- O `if` do cesto vazio é o ponto que mais falha: sem ele, `GET /flights` devolve tudo.

### O loader

```ts
// src/features/basket/basket-loader.ts
import type { LoaderFunctionArgs } from 'react-router';
import type { Flight } from '../flights/data/flight';
import { fetchFlightsByIds } from '../flights/data/flights-api';

export async function basketLoader({ request }: LoaderFunctionArgs): Promise<Flight[]> {
  const stored = localStorage.getItem('skyline.basket');
  const basket: Record<string, boolean> = stored ? JSON.parse(stored) : {};
  const ids = Object.entries(basket)
    .filter(([, selected]) => selected)
    .map(([id]) => Number(id));
  return fetchFlightsByIds(ids, request.signal);
}
```

- O loader corre fora do React: lê o `localStorage` diretamente, sem hooks.
- As chaves de um object vindo de JSON são strings → `Number(id)`.
- Só os voos com `true`: um Remove deixa `"8": false` no cesto.

### A página

```tsx
// src/features/basket/BasketPage.tsx
import { useLoaderData } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Panel } from '../../ui/Panel';
import { FlightList } from '../flights/FlightList';
import type { basketLoader } from './basket-loader';

export function BasketPage() {
  const flights = useLoaderData<typeof basketLoader>();
  const [basket, setBasket] = useLocalStorage<Record<number, boolean>>('skyline.basket', {});

  // E2 · derived state: o Remove tira o voo logo, sem correr o loader outra vez
  const selected = flights.filter((f) => basket[f.id]);
  const total = selected.reduce((sum, f) => sum + Math.min(...f.prices.map((p) => p.amount)), 0);

  function updateBasket(flightId: number, value: boolean): void {
    setBasket((b) => ({ ...b, [flightId]: value }));
  }

  return (
    <Panel title="Basket" actions={<span className="chip">{selected.length} · from {total} €</span>}>
      {selected.length === 0 ? (
        <p className="empty">O cesto está vazio.</p>
      ) : (
        <FlightList flights={selected} basket={basket} onToggle={updateBasket} />
      )}
    </Panel>
  );
}
```

### A rota e o `NavLink`

```tsx
// src/router.tsx — nos children
{ path: 'basket', Component: BasketPage, loader: basketLoader },
```

```tsx
// src/App.tsx — no <nav>
<NavLink to="/basket">Basket</NavLink>
```

---

## E2 · Extra — Remove e total

Já está na página acima:

```tsx
const selected = flights.filter((f) => basket[f.id]);
const total = selected.reduce((sum, f) => sum + Math.min(...f.prices.map((p) => p.amount)), 0);
```

- Os voos vêm do loader; o cesto vem do `useLocalStorage`. Cruzar os dois no render é **derived state**: o Remove muda o cesto, o component renderiza, o voo sai — sem novo request.
- Um `useState` com a lista e um `setSelected` no Remove davam o mesmo resultado com mais código e duas fontes de verdade.

---

## E3 · Bónus — normalizar e fazer redirect

```ts
// src/features/flights/loaders.ts
import { redirect, type LoaderFunctionArgs } from 'react-router';

export async function flightsLoader({ url, request }: LoaderFunctionArgs): Promise<FlightsData> {
  const from = capitalize(url.searchParams.get('from'));
  const to = capitalize(url.searchParams.get('to'));
  if (!from || !to) return { filter: null, flights: [] };

  // ?from=lisbon → redirect para ?from=Lisbon (o json-server compara maiúsculas)
  const normalized = new URLSearchParams({ from, to });
  if (url.searchParams.toString() !== normalized.toString()) {
    throw redirect(`/flights?${normalized}`);
  }

  const filter: Filter = { from, to };
  const flights = await fetchFlights(filter, request.signal);
  return { filter, flights };
}

// " lisbon " → "Lisbon"
function capitalize(value: string | null): string {
  const v = (value ?? '').trim().toLowerCase();
  return v.charAt(0).toUpperCase() + v.slice(1);
}
```

- `throw redirect(…)`: o router para este loader e navega para o URL novo, que volta a passar no loader — agora igual, sem redirect.
- Sem o `if`, o redirect repetia-se para sempre.
- O utilizador vê o URL corrigido na barra de endereço: o link partilhado passa a ser o certo.
