# Exercício de revisão · Sessão 6

**Tema:** rotas com loader, dados de fora do React (`localStorage`) e derived state.
**Ponto de partida:** o Skyline no fim da Sessão 6 (`git checkout sessao-06`), com o `npm start` a correr (json-server + Vite).
**Tempo:** obrigatório ≈ 30 min · extra e bónus à vontade.

---

## Obrigatório

### 1. Uma rota `/basket`

Criem uma página **Basket** com os voos que estão no cesto:

- rota `/basket`, com um `NavLink` "Basket" no topo, ao lado de "Flights";
- um **loader**, `basketLoader`, que lê o cesto do `localStorage` (chave `skyline.basket`) e vai buscar **só esses voos** ao json-server;
- a página mostra os voos com a `FlightList` que já temos.

O json-server aceita vários ids no mesmo request:

```
GET http://localhost:3000/flights?id=5&id=7
```

- Passem o `request.signal` ao `fetch`, como nos outros loaders.
- **Atenção ao cesto vazio:** `GET /flights` sem nenhum `id` devolve **todos** os voos.

## Extra

### 2. Remove e total

- Na página Basket, um **Remove** tira o voo da lista **logo** — sem voltar a correr o loader.
- No topo do painel, um total: `2 · from 259 €` (a soma do preço mais baixo de cada voo).
- **Sem state novo.** Pista: já têm os voos (do loader) e o cesto (do `useLocalStorage`).

## Bónus

### 3. `?from=lisbon`

Experimentem `http://localhost:5173/flights?from=lisbon&to=porto`. Não aparece nenhum voo: o json-server compara maiúsculas.

No `flightsLoader`, normalizem os valores (`lisbon` → `Lisbon`, sem espaços) e, se o URL veio diferente, façam um **redirect** para o URL certo: `/flights?from=Lisbon&to=Porto`.

- Pista: `redirect` vem de `react-router`; um loader pode fazer `throw redirect(…)`.
- Cuidado com o ciclo infinito: só redirecionar se o URL **for** diferente.

---

## Pistas

- `URLSearchParams` aceita uma lista de pares: `new URLSearchParams([['id', '5'], ['id', '7']])` → `id=5&id=7`.
- O `localStorage` guarda strings: `JSON.parse` do value, e as chaves do object são strings (`"5"`, não `5`).
- Um loader corre fora do React: pode ler o `localStorage` diretamente, sem hooks.

## Antes de dar por terminado

```bash
npx oxlint         # 0 avisos
npm run build      # tem de passar sem errors de TypeScript
```
