# compiler-demo — React Compiler, sem escrever código

Uma lista de tarefas **sem** `memo`, `useMemo` nem `useCallback`.
O mesmo código corre com e sem React Compiler, para comparares.

## Arrancar

```bash
npm install
npm run dev                # COM React Compiler  (o terminal mostra "React Compiler: LIGADO ✨")
npm run dev:sem-compiler   # SEM React Compiler  (só um de cada vez — usam a mesma porta)
```

Abre o browser e a consola (DevTools → Console). Os logs estão no corpo dos componentes,
por isso cada `Rendering <X />` é um render real. Não há `<StrictMode>`, para os logs não duplicarem.

## Experiência 1 — escrever no campo

Limpa a consola e escreve **Go** (2 letras).

| | SEM Compiler | COM Compiler |
|---|---|---|
| `Rendering <App />` | 2 | 2 |
| `Rendering <List />` | 2 | **0** |
| `Rendering <Task />` | 6 | **0** |
| `Filtering...` | 6 | **0** |

O `App` renderiza sempre (o state `task` mudou). Sem Compiler, o `List` e os `Task` vão atrás
e a filtragem repete-se. Com Compiler, o resultado é o mesmo de uma versão otimizada à mão com `memo` + `useMemo` + `useCallback`.

## Experiência 2 — Search e Delete

- **Search** (com "Go" no campo): filtra para 1 tarefa e corre `Filtering...` 3 vezes nos dois modos — o `term` mudou, por isso o Compiler recalcula. Igual a `useMemo(…, [term, todoList])`.
- **X (apagar)**: nos dois modos renderizam o `List` e os `Task` que ficam — a lista mudou.

## Experiência 3 — ver o que o Compiler fez

1. **React DevTools → Components**: com o Compiler, os componentes aparecem com o selo **Memo ✨**.
2. **`'use no memo'`**: em `src/Task.tsx`, descomenta a linha `'use no memo'` (modo COM Compiler) e repete a Experiência 1.
   O selo desaparece do `Task` (fica fora do Compiler). O `List` continua otimizado — por isso os `Task` também não renderizam: quem decide é o pai.
3. **O código gerado**: DevTools → Sources → `src/App.tsx`. Vês o `_c(…)` (a cache do Compiler) e os `if ($[0] !== …)` que substituem as dependências escritas à mão.

## Configuração (Vite 8 + @vitejs/plugin-react 6)

```ts
// vite.config.ts
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})
```

```bash
npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler
```

**Atenção:** muitos exemplos online usam a forma antiga, `react({ babel: { plugins: ['babel-plugin-react-compiler'] } })`,
que já não existe no `@vitejs/plugin-react` 6. Há também uma opção nativa em Rust (`react({ compiler: true })`),
mas ainda é experimental — no curso usamos a de Babel.
