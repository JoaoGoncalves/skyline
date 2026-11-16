# oxlint — o linter do Skyline

**Sessão 5 · pormenor:** o que é o `oxlint`, que usamos desde a Sessão 1 (`npm run lint` / `npx oxlint`).

## O que é

Um **linter**, como o ESLint: lê o código **sem o executar** e avisa de erros e más práticas. É escrito em Rust e faz parte do projeto Oxc (a mesma família de ferramentas do Vite e do Rolldown). A diferença que se nota é a **velocidade**: analisa o Skyline inteiro em milissegundos.

No Skyline está configurado no `.oxlintrc.json`, com os plugins `react`, `typescript` e `oxc`.

## Porque nos interessa: as regras dos hooks e do React Compiler

O `oxlint` traz as regras do plugin oficial do React para hooks — incluindo as que dizem **quando o React Compiler desiste de um componente**:

| Regra | Avisa quando… | Onde a vimos |
|---|---|---|
| `react/rules-of-hooks` | um hook é chamado dentro de um `if`, de um `map`, depois de um `return`… | Sessão 1 (está como `error` no `.oxlintrc.json`) |
| `react(purity)` | há código impuro no render (`performance.now()`, `Date.now()`, `Math.random()`) | Sessão 4 |
| `react(refs)` | se lê ou escreve `ref.current` durante o render | Sessão 5 |
| `react(set-state-in-effect)` | há um `setState` diretamente dentro de um `useEffect` | Sessão 5 (`useFlights`) |

Nos três últimos, a mensagem acaba com:

```
note: React Compiler skipped optimizing this component or hook.
```

É a forma prática de saber que o Compiler deixou aquele componente como estava.

## E o ESLint?

As mesmas regras existem no ESLint, através do `eslint-plugin-react-hooks`. Para estas regras o resultado é o mesmo. O `oxlint` ganha na velocidade (conta em projetos grandes e no CI); o ESLint ainda tem mais plugins no ecossistema. Há equipas que usam os dois: o `oxlint` primeiro, por ser rápido, e o ESLint para o que falta.

## Comandos

```bash
npx oxlint          # ou: npm run lint
```

`0 warnings and 0 errors` antes de cada commit.

## Referências

- [Oxc — oxlint (oxc.rs)](https://oxc.rs)
- [eslint-plugin-react-hooks — as regras, uma a uma (react.dev)](https://react.dev/reference/eslint-plugin-react-hooks)
- [Exemplo: a regra `refs` (react.dev)](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs)
