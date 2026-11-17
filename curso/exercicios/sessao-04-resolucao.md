# Exercício da Sessão 4 — resolução

Ponto de partida: tag `sessao-04` (React Compiler ligado). E1 é a resposta ao obrigatório, E2 ao extra, E3 ao bónus.

---

## E1 · Obrigatório — quem renderiza, e porquê

Medido no Skyline no fim da Sessão 4 (com o React Compiler):

| Interação | Renderizam | Porquê |
|---|---|---|
| **a)** uma letra no From | `SearchForm` e **um** `SearchInput` (o do From) | O `filter` vive no `SearchForm` (Sessão 3). O `SearchInput` do To recebe as mesmas props e o Compiler salta-o. |
| **b)** Select num card | `FlightSearch`, `Panel`, `FlightList` e **só o card clicado** | O `basket` vive no `FlightSearch`. A lista volta a criar os cards, mas o `memo` salta os que têm as props iguais: `flight` (mesmo objeto), `selected` (boolean) e `onToggle` (estável). |
| **c)** Search outra vez | `FlightSearch`, `Panel`, `FlightList` — **nenhum card** | O `filter` cria um array **novo**, mas com os **mesmos objetos** de voo: as props de cada card são iguais, e o `memo` salta-os todos. |

> Sem o Compiler, o mesmo código renderiza muito mais: em **b)** e **c)**, também o `SearchForm`, os dois `SearchInput` e os 5 cards (o `updatebasket` deixa de ser estável).

## E2 · Extra — `'use no memo'` no `FlightSearch`

```tsx
export function FlightSearch() {
    'use no memo';   // o Compiler deixa este componente em paz
    // …
}
```

**O que muda:** Select volta a fazer renderizar **os 5 cards**.

**Porquê:** sem o Compiler no `FlightSearch`, o `updatebasket` volta a ser uma função **nova em cada render**. O `onToggle` de todos os cards muda, e o `memo(FlightCard)` deixa de servir. É o mesmo que tínhamos no passo S2/S3 da aula, antes do `useCallback`.

## E3 · Bónus — uma prop objeto

### A prop no `FlightCard`

```tsx
type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  onToggle: (flightId: number, selected: boolean) => void;
  options?: { showPrice: boolean };
};

function FlightCardBase({ flight, selected = false, onToggle, options }: FlightCardProps) {
  // …
  {(options?.showPrice ?? true) && <p className="price">from {lowestPrice} €</p>}
```

### O problema

```tsx
<FlightCard … options={{ showPrice: true }} />   // ← objeto NOVO, para cada card, em cada render
```

Select volta a renderizar **os 5 cards**, mesmo com o Compiler: o objeto é criado dentro do `map`, que corre de novo quando o `basket` muda. `{ showPrice: true } !== { showPrice: true }`.

### Correção 1 · uma constante fora do componente

```tsx
// FlightList.tsx — criado UMA vez, quando o módulo carrega: é sempre o mesmo objeto
const cardOptions = { showPrice: true };

export function FlightList({ flights, basket, onToggle }: FlightListProps) {
  // …
        <FlightCard … options={cardOptions} />
```

### Correção 2 · uma prop primitiva em vez de um objeto

```tsx
// FlightCard: showPrice?: boolean   (em vez de options)
<FlightCard … showPrice={true} />    // true === true → o memo salta
```

Com qualquer das duas, Select volta a renderizar **só o card clicado**.

> A regra: num componente com `memo`, prefiram props **primitivas**; se tiver de ser um objeto, que seja **estável** (constante fora do componente, ou vindo de state/`useMemo`).
