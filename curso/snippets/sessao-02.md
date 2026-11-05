# React Avançado · Sessão 2 · Código passo a passo

O código que escrevemos na aula, pela ordem dos slides (o número do slide corresponde ao PDF em `curso/slides/`).
Cada bloco indica o ficheiro e se é **CRIAR** (ficheiro novo), **SUBSTITUIR** (conteúdo completo) ou **ACRESCENTAR**.
Os comandos de terminal correm na pasta do projeto (a que tem o `package.json`).

---

## SLIDE 3 · E1 · Fixar a versão do Node no projeto  (o formador escreve; os formandos recebem no `git pull` do fim)

Três peças pequenas: o `npm install` passa a **recusar** um Node antigo, com uma mensagem clara, em vez de avisar e falhar mais à frente.

### Ficheiro: package.json  (ACRESCENTAR, a seguir a `"type": "module",`)

```json
  "engines": {
    "node": ">=24.15"
  },
```

### Ficheiro: .npmrc  (CRIAR, na raiz do projeto)

```ini
engine-strict=true
```

### Ficheiro: .nvmrc  (CRIAR, na raiz do projeto)

```
24
```

> **Regra para o resto do curso:** `git pull` trouxe um `package.json` novo → `npm install`.

## SLIDE 12 · S1 · FlightList

### Ficheiro: src/features/flights/FlightList.tsx  (CRIAR)

```tsx
import { FlightCard } from './FlightCard';
import type { Flight } from './data/flight';

type FlightListProps = {
  flights: Flight[];
  basket: Record<number, boolean>;
  onToggle: (flightId: number, selected: boolean) => void;
};

export function FlightList({ flights, basket, onToggle }: FlightListProps) {
  if (flights.length === 0) {
    return <p className="empty">No flights found.</p>;
  }

  return (
    <div className="grid">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          selected={basket[flight.id] ?? false}
          onSelectedChange={(selected) => onToggle(flight.id, selected)}
        />
      ))}
    </div>
  );
}
```

### Ficheiro: src/App.tsx  (SUBSTITUIR — temporário, para ver a lista)

```tsx
import { FlightList } from './features/flights/FlightList';
import { sampleFlights } from './features/flights/data/sample-flights';

// temporário (fim do bloco 01) — no bloco 02 o FlightSearch substitui isto
export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        <FlightList
          flights={sampleFlights}
          basket={{ 5: true }}
          onToggle={(flightId, selected) => console.log(flightId, selected)}
        />
      </main>
    </div>
  );
}
```

## SLIDE 13 · S1b · A vossa vez: Badge no FlightCard  (eles tentam 3 min, depois escrevemos juntos)

Usa as classes que já existem (`badge` e `chip`) + uma linha de CSS para o `chip` num card selecionado. Testado: `variant="danger"` → TS2322.

### Ficheiro: src/ui/Badge.tsx  (CRIAR)

```tsx
/*
 * Badge — estende <span> (o mesmo padrão do Button e do ExternalLink da revisão)
 * ---------------------------------------------------------------------------
 * - ComponentProps<'span'> & { … } → tudo o que um <span> aceita + a nossa prop
 * - variant: união de literais ('info' | 'warn') → variant="danger" dá erro
 * - className tirado para fora: se ficasse no ...rest (que vem depois),
 *   apagava a nossa classe → juntamos as duas
 */
import type { ComponentProps } from 'react';

type BadgeProps = ComponentProps<'span'> & {
  variant?: 'info' | 'warn';
};

export function Badge({ variant = 'info', className, ...rest }: BadgeProps) {
  const variantClass = variant === 'warn' ? 'badge' : 'chip';
  return <span className={`${variantClass} ${className ?? ''}`} {...rest} />;
}
```

### Ficheiro: src/features/flights/FlightCard.tsx  (ACRESCENTAR o import · SUBSTITUIR o `<span className="badge">` do header)

```tsx
import { Badge } from '../../ui/Badge';
```

```tsx
        {flight.delayed ? (
          <Badge variant="warn">+{flight.delay} min</Badge>
        ) : (
          <Badge>on time</Badge>
        )}
```

### Ficheiro: src/index.css  (ACRESCENTAR — o "on time" continua visível num card selecionado)

```css
.card.selected .chip { background: #fff; }
```

## SLIDE 17 · X1 · Context como provider  (opcional — só mostrar, não fica no projeto; o Context a sério é na Sessão 10)

