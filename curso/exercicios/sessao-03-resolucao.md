# Exercício da Sessão 3 — resolução

Ponto de partida: tag `sessao-03`. Os passos E1 → E7 dizem **onde** entra cada alteração.

---

## E1 · `src/ui/Panel.tsx` — novo slot no tipo

Acrescentar ao `PanelProps` (ao lado do `actions`):

```tsx
footer?: ReactNode;
```

E na desestruturação:

```tsx
export function Panel({ title, actions, footer, children }: PanelProps) {
```

> Um slot é só uma prop `ReactNode` — exatamente como o `actions` que já lá estava.

## E2 · `Panel.tsx` — onde o footer aparece (depois do `panel-body`)

```tsx
<div className="panel-body">{children}</div>
{footer && <footer className="panel-footer">{footer}</footer>}
```

> O `Panel` decide **onde**; quem o usa decide **o quê**.

## E3 · `FlightSearch.tsx` — usar o slot

No `<Panel …>`, acrescentar a prop `footer`:

```tsx
<Panel
  title="Flight Search"
  actions={<span className="chip">{selectedCount} selected</span>}
  footer={flights.length > 0 && `${flights.length} voos encontrados`}
>
```

> **`flights.length > 0 && …`**, e não `flights.length && …`: com 0 voos, a segunda forma mostrava um `0` no ecrã (o React renderiza números, mas não `false`).

---

## E4 · `src/features/flights/FlightList.tsx` — slot `empty` no tipo

Import:

```tsx
import type { ReactNode } from "react";
```

No `FlightListProps`:

```tsx
empty?: ReactNode;
```

E na desestruturação, com o **default**:

```tsx
export function FlightList({ flights, basket, onToggle, empty = <p className="empty">No Flights found</p> }: FlightListProps) {
```

> Default na desestruturação — o mesmo padrão do `type = 'button'` do `Button`.

## E5 · `FlightList.tsx` — devolver o slot

```tsx
if(flights.length === 0){
    return empty;
}
```

## E6 · `FlightSearch.tsx` — passar uma mensagem própria

Na `<FlightList …>`, acrescentar:

```tsx
empty={<p className="empty">Escolham origem e destino e carreguem em Search.</p>}
```

> Sem `if` novo no `FlightSearch`: a lista continua a decidir *quando* mostra a mensagem.

---

## E7 · `src/index.css` (acrescentar no fim)

```css
.panel-footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--chip); color: var(--muted); font-size: 0.9rem; }
```

---

## Bónus · Quem pisca? (sem código)

React DevTools → ⚙ → *Highlight updates when components render*:

1. **Escrever no From** → pisca só o `SearchForm` (e os `SearchInput`): o `filter` desceu para lá, o `FlightSearch` não renderiza.
2. **Select num card** → pisca o `FlightSearch`, a `FlightList` e **todos** os cards: o `basket` vive no `FlightSearch`, e quando o pai renderiza os filhos também renderizam.

## Testar

Lisbon → Porto → Search: footer "5 voos encontrados" · Clear: o footer desaparece e aparece a mensagem do `empty` · `npx oxlint` e `npm run build` sem erros.
