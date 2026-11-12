/**
 * S2 · 03 — Keys: index vs id, e key para fazer RESET de state
 * ----------------------------------------------------------------------------
 * 18 → 19: NADA MUDOU.
 *
 * A key diz ao React "este item é o mesmo que estava lá antes". Ele usa-a para
 * decidir que componente REUTILIZA (e o state que esse componente tem dentro).
 *
 * 1) key={index} numa lista que muda de ordem → o state "salta" para o item
 *    errado (o React acha que o item 0 continua a ser o item 0).
 *    Usar sempre um id estável dos dados: key={flight.id}.
 *
 * 2) Mudar a key de propósito = "deita fora este componente e cria um novo".
 *    Útil para fazer reset ao state de um formulário quando muda o voo,
 *    sem useEffect nenhum.
 */
import { useId, useState } from 'react';

type Voo = { id: number; rota: string };

function LinhaVoo({ voo }: { voo: Voo }) {
  const [nota, setNota] = useState(''); // state INTERNO de cada linha
  return (
    <li>
      <b>#{voo.id}</b> {voo.rota}{' '}
      <input placeholder="nota…" value={nota} onChange={(e) => setNota(e.target.value)} />
    </li>
  );
}

const inicial: Voo[] = [
  { id: 5, rota: 'Lisbon → Porto' },
  { id: 7, rota: 'Lisbon → Faro' },
  { id: 9, rota: 'Porto → Faro' },
];

function NotaDoVoo({ voo }: { voo: Voo }) {
  const [texto, setTexto] = useState('');
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>Nota para o voo #{voo.id}</label>
      <input id={id} value={texto} onChange={(e) => setTexto(e.target.value)} />
    </div>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function KeysDemo() {
  const [voos, setVoos] = useState(inicial);
  const [selecionado, setSelecionado] = useState(inicial[0]);
  const baralhar = () => setVoos((v) => [...v].reverse());

  return (
    <div className="demo">
      <div className="col">
        <h4>1 · key={'{index}'} ❌</h4>
        <ul>{voos.map((v, i) => <LinhaVoo key={i} voo={v} />)}</ul>
        <h4>key={'{voo.id}'} ✅</h4>
        <ul>{voos.map((v) => <LinhaVoo key={v.id} voo={v} />)}</ul>
        <button onClick={baralhar}>Inverter ordem</button>
        <small>Escreve uma nota no #5 em cada lista e inverte a ordem.</small>
      </div>
      <div className="col">
        <h4>2 · key para reset de state</h4>
        {inicial.map((v) => (
          <button key={v.id} onClick={() => setSelecionado(v)}>
            #{v.id}
          </button>
        ))}
        {/* sem key: o texto ficava quando mudas de voo. Com key: componente novo, state limpo */}
        <NotaDoVoo  key={selecionado.id} voo={selecionado} />
      </div>
    </div>
  );
}
