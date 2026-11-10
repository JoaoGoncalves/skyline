# React Avançado · Sessão 3 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

## SLIDE 16 · Demo · ver os re-renders no Skyline  (sem código)

## SLIDE 21 · S1 · SearchForm (moving state down)

### Ficheiro: src/features/flights/SearchForm.tsx  (CRIAR)

```tsx
import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Button } from '../../ui/Button';
import { SearchInput } from './SearchInput';

export type Filter = { from: string; to: string };

type SearchFormProps = {
  onSearch: (filter: Filter) => void;
  onClear: () => void;
};

// Moving state down: o filtro só interessa ao formulário → vive aqui.
// Escrever no From renderiza o SearchForm — e mais nada.
export function SearchForm({ onSearch, onClear }: SearchFormProps) {
  const [filter, setFilter] = useState<Filter>({ from: 'Lisbon', to: 'Porto' });
  const fromRef = useRef<HTMLInputElement>(null);

  const canSearch = filter.from !== '' && filter.to !== '';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilter((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(filter); // o pai só fica a saber no submit
  }

  function clear() {
    setFilter({ from: '', to: '' });
    onClear();
    fromRef.current?.focus();
  }

  return (
    <>
      {/* o <title> segue o filtro → veio com ele */}
      <title>{`Skyline · ${filter.from || '…'} → ${filter.to || '…'}`}</title>
      <form className="search" onSubmit={handleSubmit}>
        <SearchInput ref={fromRef} label="From" name="from" value={filter.from} onChange={handleChange} />
        <SearchInput label="To" name="to" value={filter.to} onChange={handleChange} />
        <Button type="submit" disabled={!canSearch}>
          Search
        </Button>
        <Button variant="ghost" onClick={clear}>
          Clear
        </Button>
      </form>
    </>
  );
}
```

## SLIDE 22 · S2 · FlightSearch fica só com o state da lista

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useState } from 'react';
import { Panel } from '../../ui/Panel';
import { FlightList } from './FlightList';
import { SearchForm, type Filter } from './SearchForm';
import type { Flight } from './data/flight';
import { sampleFlights } from './data/sample-flights';

// Ficou só com o state de que a LISTA precisa: os voos encontrados e o cesto
export function FlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [basket, setBasket] = useState<Record<number, boolean>>({ 5: true, 7: true });

  const selectedCount = Object.values(basket).filter(Boolean).length;

  function search(filter: Filter) {
    setFlights(sampleFlights.filter((f) => f.from === filter.from && f.to === filter.to));
  }

  function updateBasket(flightId: number, selected: boolean) {
    setBasket((b) => ({ ...b, [flightId]: selected }));
  }

  return (
    <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
      <SearchForm onSearch={search} onClear={() => setFlights([])} />
      <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
    </Panel>
  );
}
```

## SLIDE 23 · S3 · AppShell com slots

### Ficheiro: src/ui/AppShell.tsx  (CRIAR)

```tsx
import type { ReactNode } from 'react';

// Layout com slots: cada slot é uma prop ReactNode (como o `actions` do Panel).
// O AppShell decide ONDE as coisas aparecem; quem o usa decide O QUÊ.
type AppShellProps = {
  brand: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({ brand, actions, children }: AppShellProps) {
  return (
    <div className="app">
      <header className="topbar">
        <strong>{brand}</strong>
        {actions}
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
```

### Ficheiro: src/App.tsx  (SUBSTITUIR)

```tsx
import { FlightSearch } from './features/flights/FlightSearch';
import { AppShell } from './ui/AppShell';

export default function App() {
  return (
    <AppShell brand="Skyline" actions={<span>flights, simplified</span>}>
      <FlightSearch />
    </AppShell>
  );
}
```

## Para ler mais

- [Rules of Hooks — react.dev](https://react.dev/reference/rules/rules-of-hooks) — as regras oficiais (slides 10–11)
- [Why Do React Hooks Rely on Call Order? — Dan Abramov](https://overreacted.io/why-do-hooks-rely-on-call-order/) — porque é que os Hooks dependem da ordem de chamada
- [React hooks: not magic, just arrays — Rudi Yardley](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) — o mesmo, explicado com diagramas de arrays e um cursor
- [You Might Not Need an Effect — react.dev](https://react.dev/learn/you-might-not-need-an-effect) — valores derivados em vez de effects (slides 8–9)
- [Preserving and Resetting State — react.dev](https://react.dev/learn/preserving-and-resetting-state) — keys e reset de state (slide 15)
- [Passing JSX as children — react.dev](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) — children e slots (slides 19 e 23)
