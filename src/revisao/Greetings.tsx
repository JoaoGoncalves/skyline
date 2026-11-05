import type { ReactNode } from "react";

/*
 * Revisão · 1 — Componente "normal" tipado (só props nossas)
 * ---------------------------------------------------------------------------
 * React 16/18 em JavaScript:
 *   function Greeting({ name, excited, children }) { … }
 *   Greeting.propTypes = { name: PropTypes.string.isRequired, excited: PropTypes.bool };
 *   Greeting.defaultProps = { excited: false };
 *   → validação só em runtime (avisos na consola). No React 19 os dois são IGNORADOS.
 *
 * React 18 + TypeScript (muito comum em tutoriais):
 *   const Greeting: React.FC<GreetingProps> = ({ name, children }) => …
 *   → até ao @types/react 18, o FC dava `children` "de graça", mesmo sem as pedir.
 *
 * React 19 + TypeScript: um `type` para as props + uma função normal.
 *   - obrigatória vs opcional (`?`)
 *   - default na desestruturação (JavaScript normal)
 *   - children declarado explicitamente, como `ReactNode`
 *   - callback para comunicar para cima
 */
type GreetingsProps = {
  name: string; // obrigatoria
  excited?: boolean // optional
  onGreet?: (name: string) => void //callback comunicar para Pai
  children?: ReactNode
};

export function Greetings({ name, excited = false, onGreet, children }: GreetingsProps) {
  return (
    <div className="Card">
      <p>
        Hello {name}
        {excited ? "!" : "."}
      </p>
      {children}
      {onGreet && <button onClick={()=>onGreet(name)}>Greet</button>}
    </div>
  );
}


