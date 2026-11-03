# React Avançado · Sessão 1 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

## SLIDE 13 · S1 · Criar o Skyline

**Terminal**

```bash
npm create vite@latest skyline -- --template react-ts
cd skyline
npm install

npm install -D json-server@0.17 npm-run-all2

npm pkg set scripts.api="json-server --watch db.json --port 3000"
npm pkg set scripts.start="run-p api dev"
```

Resultado em package.json ("scripts"):

```json
"dev": "vite",
"build": "tsc -b && vite build",
"lint": "oxlint",
"preview": "vite preview",
"api": "json-server --watch db.json --port 3000",
"start": "run-p api dev"
```

> **ATENÇÃO:** json-server@0.17 — fixar a versão. A 1.x mudou a sintaxe dos filtros e da paginação.

**Perguntas do `create-vite` (9.x)** — avisar a sala antes:

| Pergunta | Resposta | Porquê |
|---|---|---|
| *Which linter to use?* | **Oxlint** (o default) | dá `"lint": "oxlint"` e o `npx oxlint` do fecho |
| *Install with npm and start now?* | **No** | seguimos com `cd skyline` + `npm install`. Quem disse Yes: `Ctrl+C`, `cd skyline` e saltar o `npm install` |

> **AVISO no `npm install` (só Mac):** `install scripts blocked … fsevents` → normal, seguir em frente. É uma dependência opcional do Vite com binário pré-compilado; funciona na mesma. Para o calar: `npm install-scripts approve fsevents`.

> **AVISO no `npm install -D json-server@0.17`:** `deprecated connect-pause@0.1.1` → dependência interna do json-server 0.17 (versão fixada de propósito). Funciona na mesma — seguir em frente.

## SLIDE 13 · S2 · Dados da API

### Ficheiro: db.json  (CRIAR, na raiz — ao lado do package.json)

Copiar o db.json fornecido (30 voos, os mesmos do Skyboard). Origem: github.com/JoaoGoncalves/skyboard → db.json

> **ATENÇÃO:** copiar o `db.json` **antes** do `npm start`. Se não existir, o json-server 0.17 cria um `db.json` de exemplo (`posts`, `comments`, `profile`). Sintoma: `/flights` não existe. Solução: substituir pelo `db.json` fornecido (e reiniciar o `npm start` se não recarregar).

```bash
npm start
  → http://localhost:3000/flights                     (json-server)
  → http://localhost:5173                             (Vite)
```

Testar no browser:

```text
http://localhost:3000/flights?from=Lisbon&to=Porto  → 5 voos
http://localhost:3000/flights?from=lisbon&to=Porto  → []  (case-sensitive)
```

Pares válidos: Lisbon/Porto, Lisbon/Faro, Porto/Lisbon, Porto/Faro, Faro/Lisbon, Faro/Porto (5 voos cada).

## SLIDE 14 · S3 · Limpar o template e organizar as pastas

### Apagar: src/assets/  ·  src/App.css

(também se pode apagar public/icons.svg)

### Ficheiro: index.html  (ALTERAR duas linhas)

```html
<html lang="pt">
...
<title>Skyline</title>
```

### Ficheiro: src/index.css  (SUBSTITUIR — CSS fornecido, não é matéria)

