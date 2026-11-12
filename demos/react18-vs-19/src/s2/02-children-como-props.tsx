/**
 * S2 · 02 — Composição: `children` (e "slots") para evitar re-renders
 * ----------------------------------------------------------------------------
 * 18 → 19: NADA MUDOU. Mas é a técnica que o curso usa ANTES de recorrer a memoization.
 *
 * Às vezes o state não pode descer: o componente com state ENVOLVE o resto
 * (ex.: um painel que se pode recolher, um layout que segue o scroll).
 *
 * Truque: o componente com state recebe o conteúdo pesado como `children`.
 * Esse JSX foi criado pelo PAI (que não mudou) → é o mesmo objeto de antes →
 * o React sabe que não precisa de o renderizar outra vez.
 *
 * É o mesmo mecanismo do `actions` do Panel do Skyline (um "slot" = prop ReactNode),
 * e do AppShell com slots que vamos fazer na S2.
 */
import { useState, type ReactNode } from 'react';
import { RenderFlash } from './RenderFlash';

function ListaPesada() {
  return <RenderFlash name="ListaPesada" />;
}

// ------------------------------------------------------- ANTES (o problema) --
function PainelAntes() {
  const [aberto, setAberto] = useState(true);
  return (
    <RenderFlash name="PainelAntes">
      <button onClick={() => setAberto((a) => !a)}>{aberto ? 'Recolher' : 'Expandir'}</button>
      <div style={{ opacity: aberto ? 1 : 0.3 }}>
        <ListaPesada /> {/* criada AQUI dentro → renderiza com o painel */}
      </div>
    </RenderFlash>
  );
}

// ------------------------------------------------- DEPOIS (children / slot) --
function PainelDepois({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(true);
  return (
    <RenderFlash name="PainelDepois">
      <button onClick={() => setAberto((a) => !a)}>{aberto ? 'Recolher' : 'Expandir'}</button>
      <div style={{ opacity: aberto ? 1 : 0.3 }}>{children}</div>
    </RenderFlash>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function ChildrenComoProps() {
  return (
    <div className="demo">
      <div className="col">
        <h4>Antes</h4>
        <PainelAntes />
      </div>
      <div className="col">
        <h4>Depois: lista passada como children</h4>
        <PainelDepois>
          <ListaPesada /> {/* criada pelo pai → não renderiza quando o painel muda */}
        </PainelDepois>
      </div>
    </div>
  );
}
