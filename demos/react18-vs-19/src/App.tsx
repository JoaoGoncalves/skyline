/**
 * Navegação simples entre os exemplos (sem router — o React Router é na Sessão 5).
 * Cada exemplo está num ficheiro próprio, com a versão React 18 e a versão
 * React 19 lado a lado e os comentários a explicar a diferença.
 */
import { useState, type ComponentType } from 'react';
import RefComoProp from './s1/01-ref-como-prop';
import ContextDemo from './s1/02-context';
import MetadataDemo from './s1/03-metadata';
import DefaultsDemo from './s1/04-defaults-e-tipos';
import TiposDemo from './s1/05-tipos-react19';
import RefCleanupDemo from './s1/06-ref-cleanup';
import PorqueRerender from './s2/01-porque-rerender';
import ChildrenComoProps from './s2/02-children-como-props';
import KeysDemo from './s2/03-keys';
import MemoECompiler from './s2/04-memo-e-compiler';

type Exemplo = { id: string; titulo: string; ficheiro: string; Comp: ComponentType };

const exemplos: { sessao: string; itens: Exemplo[] }[] = [
  {
    sessao: 'Sessão 1 · ter 3 nov — Fundamentos React 19 + TS',
    itens: [
      { id: 's1-01', titulo: 'ref como prop', ficheiro: 's1/01-ref-como-prop.tsx', Comp: RefComoProp },
      { id: 's1-02', titulo: '<Context value> e use()', ficheiro: 's1/02-context.tsx', Comp: ContextDemo },
      { id: 's1-03', titulo: '<title> no componente', ficheiro: 's1/03-metadata.tsx', Comp: MetadataDemo },
      { id: 's1-04', titulo: 'adeus defaultProps/propTypes', ficheiro: 's1/04-defaults-e-tipos.tsx', Comp: DefaultsDemo },
      { id: 's1-05', titulo: 'tipos do @types/react 19', ficheiro: 's1/05-tipos-react19.tsx', Comp: TiposDemo },
      { id: 's1-06', titulo: 'ref callback com cleanup', ficheiro: 's1/06-ref-cleanup.tsx', Comp: RefCleanupDemo },
    ],
  },
  {
    sessao: 'Sessão 2 · qui 5 nov — Rendering e composição',
    itens: [
      { id: 's2-01', titulo: 'porque re-renderiza', ficheiro: 's2/01-porque-rerender.tsx', Comp: PorqueRerender },
      { id: 's2-02', titulo: 'children como props', ficheiro: 's2/02-children-como-props.tsx', Comp: ChildrenComoProps },
      { id: 's2-03', titulo: 'keys', ficheiro: 's2/03-keys.tsx', Comp: KeysDemo },
      { id: 's2-04', titulo: 'memo → Compiler (antevisão S4)', ficheiro: 's2/04-memo-e-compiler.tsx', Comp: MemoECompiler },
    ],
  },
];

const todos = exemplos.flatMap((g) => g.itens);

export default function App() {
  const [atual, setAtual] = useState(todos[0].id);
  const ex = todos.find((e) => e.id === atual) ?? todos[0];

  return (
    <div className="layout">
      <nav>
        <h1>React 18 → 19</h1>
        {exemplos.map((g) => (
          <section key={g.sessao}>
            <h2>{g.sessao}</h2>
            {g.itens.map((e) => (
              <button key={e.id} className={e.id === atual ? 'on' : ''} onClick={() => setAtual(e.id)}>
                {e.titulo}
              </button>
            ))}
          </section>
        ))}
      </nav>
      <main>
        <h3>{ex.titulo}</h3>
        <p className="file">
          Lê o código e os comentários em <code>src/{ex.ficheiro}</code>
        </p>
        {/* key={ex.id}: ao trocar de exemplo, o anterior desmonta (e limpa o state) — ver s2/03-keys */}
        <ex.Comp key={ex.id} />
      </main>
    </div>
  );
}
