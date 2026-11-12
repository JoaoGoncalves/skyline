/**
 * S1 · 03 — Metadata no componente: `<title>`, `<meta>`, `<link>`
 * ----------------------------------------------------------------------------
 * REACT 18: o React só desenhava dentro do <div id="root">. Para mudar o título
 * do separador era preciso um effect a mexer no DOM à mão (ou a biblioteca
 * react-helmet).
 *
 * REACT 19: escreve-se <title> (ou <meta>, <link>) em QUALQUER componente e o
 * React "sobe-o" automaticamente para o <head>. Quando o componente desmonta,
 * a tag sai do <head>.
 *
 * No Skyline: o FlightSearch mostra "Skyline · Lisbon → Porto" no separador.
 *
 * ⚠️ O <title> só aceita UMA string: usar template string
 *    <title>{`Skyline · ${from}`}</title>   ✅
 *    <title>Skyline · {from}</title>        ❌ (são dois filhos → aviso)
 */
import { useEffect, useId, useState } from 'react';

// ---------------------------------------------------------------- REACT 18 --
function Titulo18({ from, to }: { from: string; to: string }) {
  useEffect(() => {
    const anterior = document.title;
    document.title = `18 · ${from} → ${to}`;
    return () => {
      document.title = anterior; // e repor à mão quando desmonta
    };
  }, [from, to]);

  return <p>React 18: título via useEffect + document.title</p>;
}

// ---------------------------------------------------------------- REACT 19 --
function Titulo19({ from, to }: { from: string; to: string }) {
  return (
    <>
      <title>{`19 · ${from} → ${to}`}</title>
      <meta name="description" content={`Voos de ${from} para ${to}`} />
      <p>React 19: &lt;title&gt; dentro do componente</p>
    </>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function MetadataDemo() {
  const [versao, setVersao] = useState<18 | 19>(19);
  const [to, setTo] = useState('Porto');
  const toId = useId();

  return (
    <div className="demo">
      <div className="col">
        <div className="field">
          <label htmlFor={toId}>To</label>
          <input id={toId} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button onClick={() => setVersao((v) => (v === 18 ? 19 : 18))}>Mostrar versão {versao === 18 ? 19 : 18}</button>
        <small>Olha para o título do separador do browser enquanto escreves.</small>
      </div>
      <div className="col">{versao === 18 ? <Titulo18 from="Lisbon" to={to} /> : <Titulo19 from="Lisbon" to={to} />}</div>
    </div>
  );
}