```tsx
import { createContext, use, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
export const ThemeContext = createContext<Theme>('light');

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}

export function ThemeBadge() {
  const theme = use(ThemeContext);   // = useContext, mas pode ir num if (S4)
  return <span>{theme}</span>;
}
```

## SLIDE 19 · S2 · SearchInput (ref como prop + useId)

### Ficheiro: src/features/flights/SearchInput.tsx  (CRIAR)

```tsx
import { useId, type ComponentProps } from 'react';

type SearchInputProps = ComponentProps<'input'> & {
  label: string;
};

// React 19: `ref` é uma prop como as outras — sem forwardRef
export function SearchInput({ label, ref, ...rest }: SearchInputProps) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...rest} />
    </div>
  );
}
```

## SLIDES 20–21 · S3 · FlightSearch

### Ficheiro: src/features/flights/FlightSearch.tsx  (CRIAR)

```tsx
// O import escolhe QUAL SubmitEvent: sem ele, seria o SubmitEvent global do DOM
// (nativo, não genérico), e não o SyntheticEvent que o React passa ao onSubmit.
// O `type` diz que DESAPARECE no JS final: com verbatimModuleSyntax, sem `type`
// dá erro TS1484 (SubmitEvent não existe em runtime no pacote react).
import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Button } from '../../ui/Button';
import { Panel } from '../../ui/Panel';
import { FlightList } from './FlightList';
import { SearchInput } from './SearchInput';
import type { Flight } from './data/flight';
import { sampleFlights } from './data/sample-flights';

type Filter = { from: string; to: string };

export function FlightSearch() {
  const [filter, setFilter] = useState<Filter>({ from: 'Lisbon', to: 'Porto' });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [basket, setBasket] = useState<Record<number, boolean>>({ 5: true, 7: true });
  // Só o From tem ref: clear() devolve-lhe o focus (fromRef.current?.focus()).
  // O To não precisa, porque nada imperativo é feito sobre ele. Ref = escape hatch
  // para acesso ao DOM (focus, scroll, medir), não "por precaução". E não serve
  // para ler o valor: os inputs são controlled, o valor vive em filter (state).
  const fromRef = useRef<HTMLInputElement>(null);

  // derivados: calculados em cada render, não guardados em state
  const canSearch = filter.from !== '' && filter.to !== '';
  const selectedCount = Object.values(basket).filter(Boolean).length;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilter((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFlights(sampleFlights.filter((f) => f.from === filter.from && f.to === filter.to));
  }

  function clear() {
    setFilter({ from: '', to: '' });
    setFlights([]);
    fromRef.current?.focus();
  }

  function updateBasket(flightId: number, selected: boolean) {
    setBasket((b) => ({ ...b, [flightId]: selected }));
  }

  return (
    <>
      {/* React 19: <title> em qualquer componente sobe para o <head> */}
      {/* || e não ??: após clear() o valor é '' (não null/undefined), e '' também deve mostrar '…' */}
      <title>{`Skyline · ${filter.from || '…'} → ${filter.to || '…'}`}</title>

      <Panel title="Flight Search" actions={<span className="chip">{selectedCount} selected</span>}>
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

        <FlightList flights={flights} basket={basket} onToggle={updateBasket} />
      </Panel>
    </>
  );
}
```

### Opcional · ver o basket no ecrã (≈ `{{ basket | json }}` do Angular)

Ficheiro: `src/features/flights/FlightSearch.tsx` (ACRESCENTAR, a seguir à `FlightList`, dentro do `Panel`)

```tsx
        {/* debug: o mesmo que {{ basket | json }} no Angular */}
        <pre>{JSON.stringify(basket, null, 2)}</pre>
```

> - Remove **não** apaga a chave: fica `"25": false` → é por isso que o `selectedCount` usa `.filter(Boolean)`.
> - As chaves aparecem como strings (`"5"`) — em JS as chaves de objetos são sempre strings, mesmo com `Record<number, boolean>`.

> **ATENÇÃO:** apagar o `<pre>` antes do commit da paragem 2.

## SLIDE 21 · S4 · Ligar a feature ao App

### Ficheiro: src/App.tsx  (SUBSTITUIR — versão final da sessão)

```tsx
import { FlightSearch } from './features/flights/FlightSearch';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        <FlightSearch />
      </main>
    </div>
  );
}
```
