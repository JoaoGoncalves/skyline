# Exercício da Sessão 2 — resolução

Ponto de partida: tag `sessao-02`. Os passos E1 → E10 dizem **onde** entra cada alteração.
Nota: esta resolução **não entra no `main`** — na Sessão 3 o `FlightSearch` foi reorganizado (`SearchForm`).
Se fizeram o exercício, guardem-no numa branch (`git switch -c exercicio-s2`) antes de atualizar o `main`.

---

## E1 · `src/features/flights/data/price.ts` (ficheiro novo)

```ts
import type { Flight } from "./flight";

export function lowestPrice(flight: Flight): number {
  return Math.min(...flight.prices.map((p) => p.amount));
}
```

## E2 · `FlightCard.tsx` — usar a função partilhada

Acrescentar o import:

```tsx
import { lowestPrice } from "./data/price";
```

Substituir `const lowestPrice = Math.min(...)` por:

```tsx
const price = lowestPrice(flight);
```

E no JSX: `from {lowestPrice} €` → `from {price} €`

> Porquê mudar o nome: a variável local `lowestPrice` taparia a função importada.

---

## E3 · `FlightSearch.tsx` — imports e tipos

Na linha do import do React, acrescentar `useId`:

```tsx
import { useId, useRef, useState, type SubmitEvent, type ChangeEvent } from "react";
```

Acrescentar:

```tsx
import { lowestPrice } from "./data/price";
```

Substituir o `type Filter`:

```tsx
type Filter = {from: string, to: string, maxPrice: string}
type SortOrder = 'none' | 'asc' | 'desc';
```

E no `useState<Filter>` acrescentar `maxPrice: ''`:

```tsx
const [filter, setFilter] = useState<Filter>({from: 'Lisbon', to: 'Porto', maxPrice: ''});
```

## E4 · state dos novos controlos (depois do `fromRef`)

```tsx
const [onlyOnTime, setOnlyOnTime] = useState(false);
const [sort, setSort] = useState<SortOrder>('none');
const onTimeId = useId();
const sortId = useId();
```

## E5 · lista derivada (depois do `selectedCount`)

```tsx
const max = Number(filter.maxPrice); // '' → 0 → sem limite
const filtered = flights
    .filter(f => !onlyOnTime || !f.delayed)
    .filter(f => !max || lowestPrice(f) <= max);
const visibleFlights = sort === 'none'
    ? filtered
    : filtered.toSorted((a, b) => (sort === 'asc' ? 1 : -1) * (lowestPrice(a) - lowestPrice(b)));
```

> **A reter:** nada de `useState` para o resultado nem `useEffect` — muda um filtro, o componente renderiza, isto recalcula.

## E6 · handlers (depois do `handleChange`)

```tsx
function handleOnTimeChange(event: ChangeEvent<HTMLInputElement>): void {
    setOnlyOnTime(event.target.checked);
}

function handleSortChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSort(event.target.value as SortOrder); // seguro: as <option> são nossas
}
```

> O preço máx. **não precisa de handler novo** — o `handleChange` usa o `name` do input (`maxPrice`).

## E7 · `clear()` — repor tudo

```tsx
function clear(): void {
   setFilter({from: '', to: '', maxPrice: ''});
   setFlights([]);
   setOnlyOnTime(false);
   setSort('none');
   fromRef.current?.focus();
}
```

---

## E8 · JSX — novos controlos (dentro do `<form>`, depois do `SearchInput` "To")

```tsx
<SearchInput label="Preço máx. (€)" name='maxPrice' type='number' min={0}
    placeholder='sem limite' value={filter.maxPrice} onChange={handleChange}/>
<div className="check">
    <input id={onTimeId} type="checkbox" checked={onlyOnTime} onChange={handleOnTimeChange}/>
    <label htmlFor={onTimeId}>Só voos sem atraso</label>
</div>
<div className="field">
    <label htmlFor={sortId}>Ordenar</label>
    <select id={sortId} value={sort} onChange={handleSortChange}>
        <option value="none">—</option>
        <option value="asc">Preço ↑</option>
        <option value="desc">Preço ↓</option>
    </select>
</div>
```

> `type`, `min` e `placeholder` passam pelo `...rest` do `SearchInput` — o componente não muda.

## E9 · JSX — contador e lista (substituir a linha da `FlightList`)

```tsx
{flights.length > 0 && (
    <p className="results-info">{visibleFlights.length} de {flights.length} voos</p>
)}
<FlightList flights={visibleFlights} basket={basket} onToggle={updatebasket} />
```

> A única mudança na `FlightList` é `flights` → `visibleFlights`.

## E10 · `src/index.css` (acrescentar no fim)

```css
.check { display: flex; gap: 0.4rem; align-items: center; font-size: 0.9rem; padding-bottom: 0.5rem; }
.field select { padding: 0.5rem 0.65rem; border: 1px solid #d5dcc4; border-radius: 6px; font: inherit; background: #fff; }
.results-info { color: var(--muted); font-size: 0.85rem; margin: 0 0 0.75rem; }
```

---

## Testar

Lisbon → Porto → Search: **5 de 5** · "Só voos sem atraso": **3 de 5** · + máx. 150: **2 de 5** · Preço ↑: 85 → 156 · Clear repõe tudo.
Selecionar um card e ordenar → a seleção acompanha o voo: é a `key={flight.id}` (Sessão 3).
