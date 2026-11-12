/*
 * S1 · 02 — Context: `<Context value>` e `use(Context)`
 * ----------------------------------------------------------------------------
 * REACT 18:
 *   - fornecer:  <ThemeContext.Provider value="dark">
 *   - ler:       useContext(ThemeContext)  — é um Hook: só no topo do componente,
 *                nunca dentro de if/for (regras dos Hooks).
 *
 * REACT 19:
 *   - fornecer:  <ThemeContext value="dark">   (o `.Provider` ainda funciona,
 *                mas deixa de ser preciso — e vai ser deprecated)
 *   - ler:       use(ThemeContext)  — faz o mesmo que useContext, MAS pode ser
 *                chamado dentro de um `if` ou depois de um `return` antecipado.
 *                (O `use` também lê Promises — isso é na Sessão 4.)
 *
 * No curso: o Context "a sério" é na Sessão 10. Hoje é só mostrar a sintaxe.
 */
import { createContext, use, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light'); // 'light' = valor por omissão (sem provider)

// ---------------------------------------------------------------- REACT 18 --
function Badge18() {
  const theme = useContext(ThemeContext); // sempre no topo
  return <span className={`badge ${theme}`}>18 · {theme}</span>;
}

// ---------------------------------------------------------------- REACT 19 --
function Badge19({ show }: { show: boolean }) {
  if (!show) return null; // return antecipado ANTES de ler o context…

  const theme = use(ThemeContext); // …e mesmo assim pode-se ler aqui. Com useContext: erro de lint.
  return <span className={`badge ${theme}`}>19 · {theme}</span>;
}

// -------------------------------------------------------------------- DEMO --
export default function ContextDemo() {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <div className="demo">
      <div className="col">
        <h4>React 18 · .Provider + useContext</h4>
        <ThemeContext.Provider value={theme}>
          <Badge18 />
        </ThemeContext.Provider>
      </div>
      <div className="col">
        <h4>React 19 · &lt;Context value&gt; + use()</h4>
        <ThemeContext value={theme}>
          <Badge19 show />
        </ThemeContext>
      </div>
      <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>Trocar tema</button>
    </div>
  );
}