```css
/* Skyline — estilos base (fornecidos; não são matéria do curso) */
:root {
  --primary: #6a8320;
  --accent: #9cc22f;
  --dark: #111311;
  --chip: #f2f5e6;
  --ink: #0f1a08;
  --muted: #6b7a5a;
  --warn: #b8541f;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--ink);
  background: #fafbf6;
}
* { box-sizing: border-box; }
body { margin: 0; }
.app { min-height: 100vh; }
.topbar { display: flex; gap: 0.75rem; align-items: baseline; padding: 1rem 1.5rem; background: var(--dark); color: #fff; }
.topbar strong { font-size: 1.25rem; color: var(--accent); }
.topbar span { color: var(--chip); font-size: 0.9rem; }
.content { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
.panel { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgb(0 0 0 / 0.08); }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--chip); }
.panel-header h2 { margin: 0; font-size: 1.2rem; }
.panel-body { padding: 1.25rem; }
.search { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end; margin-bottom: 1.25rem; }
.field { display: flex; flex-direction: column; gap: 0.25rem; }
.field label { font-size: 0.8rem; color: var(--muted); }
.field input { padding: 0.5rem 0.65rem; border: 1px solid #d5dcc4; border-radius: 6px; font: inherit; }
.btn { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--primary); font: inherit; cursor: pointer; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-ghost { background: transparent; color: var(--primary); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.card { border: 1px solid var(--chip); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
.card p { margin: 0; color: var(--muted); font-size: 0.9rem; }
.card.selected { border-color: var(--accent); background: var(--chip); }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-header h3 { margin: 0; font-size: 1rem; }
.card .price { color: var(--ink); font-weight: 600; }
.card .btn { margin-top: 0.5rem; align-self: flex-start; }
.badge { background: var(--warn); color: #fff; border-radius: 999px; padding: 0.1rem 0.5rem; font-size: 0.75rem; }
.chip { background: var(--chip); color: var(--primary); border-radius: 999px; padding: 0.2rem 0.65rem; font-size: 0.85rem; }
.empty { color: var(--muted); }
```

### Ficheiro: src/App.tsx  (SUBSTITUIR — versão inicial)

```tsx
export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        <p>Hello, Skyline</p>
      </main>
    </div>
  );
}
```

### Pastas (CRIAR, vazias)

```text
src/ui/
src/features/flights/data/
```

## SLIDE 18–19 · S4 · O domínio em tipos

### Ficheiro: src/features/flights/data/flight.ts  (CRIAR)

```ts
export type FlightClass = 'economy' | 'business' | 'first';

export interface Price {
  flightClass: FlightClass;
  amount: number;
}

export interface Aircraft {
  type: string;
  registration: string;
}

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string; // ISO, ex.: 2026-10-09T08:15:00.000Z
  delayed: boolean;
  delay: number; // minutos
  aircraft: Aircraft;
  prices: Price[];
}
```

## SLIDE 19 · S5 · Voos estáticos (temporário até à Sessão 4)

### Ficheiro: src/features/flights/data/sample-flights.ts  (CRIAR — colar)

```ts
import type { Flight } from './flight';

// Cópia de 10 voos do db.json (Lisbon → Porto / Faro).
// Temporário: na Sessão 4 passamos a ir buscar os voos ao json-server.
export const sampleFlights: Flight[] = [
  {
    id: 5, from: 'Lisbon', to: 'Porto', date: '2026-10-09T08:15:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A321neo', registration: 'CS-1005' },
    prices: [{ flightClass: 'economy', amount: 156 }, { flightClass: 'business', amount: 310 }, { flightClass: 'first', amount: 638 }],
  },
  {
    id: 7, from: 'Lisbon', to: 'Porto', date: '2026-09-08T09:40:00.000Z',
    delayed: true, delay: 15,
    aircraft: { type: 'E195', registration: 'CS-1007' },
    prices: [{ flightClass: 'economy', amount: 103 }, { flightClass: 'business', amount: 285 }, { flightClass: 'first', amount: 552 }],
  },
  {
    id: 8, from: 'Lisbon', to: 'Porto', date: '2026-10-19T06:00:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'B737-800', registration: 'CS-1008' },
    prices: [{ flightClass: 'economy', amount: 126 }, { flightClass: 'business', amount: 344 }, { flightClass: 'first', amount: 533 }],
  },
  {
    id: 9, from: 'Lisbon', to: 'Faro', date: '2026-09-12T14:20:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A220', registration: 'CS-1009' },
    prices: [{ flightClass: 'economy', amount: 188 }, { flightClass: 'business', amount: 426 }, { flightClass: 'first', amount: 634 }],
  },
  {
    id: 15, from: 'Lisbon', to: 'Faro', date: '2026-10-10T11:40:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E190', registration: 'CS-1015' },
    prices: [{ flightClass: 'economy', amount: 184 }, { flightClass: 'business', amount: 402 }, { flightClass: 'first', amount: 605 }],
  },
  {
    id: 16, from: 'Lisbon', to: 'Porto', date: '2026-09-24T10:15:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E195', registration: 'CS-1016' },
    prices: [{ flightClass: 'economy', amount: 147 }, { flightClass: 'business', amount: 331 }, { flightClass: 'first', amount: 632 }],
  },
  {
    id: 21, from: 'Lisbon', to: 'Faro', date: '2026-10-16T06:45:00.000Z',
    delayed: true, delay: 30,
    aircraft: { type: 'A320neo', registration: 'CS-1021' },
    prices: [{ flightClass: 'economy', amount: 109 }, { flightClass: 'business', amount: 264 }, { flightClass: 'first', amount: 586 }],
  },
  {
    id: 25, from: 'Lisbon', to: 'Faro', date: '2026-09-11T13:50:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'E195', registration: 'CS-1025' },
    prices: [{ flightClass: 'economy', amount: 144 }, { flightClass: 'business', amount: 384 }, { flightClass: 'first', amount: 640 }],
  },
  {
    id: 28, from: 'Lisbon', to: 'Porto', date: '2026-09-16T10:20:00.000Z',
    delayed: true, delay: 10,
    aircraft: { type: 'A319', registration: 'CS-1028' },
    prices: [{ flightClass: 'economy', amount: 85 }, { flightClass: 'business', amount: 298 }, { flightClass: 'first', amount: 530 }],
  },
  {
    id: 29, from: 'Lisbon', to: 'Faro', date: '2026-09-15T09:50:00.000Z',
    delayed: false, delay: 0,
    aircraft: { type: 'A320', registration: 'CS-1029' },
    prices: [{ flightClass: 'economy', amount: 155 }, { flightClass: 'business', amount: 377 }, { flightClass: 'first', amount: 662 }],
  },
];
```

