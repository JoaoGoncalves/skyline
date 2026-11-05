# Exercício de revisão · Sessão 2

**Tema:** eventos tipados, reutilizar componentes com `...rest`, valores derivados (sem state nem effects).
**Ponto de partida:** o Skyline no fim da Sessão 2 (`git checkout sessao-02`) .
**Tempo:** obrigatório ≈ 20 min · extra e bónus à vontade.
**Correção:** no início da Sessão 3.

---

## Obrigatório

### 1. Checkbox "Só voos sem atraso" no `FlightSearch`

- uma checkbox com `<label>` associado (`useId` + `htmlFor`);
- quando ligada, a lista mostra só os voos com `delayed === false`;
- **sem state novo para a lista filtrada e sem `useEffect`** — a lista visível é um valor **derivado** de `flights` + filtros;
- o **Clear** desliga a checkbox.

## Extra

### 2. Campo "Preço máx. (€)"

- **reutilizar o `SearchInput`** (nada de `<input>` novo): `type="number"`, `min`, `placeholder`… passam todos pelo `...rest`;
- filtra pelo preço mais baixo de cada voo: criar `lowestPrice(flight)` em `src/features/flights/data/price.ts` (o mesmo cálculo que o `FlightCard` já faz) e usá-la nos dois sítios; vazio = sem limite;
- mostrar por cima da lista: "3 de 5 voos".

## Bónus

### 3. Ordenar por preço

Um `<select>` com "—", "Preço ↑" e "Preço ↓".

---

## Pistas

- **Checkbox:** o valor está em `event.target.checked` (boolean), não em `event.target.value`.
- **Tipos dos handlers** (só quando o handler é uma função à parte):
  `ChangeEvent<HTMLInputElement>` para inputs e checkboxes · `ChangeEvent<HTMLSelectElement>` para o `<select>`.
- **`<select>`:** `event.target.value` é sempre `string` para o TypeScript. Com `type SortOrder = 'none' | 'asc' | 'desc'`, vão precisar de dizer ao TS que o valor é um `SortOrder` — pensem porque é que aqui é seguro.
- **Ordenar sem mutar o state:** `array.toSorted(...)` (ou `[...array].sort(...)`).
- **Keys:** depois de ordenar, a `key={flight.id}` da `FlightList` é o que mantém cada card ligado ao voo certo. Reparem que a seleção não se baralha: vamos ver porquê na Sessão 3.

## CSS (fornecido — acrescentar ao `src/index.css`)

```css
.check { display: flex; gap: 0.4rem; align-items: center; font-size: 0.9rem; padding-bottom: 0.5rem; }
.field select { padding: 0.5rem 0.65rem; border: 1px solid #d5dcc4; border-radius: 6px; font: inherit; background: #fff; }
.results-info { color: var(--muted); font-size: 0.85rem; margin: 0 0 0.75rem; }
```

## Antes de dar por terminado

```bash
npx oxlint
npm run build      # tem de passar sem erros de TypeScript
```
