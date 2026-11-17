# Exercício de revisão · Sessão 5

**Tema:** generic custom hooks, derived values e effects com cleanup.
**Ponto de partida:** o Skyline no fim da Sessão 5 (`git checkout sessao-05`), com o `npm start` a correr (json-server + Vite).
**Tempo:** obrigatório ≈ 30 min · extra e bónus à vontade.

---

## Obrigatório

### 1. `useDebouncedValue<T>`

Criem um custom hook em `src/hooks/useDebouncedValue.ts`:

```ts
export function useDebouncedValue<T>(value: T, delayMs: number): T
```

Devolve o `value`, mas **só depois de ele deixar de mudar durante `delayMs`**. Enquanto o value estiver a mudar (alguém a escrever), devolve o anterior.

### 2. Filtrar por avião

No `FlightSearch`, acrescentem um campo **Aircraft** (podem usar o `SearchInput`) que filtra os voos **já carregados** pelo modelo do avião (`flight.aircraft.type`):

- sem distinguir maiúsculas de minúsculas (`a3` encontra `A321neo` e `A319`);
- **sem requests novos ao server**;
- o filter só se aplica **300 ms depois da última tecla** — usem o vosso `useDebouncedValue`.

## Extra

### 3. "a filtrar…"

Enquanto o value escrito ainda não assentou, mostrem um indicador **a filtrar…**.

- **Sem state novo.** Pista: já têm os dois values — o que foi escrito e o que assentou.

## Bónus

### 4. O cesto em duas tabs

Abram o Skyline em **duas tabs**. Selecionem um voo na primeira e voltem à segunda: o cesto não mudou (só muda com um refresh).

Corrijam no `useLocalStorage`, para que **todas** as tabs acompanhem a mesma chave.

- Pista: quando uma tab muda o `localStorage`, as **outras** recebem um event `storage` no `window`.
- Não se esqueçam do cleanup.

---

## Pistas

- Um `setTimeout` dentro de um `useEffect`, e um cleanup que o cancela: cada tecla nova cancela o temporizador anterior.
- O filter por avião é **derived state**: calcula-se no render, a partir dos voos e do value que assentou.
- `'A321neo'.toLowerCase().includes('a3')` → `true`.

## Antes de dar por terminado

```bash
npx oxlint         # 0 avisos (atenção ao set-state-in-effect)
npm run build      # tem de passar sem errors de TypeScript
```
