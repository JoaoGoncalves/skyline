# React Avançado · Sessão 4 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

## SLIDE 15 · S1 · Um FlightCard lento (só para a demo)

### Ficheiro: src/dev/slow.ts  (CRIAR)

```ts
// SÓ PARA A DEMO da Sessão 4: simula um componente pesado (~ms por render).
// Retirar antes do commit final (slide 27).
export function simulateSlowRender(ms = 20): void {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // ocupa o CPU de propósito
  }
}
```

### Ficheiro: src/features/flights/FlightCard.tsx  (ACRESCENTAR)

No topo, com os outros imports:

```tsx
import { simulateSlowRender } from "../../dev/slow";
```

E na primeira linha do corpo do `FlightCard`:

```tsx
simulateSlowRender();
```

## SLIDE 16 · S2 · memo(FlightCard)

### Ficheiro: src/features/flights/FlightCard.tsx  (SUBSTITUIR)

```tsx
import { memo } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { simulateSlowRender } from "../../dev/slow";
import type { Flight } from "./data/flight";

type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onSelectedChange: (selected: boolean) => void;
};

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

// o componente passa a chamar-se FlightCardBase…
function FlightCardBase({ flight, selected = false, onSelectedChange }: FlightCardProps) {
  simulateSlowRender();

  const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));

  return (
    <article className={selected ? 'card selected' : 'card'}>
      <header className="card-header">
        <h3>
          {flight.from} ➜ {flight.to}
        </h3>
        {flight.delayed ? (
          <Badge variant="warn">+{flight.delay} min</Badge>
        ) : (
          <Badge>on Time</Badge>
        )}
      </header>
      <p>Flight #{flight.id} . {flight.aircraft.type}</p>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p className="price">from {lowestPrice} €</p>
      <Button variant={selected ? 'ghost' : 'primary'} onClick={() => onSelectedChange(!selected)}>
        {selected ? 'Remove' : 'Select'}
      </Button>
    </article>
  );
}

// …e exportamos a versão com memo: quem o usa não muda nada
export const FlightCard = memo(FlightCardBase);
```

## SLIDE 17 · S3 · useCallback no updatebasket

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useCallback, useState } from "react";
import type { Flight } from "./data/flight";
import { Panel } from "../../ui/Panel";
import { sampleFlights } from "./data/sample-flights";
import { FlightList } from "./FlightList";
import { SearchForm } from "./SearchForm";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});

    // state derivado
    const selectedCount = Object.values(basket).filter(Boolean).length;

    // a MESMA função entre renders (o setBasket é estável → deps vazias)
    const updatebasket = useCallback((flightId: number, selected: boolean): void => {
        setBasket( b => ({...b, [flightId]: selected}))
    }, []);

    function search(filter: Filter): void {
        setFlights(sampleFlights.filter( f => f.from === filter.from && f.to === filter.to));
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={search} onClear={()=>setFlights([])} />
        <FlightList flights={flights} basket={basket} onToggle={updatebasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
```

## SLIDE 18 · S4 · O card recebe o onToggle

### Ficheiro: src/features/flights/FlightCard.tsx  (SUBSTITUIR)

```tsx
import { memo } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { simulateSlowRender } from "../../dev/slow";
import type { Flight } from "./data/flight";

type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onToggle: (flightId: number, selected: boolean) => void; // a callback do pai, tal como é
};

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

function FlightCardBase({ flight, selected = false, onToggle }: FlightCardProps) {
  simulateSlowRender();

  const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));

  return (
    <article className={selected ? 'card selected' : 'card'}>
      <header className="card-header">
        <h3>
          {flight.from} ➜ {flight.to}
        </h3>
        {flight.delayed ? (
          <Badge variant="warn">+{flight.delay} min</Badge>
        ) : (
          <Badge>on Time</Badge>
        )}
      </header>
      <p>Flight #{flight.id} . {flight.aircraft.type}</p>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p className="price">from {lowestPrice} €</p>
      {/* é o card que passa o seu id */}
      <Button variant={selected ? 'ghost' : 'primary'} onClick={() => onToggle(flight.id, !selected)}>
        {selected ? 'Remove' : 'Select'}
      </Button>
    </article>
  );
}

export const FlightCard = memo(FlightCardBase);
```

### Ficheiro: src/features/flights/FlightList.tsx  (SUBSTITUIR)

```tsx
import type { Flight } from "./data/flight";
import { FlightCard } from "./FlightCard";

