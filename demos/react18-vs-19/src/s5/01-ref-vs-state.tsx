/**
 * S5 · 01 — useRef vs useState: guardar um valor SEM renderizar
 * ----------------------------------------------------------------------------
 * useState → mudar o valor faz o componente renderizar de novo (o ecrã acompanha).
 * useRef   → mudar ref.current NÃO renderiza; o valor sobrevive entre renders.
 *
 * Regra prática:
 *   - aparece no ecrã?                        → state
 *   - só o código precisa dele (o id de um timer, o valor anterior,
 *     uma instância de uma biblioteca, um elemento do DOM)  → ref
 *
 * Não ler nem escrever ref.current DURANTE o render (só em handlers e effects):
 * o ecrã não ia acompanhar, e o React Compiler deixa de otimizar o componente.
 */
import { useEffect, useRef, useState } from 'react';
import { RenderFlash } from '../s2/RenderFlash';

// ------------------------------------- 0. ✗ ler a ref no render (slides 6–7) --
function RefNoRender() {
  const clicks = useRef(0);
  const [, setTick] = useState(0); // só para forçar um render

  return (
    <RenderFlash name="RefNoRender">
      <button onClick={() => { clicks.current += 1; }}>
        clicks: {clicks.current} {/* ✗ ler a ref no render: o ecrã não acompanha */}
      </button>
      <button onClick={() => setTick((t) => t + 1)}>forçar um render</button>
    </RenderFlash>
  );
}

// --------------------------------------------------- 1. o mesmo click, 2 sítios --
function StateVsRef() {
  const [count, setCount] = useState(0);
  const clicks = useRef(0); // não aparece no ecrã: só o código o lê
  const [lido, setLido] = useState<number | null>(null);

  return (
    <RenderFlash name="StateVsRef">
      <button onClick={() => setCount((c) => c + 1)}>state + 1 → {count}</button>
      <button
        onClick={() => {
          clicks.current += 1; // muda, mas não renderiza (a cor não muda)
          console.log('ref.current =', clicks.current);
        }}
      >
        ref + 1 (não renderiza)
      </button>
      <button onClick={() => setLido(clicks.current)}>ler a ref</button>
      <span>Última leitura da ref: {lido ?? '—'}</span>
    </RenderFlash>
  );
}

// ------------------------------------------------ 2. o id de um timer numa ref --
function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const intervalo = useRef<number | null>(null); // o id não aparece no ecrã → ref

  function start() {
    if (intervalo.current !== null) return; // já está a contar
    intervalo.current = window.setInterval(() => setSegundos((s) => s + 1), 1000);
  }

  function stop() {
    if (intervalo.current !== null) window.clearInterval(intervalo.current);
    intervalo.current = null;
  }

  // ao desmontar, parar o intervalo
  useEffect(
    () => () => {
      if (intervalo.current !== null) window.clearInterval(intervalo.current);
    },
    [],
  );

  return (
    <RenderFlash name="Cronometro">
      <strong>{segundos} s</strong>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </RenderFlash>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function RefVsState() {
  return (
    <div className="demo">
      <div className="col">
        <h4>✗ ler a ref no render</h4>
        <RefNoRender />
      </div>
      <div className="col">
        <h4>state vs ref</h4>
        <StateVsRef />
      </div>
      <div className="col">
        <h4>id do timer numa ref</h4>
        <Cronometro />
      </div>
      <small>
        À esquerda: clicar 3 vezes → continua "clicks: 0". "forçar um render" → salta para 3 (o valor estava lá).
        No meio: "ref + 1" várias vezes: a cor não muda (não houve render), mas a consola mostra o valor a subir.
        "ler a ref" passa o valor para state — aí sim, aparece.
      </small>
    </div>
  );
}
