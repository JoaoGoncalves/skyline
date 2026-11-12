/*
 * S1 · 06 — Ref callbacks com cleanup (bónus — tratado a fundo na Sessão 4)
 * ----------------------------------------------------------------------------
 * Uma "ref callback" é uma FUNÇÃO passada em ref={...}: o React chama-a com o
 * elemento quando ele aparece no DOM.
 *
 * REACT 18: quando o elemento saía, o React chamava a MESMA função com `null`.
 * Toda a limpeza tinha de estar num `if (el === null)` — confuso.
 *
 * REACT 19: a função pode DEVOLVER uma função de cleanup — exatamente como o
 * useEffect. O React chama-a quando o elemento sai.
 *
 * Caso típico: observar o tamanho de um elemento (ResizeObserver) ou ligar uma
 * biblioteca externa (mapa, gráfico) a um <div>.
 */
import { useState } from 'react';

// ---------------------------------------------------------------- REACT 18 --
let observer18: ResizeObserver | null = null;

function Caixa18({ onResize }: { onResize: (w: number) => void }) {
  return (
    <div
      className="box"
      ref={(el) => {
        if (el) {
          observer18 = new ResizeObserver(([e]) => onResize(Math.round(e.contentRect.width)));
          observer18.observe(el);
        } else {
          observer18?.disconnect(); // limpeza: chamada com null
          observer18 = null;
        }
      }}
    >
      18 · redimensiona a janela
    </div>
  );
}

// ---------------------------------------------------------------- REACT 19 --
function Caixa19({ onResize }: { onResize: (w: number) => void }) {
  return (
    <div
      className="box"
      ref={(el) => {
        if (!el) return; // só para o TypeScript: o tipo continua a ser `HTMLDivElement | null`
        const observer = new ResizeObserver(([e]) => onResize(Math.round(e.contentRect.width)));
        observer.observe(el);
        return () => observer.disconnect(); // cleanup, como no useEffect — sem chamada com null
      }}
    >
      19 · redimensiona a janela
    </div>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function RefCleanupDemo() {
  const [w18, setW18] = useState(0);
  const [w19, setW19] = useState(0);
  const [visivel, setVisivel] = useState(true);

  return (
    <div className="demo">
      <div className="col">
        {visivel && <Caixa18 onResize={setW18} />}
        <small>largura: {w18}px</small>
      </div>
      <div className="col">
        {visivel && <Caixa19 onResize={setW19} />}
        <small>largura: {w19}px</small>
      </div>
      <button onClick={() => setVisivel((v) => !v)}>{visivel ? 'Desmontar' : 'Montar'} as caixas</button>
    </div>
  );
}