## SLIDES 17 e 20 · S6 · Componentes genéricos

### Ficheiro: src/ui/Button.tsx  (CRIAR)

```tsx
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn-${variant} ${className ?? ''}`} {...rest} />;
}
```

### Ficheiro: src/ui/Panel.tsx  (CRIAR)

```tsx
import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{title}</h2>
        {actions}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
```

### Ficheiro: src/App.tsx  (ACRESCENTAR — só para a demo)

```tsx
import { Button } from './ui/Button';
// ...
      <main className="content">
        <p>Hello, Skyline</p>
        <Button variant="danger">Test</Button>   {/* ← demo */}
      </main>
```

1. **Editor:** `"danger"` sublinhado a vermelho → hover: `Type '"danger"' is not assignable to type '"primary" | "ghost" | undefined'`.
2. **`Ctrl+Space`** entre as aspas → só `primary` / `ghost`. `Ctrl+Space` em `<Button ` → todas as props nativas (`onClick`, `disabled`, `aria-*`…) → é o `ComponentProps<'button'>`.
3. **Corrigir** para `variant="ghost"` → ver o estilo no browser.
4. **Apagar** o botão e o import (o `App.tsx` é substituído na Sessão 2).

> **ATENÇÃO:** o Vite **não** verifica tipos no `npm run dev` — com `"danger"` a página continua a funcionar. O erro só aparece no editor e no `npm run build` (`tsc -b` falha). Diferença para o `ng serve` do Angular. Opcional: correr `npm run build` com o erro lá e ver o `tsc` a falhar.

## SLIDE 21 · S7 · FlightCard

### Ficheiro: src/features/flights/FlightCard.tsx  (CRIAR)

```tsx
import { Button } from '../../ui/Button';
import type { Flight } from './data/flight';

type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onSelectedChange: (selected: boolean) => void;
};

const dateFormat = new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' });

export function FlightCard({ flight, selected = false, onSelectedChange }: FlightCardProps) {
  const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));

  return (
    <article className={selected ? 'card selected' : 'card'}>
      <header className="card-header">
        <h3>
          {flight.from} → {flight.to}
        </h3>
        {flight.delayed && <span className="badge">+{flight.delay} min</span>}
      </header>
      <p>
        Flight #{flight.id} · {flight.aircraft.type}
      </p>
      <p>{dateFormat.format(new Date(flight.date))}</p>
      <p className="price">from {lowestPrice} €</p>
      <Button variant={selected ? 'ghost' : 'primary'} onClick={() => onSelectedChange(!selected)}>
        {selected ? 'Remove' : 'Select'}
      </Button>
    </article>
  );
}
```