type FlightListProps = {
  flights: Flight[];
  basket: Record<number, boolean>;
  onToggle: (flightId: number, selected: boolean) => void;
};

export function FlightList({ flights, basket, onToggle }: FlightListProps) {

    if(flights.length === 0){
        return <p className="empty">No Flights found</p>
    }

  return (
    <div className="grid">
      {flights.map( (flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            selected= {basket[flight.id] ?? false}
            onToggle={onToggle}
        />
      ))}
    </div>
  );
}
```

## SLIDE 23 · S5 · Instalar e ligar o React Compiler

### Terminal

```bash
npm i -D babel-plugin-react-compiler @rolldown/plugin-babel @babel/core
```

### Ficheiro: vite.config.ts  (SUBSTITUIR)

```ts
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react(): JSX + Fast Refresh · babel(): corre o React Compiler sobre o nosso código
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})
```

### Terminal · reiniciar

```bash
# Ctrl+C no npm start, e depois:
npm start
```

## SLIDE 24 · S6 · Apagar o useCallback

### Ficheiro: src/features/flights/FlightSearch.tsx  (SUBSTITUIR)

```tsx
import { useState } from "react";
import type { Flight } from "./data/flight";
import { Panel } from "../../ui/Panel";
import { sampleFlights } from "./data/sample-flights";
import { FlightList } from "./FlightList";
import { SearchForm } from "./SearchForm";

type Filter = {from: string, to: string}

export function FlightSearch() {

    const [flights, setFlights] = useState<Flight[]>([]);
    const [basket, setBasket] = useState<Record<number, boolean>>({5: true, 7:true});

    // state derivado
    const selectedCount = Object.values(basket).filter(Boolean).length;

    // sem useCallback: o React Compiler memoiza esta função sozinho
    function updatebasket(flightId: number, selected: boolean): void {
        setBasket( b => ({...b, [flightId]: selected}))
    }

    function search(filter: Filter): void {
        setFlights(sampleFlights.filter( f => f.from === filter.from && f.to === filter.to));
    }

  return (
    <>
      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
        <SearchForm onSearch={search} onClear={()=>setFlights([])} />
        <FlightList flights={flights} basket={basket} onToggle={updatebasket} />
      </Panel>
      <hr />
      <pre>{JSON.stringify(basket,null, 2)}</pre>
    </>
  );
}
```

## SLIDE 27 · S7 · Retirar o card lento

### Terminal

```bash
rm src/dev/slow.ts
```

### Ficheiro: src/features/flights/FlightCard.tsx  (SUBSTITUIR)

```tsx
import { memo } from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import type { Flight } from "./data/flight";

type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onToggle: (flightId: number, selected: boolean) => void;
};

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

function FlightCardBase({ flight, selected = false, onToggle }: FlightCardProps) {

  const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));

  return (
    <article className={selected ? 'card selected' : 'card'}>
      <header className="card-header">
        <h3>
          {flight.from} ➜ {flight.to}
        </h3>
        {flight.delayed ? (
          <Badge variant="warn">+{flight.delay} min</Badge>
        ) : (
          <Badge>on Time</Badge>
        )}
      </header>
      <p>Flight #{flight.id} . {flight.aircraft.type}</p>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p className="price">from {lowestPrice} €</p>
      <Button variant={selected ? 'ghost' : 'primary'} onClick={() => onToggle(flight.id, !selected)}>
        {selected ? 'Remove' : 'Select'}
      </Button>
    </article>
  );
}

// com o Compiler, o memo continua aqui: os cards são itens de uma lista que muda
export const FlightCard = memo(FlightCardBase);
```

## Para ler mais

- [memo — react.dev](https://react.dev/reference/react/memo) — quando o `memo` salta o render, e porque uma prop nova o anula (slides 8 e 16–18)
- [useCallback — react.dev](https://react.dev/reference/react/useCallback) — manter a mesma função entre renders (slides 9 e 17)
- [useMemo — react.dev](https://react.dev/reference/react/useMemo) — manter o mesmo valor ou evitar um cálculo pesado (slide 9)
- [React Developer Tools — react.dev](https://react.dev/learn/react-developer-tools) — Components e Profiler (slide 13)
- [React Compiler — react.dev](https://react.dev/learn/react-compiler) — o que é e como instalar (slides 20–23)
- [Rules of React — react.dev](https://react.dev/reference/rules) — o código que o Compiler consegue otimizar (slides 25–27)
