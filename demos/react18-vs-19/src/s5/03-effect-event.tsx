/**
 * S5 · 03 — useEffectEvent (React 19.2): ler sem reagir
 * ----------------------------------------------------------------------------
 * Um effect volta a correr quando uma dependência muda. Às vezes o effect
 * precisa de LER um valor (o nome, o tema, o cesto), mas não deve RECOMEÇAR
 * quando esse valor muda.
 *
 * useEffectEvent cria uma função que lê sempre os valores mais recentes e que
 * NÃO é dependência do effect.
 *
 * Regras:
 *   - só se chama de dentro de effects (não num onClick, não se passa a filhos)
 *   - não serve para "calar" dependências: só para a parte que não deve reagir
 */
import { useEffect, useEffectEvent, useState } from 'react';

// ------------------------------------------ ✗ nome nas deps: recomeça a cada tecla --
function HeartbeatComDeps() {
  const [nome, setNome] = useState('Ana');
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    console.log(`▶ ligar (${nome})`);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTicks(n);
      console.log(`♥ ${n} · ${nome}`);
    }, 1000);
    return () => {
      console.log('■ desligar');
      clearInterval(id);
    };
  }, [nome]); // ← cada tecla desliga e volta a ligar

  return (
    <>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <strong>ticks desde a última ligação: {ticks}</strong>
    </>
  );
}

// ------------------------------------ ✓ useEffectEvent: liga uma vez, lê o nome atual --
function HeartbeatComEffectEvent() {
  const [nome, setNome] = useState('Ana');
  const [ticks, setTicks] = useState(0);

  const onTick = useEffectEvent((n: number) => {
    setTicks(n);
    console.log(`♥ ${n} · ${nome}`); // lê o nome mais recente
  });

  useEffect(() => {
    console.log('▶ ligar');
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      onTick(n);
    }, 1000);
    return () => {
      console.log('■ desligar');
      clearInterval(id);
    };
  }, []); // ← o nome já não é dependência

  return (
    <>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <strong>ticks desde a última ligação: {ticks}</strong>
    </>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function EffectEventDemo() {
  return (
    <div className="demo">
      <div className="col">
        <h4>✗ nome nas dependências</h4>
        <HeartbeatComDeps />
      </div>
      <div className="col">
        <h4>✓ useEffectEvent</h4>
        <HeartbeatComEffectEvent />
      </div>
      <small>
        Escreve no campo da esquerda: os ticks voltam ao 0 (a consola mostra desligar/ligar).
        À direita continuam a subir, e o log mostra o nome novo.
      </small>
    </div>
  );
}
