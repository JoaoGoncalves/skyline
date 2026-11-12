/**
 * S2 · 01 — Porque é que um componente volta a renderizar?
 * ----------------------------------------------------------------------------
 * 18 → 19: NADA MUDOU aqui. É o modelo mental base — e é por não o dominar que
 * se espalham memo/useMemo/useCallback por todo o lado.
 *
 * Um componente renderiza de novo quando:
 *   1. o SEU state muda (setX)
 *   2. o PAI renderiza  ← mesmo que as props do filho sejam iguais!
 *   3. um Context que ele lê muda
 *
 * O mito: "renderiza quando as props mudam". Não — renderiza porque o pai
 * renderizou. As props só "importam" se o filho estiver embrulhado em memo().
 *
 * Re-render ≠ mexer no DOM: o React volta a correr a função, compara o JSX
 * novo com o anterior (reconciliation) e só toca no DOM onde há diferenças.
 * Re-render é barato... até ao dia em que um filho é pesado.
 *
 * SOLUÇÃO SEM MEMO: "moving state down" — pôr o state no componente mais
 * pequeno que precisa dele. Quem não está por baixo dele deixa de renderizar.
 */
import { useState } from 'react';
import { RenderFlash } from './RenderFlash';

function ListaPesada() {
  // imagina 500 FlightCards aqui
  return <RenderFlash name="ListaPesada (não depende do contador!)" />;
}

// ------------------------------------------------------- ANTES (o problema) --
function PaginaAntes() {
  const [count, setCount] = useState(0); // state no topo da página…

  return (
    <RenderFlash name="PaginaAntes">
      <button onClick={() => setCount((c) => c + 1)}>clicks: {count}</button>
      <ListaPesada /> {/* …logo a lista renderiza a cada click */}
    </RenderFlash>
  );
}

// ------------------------------------------------ DEPOIS (moving state down) --
function Contador() {
  const [count, setCount] = useState(0); // o state desceu para quem precisa dele
  return (
    <RenderFlash name="Contador">
      <button onClick={() => setCount((c) => c + 1)}>clicks: {count}</button>
    </RenderFlash>
  );
}

function PaginaDepois() {
  return (
    <RenderFlash name="PaginaDepois">
      <Contador />
      <ListaPesada /> {/* irmã do Contador, não filha → não renderiza */}
    </RenderFlash>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function PorqueRerender() {
  return (
    <div className="demo">
      <div className="col">
        <h4>Antes: state no topo</h4>
        <PaginaAntes />
      </div>
      <div className="col">
        <h4>Depois: state desce</h4>
        <PaginaDepois />
      </div>
      <small>Clica e repara nas cores: cada mudança de cor = um render. Vê também a consola.</small>
    </div>
  );
}
