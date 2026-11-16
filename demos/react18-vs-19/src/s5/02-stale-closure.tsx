/**
 * S5 · 02 — Closures stale (valores "fora de prazo")
 * ----------------------------------------------------------------------------
 * Cada render é uma fotografia: as funções criadas nesse render veem as
 * variáveis DESSE render. Um setInterval criado no 1.º render (effect com [])
 * vê para sempre count = 0  →  setCount(0 + 1)  →  o contador fica no 1.
 *
 * Correções, por ordem de preferência:
 *   1. forma funcional: setCount(c => c + 1) — não precisa de LER o count
 *   2. pôr count nas dependências — funciona, mas o intervalo é recriado a cada tick
 *   3. useEffectEvent ou uma ref — quando é mesmo preciso ler o valor atual (ver 03)
 */
import { useEffect, useState } from 'react';

// ------------------------------------------------------------------ ✗ stale --
function ContadorStale() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // ✗ count é sempre 0 aqui
    return () => clearInterval(id);
  }, []); // ← criado uma vez, com a "fotografia" do 1.º render

  return <strong>{count}</strong>;
}

// --------------------------------------------------------------- ✓ funcional --
function ContadorFuncional() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000); // ✓ o React dá o valor atual
    return () => clearInterval(id);
  }, []);

  return <strong>{count}</strong>;
}

// -------------------------------------------------------------------- DEMO --
export default function StaleClosure() {
  return (
    <div className="demo">
      <div className="col">
        <h4>✗ setCount(count + 1)</h4>
        <ContadorStale />
      </div>
      <div className="col">
        <h4>✓ setCount(c =&gt; c + 1)</h4>
        <ContadorFuncional />
      </div>
      <small>Espera uns segundos: a esquerda fica no 1, a direita continua a subir.</small>
    </div>
  );
}
