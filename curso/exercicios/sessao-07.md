# Exercício de revisão · Sessão 7

**Tema:** deferred data com Suspense, errors localizados e code splitting.
**Ponto de partida:** o Skyline no fim da Sessão 7 (`git checkout sessao-07`), com o `npm start` a correr (json-server + Vite).
**Tempo:** obrigatório ≈ 30 min · extra e bónus à vontade.

---

## Obrigatório

### 1. Return flights no detalhe

No detalhe de um voo, a seguir a "Other flights on this route", acrescentem uma secção **Return flights**: os voos no sentido contrário (`to` → `from`). No voo #5 (Lisbon ➜ Porto), são os voos Porto ➜ Lisbon.

- Uma function `fetchReturnFlights(flight, signal)` no `flights-api.ts`, que espera **2.5 s** antes do fetch (como o `fetchRelatedFlights`, com 1.5 s).
- O `flightLoader` devolve uma segunda promise, `returns`, **sem await**.
- No `FlightDetail`, o seu `<Suspense>`, com o `RelatedSkeleton` como fallback.
- O detalhe tem de continuar a aparecer **logo**: primeiro dois grupos de skeletons, depois os outros voos (≈ 1.5 s), depois os return flights (≈ 2.5 s).
- Navegar entre voos (#5 → #7) tem de mostrar os skeletons logo, como no D3.

Pista: a lista de links do `RelatedFlights` serve para os dois casos. Extraiam-na para um component que recebe `flights: Flight[]`.

## Extra

### 2. Um error que não leva a página com ele

Ponham um `throw new Error('Return flights are down')` temporário no `fetchReturnFlights`. Hoje, o detalhe inteiro dá lugar a "Something went wrong".

Façam com que **só a secção Return flights** mostre "Could not load return flights." — o voo e os outros voos continuam.

- Pista: o `<Await>` do `react-router` recebe `resolve` (a promise), `errorElement` e, como children, uma function que recebe o value.
- Tirem o `throw` no fim.

## Bónus

### 3. Prefetch do seat map

Quando o rato passa por cima do botão **Seats**, o chunk do `SeatMap` começa logo a descarregar. Quando o utilizador carrega, já lá está: sem "Loading seat map...".

- Pista: o browser não pede o mesmo module duas vezes. Um `import('./SeatMap')` no hover é o mesmo que o `lazy` vai fazer depois.
- Confirmem no Network (Slow 4G): o pedido aparece no hover, não no click.

---

## Antes de dar por terminado

```bash
npx oxlint         # 0 avisos
npm run build      # tem de passar sem errors de TypeScript
```

E na consola do browser: nenhum aviso do React (atenção aos `key`).
