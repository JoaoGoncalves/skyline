# Exercício de revisão · Sessão 3

**Tema:** composição com slots (props `ReactNode`) e o modelo mental de re-renders.
**Ponto de partida:** o Skyline no fim da Sessão 3 (`git checkout sessao-03`).
**Tempo:** obrigatório ≈ 20 min · extra e bónus à vontade.
**Correção:** no início da Sessão 4.

---

## Obrigatório

### 1. Um slot `footer` no `Panel`

- o `Panel` ganha uma prop opcional `footer?: ReactNode`;
- quando existe, aparece por baixo do conteúdo, dentro de um `<footer className="panel-footer">`;
- no `FlightSearch`, usem-no para mostrar **"5 voos encontrados"** (o número verdadeiro);
- só aparece quando há voos — depois do Clear, desaparece.

## Extra

### 2. Um slot `empty` na `FlightList`

- hoje a `FlightList` decide sozinha a mensagem quando não há voos ("No Flights found");
- passem a aceitar uma prop `empty?: ReactNode`, com essa mensagem como **default**;
- no `FlightSearch`, passem uma mensagem vossa: `empty={<p className="empty">…</p>}`;
- **sem `if` novo no `FlightSearch`**: quem decide *onde* aparece continua a ser a lista; quem usa decide *o quê*.

## Bónus

### 3. Quem pisca?

Com o React DevTools → ⚙ → *Highlight updates when components render*:

1. escrevam no From — o que pisca?
2. cliquem em Select num card — o que pisca?

Expliquem numa frase cada resultado. A segunda é o ponto de partida da Sessão 4.

---

## Pistas

- Um slot é só uma prop do tipo `ReactNode` — vejam o `actions` do `Panel` e o `AppShell`.
- Default de uma prop: na desestruturação (`empty = <p>…</p>`), como o `type = 'button'` do `Button`.
- Cuidado com `{count && …}`: se `count` for `0`, o React mostra um `0`. Usem uma comparação (`count > 0 && …`).

## CSS (fornecido — acrescentar ao `src/index.css`)

```css
.panel-footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--chip); color: var(--muted); font-size: 0.9rem; }
```

## Antes de dar por terminado

```bash
npx oxlint
npm run build      # tem de passar sem erros de TypeScript
```
