# React 18 → 19 · exemplos para a S1 e a S2

Mini projeto de revisão. Cada ficheiro tem a versão **React 18** e a versão **React 19** lado a lado, com comentários a explicar o que mudou e porquê.

```bash
npm install
npm run dev        # http://localhost:5173 — menu à esquerda, um exemplo por página
```

Ler pela ordem do menu: primeiro o comentário do topo de cada ficheiro, depois o código, depois experimentar no browser.

## Sessão 1 · ter 3 nov — o que mudou mesmo do 18 para o 19

| # | Ficheiro | React 18 | React 19 | Onde aparece no Skyline |
|---|---|---|---|---|
| 01 | `s1/01-ref-como-prop.tsx` | `forwardRef<Ref, Props>((props, ref) => …)` | `function X({ ref, ...rest })` — a `ref` é uma prop normal | `SearchInput` (slides 26–28) |
| 02 | `s1/02-context.tsx` | `<Ctx.Provider value>` + `useContext` | `<Ctx value>` + `use(Ctx)` (pode ir dentro de `if`) | X1 (só mostrar); a sério na S10 |
| 03 | `s1/03-metadata.tsx` | `useEffect` + `document.title` | `<title>` / `<meta>` em qualquer componente | `<title>` do `FlightSearch` |
| 04 | `s1/04-defaults-e-tipos.tsx` | `defaultProps` + `propTypes` | **removidos** → default na desestruturação + TypeScript | `Button` (slide 17) |
| 05 | `s1/05-tipos-react19.tsx` | `useRef()`, `JSX.Element`, `FormEvent` | `useRef(null)`, `React.JSX.Element`, `SubmitEvent` | `FlightSearch` |
| 06 | `s1/06-ref-cleanup.tsx` | ref callback chamada com `null` ao sair | ref callback **devolve um cleanup** | bónus (S4) |

**A frase para a sala:** o React 19 *tirou* coisas (forwardRef, Provider, defaultProps, propTypes, effects para o título) — o código fica mais curto e mais "JavaScript normal". O TypeScript passa a fazer o trabalho que os propTypes faziam.

## Sessão 2 · qui 5 nov — rendering e composição

Aqui **nada mudou** do 18 para o 19 — é o modelo mental que falta a quem vem do 18 a pôr `memo` em todo o lado. O único "19" é a antevisão do Compiler (Sessão 4).

| # | Ficheiro | Ideia |
|---|---|---|
| 01 | `s2/01-porque-rerender.tsx` | Renderiza quando: o seu state muda, **o pai renderiza**, ou um Context muda. Não "quando as props mudam". Solução 1: **mover o state para baixo**. |
| 02 | `s2/02-children-como-props.tsx` | Solução 2: o conteúdo pesado entra como `children`/slot — foi criado pelo pai, não renderiza. |
| 03 | `s2/03-keys.tsx` | `key={index}` mistura state quando a lista muda de ordem; `key` diferente = **reset** do componente (sem effects). |
| 04 | `s2/04-memo-e-compiler.tsx` | React 18: `memo` + `useCallback` à mão. React 19 + Compiler: o mesmo efeito sem escrever nada (S4). |

Nos exemplos da S2 cada componente **muda de cor quando renderiza** (e escreve na consola). Em dev o `StrictMode` renderiza duas vezes — é normal.

## Notas

- Stack igual ao Skyline: React 19.3 · TypeScript 6 · Vite 8.
- Sem React Compiler ligado (para os re-renders serem visíveis). A demo com/sem Compiler é `demos/compiler-demo`.
- Os erros de TypeScript descritos no exemplo 05 foram verificados com o compilador.
