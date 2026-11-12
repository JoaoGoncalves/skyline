# Exercício de revisão · Sessão 4

**Tema:** medir com o Profiler, `memo` e props estáveis, o que o React Compiler faz (e não faz).
**Ponto de partida:** o Skyline no fim da Sessão 4 (`git checkout sessao-04`), com o React Compiler ligado.
**Tempo:** obrigatório ≈ 20 min · extra e bónus à vontade.

---

## Obrigatório (sem escrever código)

### 1. Quem renderiza — e porquê?

No React DevTools, separador **Profiler**:

1. Na ⚙️ do Profiler, liguem **Record why each component rendered while profiling**.
2. Façam Search (Lisbon → Porto) para aparecerem os cards.
3. Gravem **três** interações, uma de cada vez (● Record → interação → ■ Stop):
   - **a)** escrever **uma** letra no campo From;
   - **b)** clicar em **Select** num card;
   - **c)** clicar outra vez em **Search**, sem mudar nada.

Para cada uma, registem **que componentes renderizaram** e expliquem **numa frase** porquê.

## Extra

### 2. `'use no memo'`

Ponham `'use no memo';` na **primeira linha** do corpo do `FlightSearch` e repitam a interação **b)**.

- O que muda?
- Porquê? (Pista: o que é que o Compiler deixou de fazer no `FlightSearch`, e que prop do `FlightCard` depende disso?)

Retirem o `'use no memo'` no fim.

## Bónus

### 3. Uma prop objeto

O `FlightCard` passa a aceitar uma prop `options?: { showPrice: boolean }`: quando `showPrice` é `false`, o preço não aparece.

Na `FlightList`, passem-na **escrita ali mesmo**, no `map`:

```tsx
options={{ showPrice: true }}
```

- Gravem outra vez a interação **b)**. O que acontece ao `memo` — **mesmo com o Compiler**?
- Corrijam de **duas formas diferentes**, sem tirar o `memo`.

---

## Pistas

- Profiler: **cinzento** = não renderizou. Clicar num componente mostra *Why did this render?*.
- Lembrem-se da regra do `memo`: **todas** as props têm de ser iguais à anterior — e objetos comparam-se por **referência**.
- O Compiler não salta itens de um `map` quando a lista tem de ser recalculada.

## Antes de dar por terminado

```bash
npx oxlint
npm run build      # tem de passar sem erros de TypeScript
```
