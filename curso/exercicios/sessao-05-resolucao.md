# Exercício da Sessão 5 — resolução

Ponto de partida: tag `sessao-05`. E1 é a resposta ao obrigatório, E2 ao extra, E3 ao bónus.

---

## E1 · Obrigatório — `useDebouncedValue<T>` e o filter por avião

### O hook

```ts
// src/hooks/useDebouncedValue.ts
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id); // nova tecla antes do tempo → cancela e recomeça
  }, [value, delayMs]);

  return debounced;
}
```

- Cada tecla muda o `value` → o effect anterior é limpo (`clearTimeout`) e começa um temporizador novo.
- Só quando o `value` fica parado `delayMs` é que o `setDebounced` corre.
- O `setDebounced` está dentro do `setTimeout`, não diretamente no effect: o oxlint não avisa `set-state-in-effect`.
- `<T>`: serve para texto, números, objects — o type vem de quem chama.

### No `FlightSearch`

```tsx
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { SearchInput } from "./SearchInput";

// …dentro do component
const [aircraft, setAircraft] = useState("");
const debouncedAircraft = useDebouncedValue(aircraft, 300);

// derived state: calcula-se no render, sem requests novos
const term = debouncedAircraft.trim().toLowerCase();
const visibleFlights = flights.filter((f) => f.aircraft.type.toLowerCase().includes(term));
```

```tsx
<SearchInput
  label="Aircraft"
  name="aircraft"
  placeholder="ex.: A320"
  value={aircraft}
  onChange={(e) => setAircraft(e.target.value)}
/>
…
<FlightList flights={visibleFlights} basket={basket} onToggle={updateBasket} />
```

Lisbon → Porto, escrever `A3`: enquanto se escreve continuam **5** cards; 300 ms depois ficam **2** (`A321neo` e `A319`).

> O campo de texto usa o `aircraft` (atualiza a cada tecla, para o input responder logo); o filter usa o `debouncedAircraft`.

## E2 · Extra — "a filtrar…", sem state novo

```tsx
const filtering = aircraft !== debouncedAircraft;   // derived state: o value ainda não assentou

{filtering && <span className="chip">a filtrar…</span>}
```

Já tínhamos os dois values: o que foi escrito e o que assentou. Se forem diferentes, ainda estamos à espera. Um `useState(false)` + `setFiltering(true)` dava o mesmo resultado com mais código — e com o risco de ficar dessincronizado.

## E3 · Bónus — o cesto em duas tabs

```ts
// src/hooks/useLocalStorage.ts — antes do return
useEffect(() => {
  function onStorage(event: StorageEvent) {
    if (event.key === key && event.newValue !== null) {
      setValue(JSON.parse(event.newValue) as T);
    }
  }
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, [key]);
```

- O event `storage` só chega às **outras** tabs (não à que fez a alteração).
- Não há ciclo infinito: a tab que recebe faz `setValue` → o outro effect volta a gravar o **mesmo** value → o browser não dispara um event novo para um value igual.
- Cleanup: sem o `removeEventListener`, cada mount do component deixava um listener para trás.

> **Alternativa:** `useSyncExternalStore` — o hook do React para subscrever algo de fora do React (é o que bibliotecas como o Zustand usam por dentro). Vemos na Sessão 10.
