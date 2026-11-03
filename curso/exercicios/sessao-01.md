# Exercício de revisão · Sessão 1

**Tema:** ambiente de trabalho, componentes tipados, `ComponentProps` + `...rest`, valores derivados.
**Ponto de partida:** o Skyline no fim da Sessão 1 (`git checkout sessao-01`) — termina no `FlightCard`.
**Tempo:** obrigatório ≈ 20 min (+ o setup) · extra à vontade.
**Correção:** no início da Sessão 2 (qui 5 nov).

---

## 0. Ambiente (obrigatório — é a primeira coisa que verificamos na quinta)

```bash
node -v      # tem de ser 22.12 ou superior (ou 24 LTS) — o Vite 8 não arranca com versões anteriores
git clone https://github.com/JoaoGoncalves/skyline.git
cd skyline
git checkout sessao-01
npm install
npm start    # tem de mostrar DUAS saídas: json-server (:3000) e Vite (:5173)
```

- Abrir http://localhost:3000/flights → JSON com os voos.
- Abrir http://localhost:5173 → a app com a topbar "Skyline".
- Se o projeto que fizeram na aula ficou a meio, **não o corrijam**: usem o clone do repo.
- Porta 3000 ocupada? No `package.json`, script `api`, trocar para `--port 3001`.
- Se alguma coisa falhar, enviem a mensagem de erro (texto, não print) para **edu@joaogoncalves.net** antes de quinta.

## 1. Componente `Badge` em `src/ui/Badge.tsx` (obrigatório)

Um componente genérico, no mesmo padrão do `Button`:

- aceita **tudo** o que um `<span>` aceita (`title`, `aria-*`, `className`…);
- tem uma prop `variant` que só pode ser `'info'` ou `'warn'` (por omissão: `'info'`);
- produz `<span className="badge badge-info">…</span>` (ou `badge-warn`).

No `FlightCard`, trocar o `<span className="badge">` do atraso por `<Badge variant="warn">`, e mostrar `<Badge>on time</Badge>` nos voos sem atraso.

## 2. Ver o `FlightCard` no ecrã (obrigatório)

Ainda não temos a lista (é o início da Sessão 2). Para verem o resultado, ponham **temporariamente** dois cards no `App.tsx`, no lugar do `<p>Hello, Skyline</p>`:

- um voo **com** atraso e outro **sem** atraso, tirados de `sampleFlights`;
- um deles com `selected`;
- `onSelectedChange` pode ser só um `console.log`.

Confirmem que o TypeScript reclama se se esquecerem do `flight` ou do `onSelectedChange` — e que não reclama se se esquecerem do `selected`. Porquê?

## Extra

### 3. `lowestPrice(flight)` em `src/features/flights/data/price.ts`

O `FlightCard` calcula o preço mais baixo lá dentro. Na Sessão 2 vamos precisar dele também na pesquisa: extraiam-no para uma função tipada (`(flight: Flight) => number`) e usem-na no card.

---

## Pistas

- `type BadgeProps = ComponentProps<'span'> & { variant?: … }` — o `&` junta os dois tipos.
- `className` do `...rest` não pode perder-se: juntem-no ao vosso (vejam como o `Button` faz).
- `sampleFlights[1]` é o voo #7 (com atraso); `sampleFlights[0]` é o #5 (a horas).
- Se a função se chamar `lowestPrice`, a variável local do card tem de mudar de nome (por exemplo, `price`).

## CSS (fornecido — acrescentar ao `src/index.css`)

```css
.badge { border-radius: 999px; padding: 0.1rem 0.5rem; font-size: 0.75rem; }
.badge-warn { background: var(--warn); color: #fff; }
.badge-info { background: var(--chip); color: var(--primary); }
```

(A regra `.badge` substitui a que já existe.)

## Antes de dar por terminado

```bash
npx oxlint
npm run build      # tem de passar sem erros de TypeScript
```
