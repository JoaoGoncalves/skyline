/**
 * S1 · 01 — `ref` como prop (adeus `forwardRef`)
 * ----------------------------------------------------------------------------
 * PROBLEMA: o pai quer dar o foco a um <input> que está DENTRO de um componente
 * nosso (ex.: o SearchInput do Skyline).
 *
 * REACT 18: a `ref` era uma prop "especial" — o React tirava-a das props e ela
 * NUNCA chegava ao componente. Para a passar para dentro era obrigatório
 * embrulhar o componente em `forwardRef(...)`. Com TypeScript isto era penoso:
 * os genéricos vêm pela ordem <TipoDaRef, TipoDasProps> — o contrário das props.
 *
 * REACT 19: a `ref` é uma prop como as outras. Recebe-se, desestrutura-se e
 * passa-se. O tipo vem de graça em `ComponentProps<'input'>`.
 * O `forwardRef` ainda funciona (código antigo não parte), mas vai ser
 * deprecated — em código novo não se usa.
 */
import { forwardRef, useId, useRef, type ComponentProps } from 'react';

// ---------------------------------------------------------------- REACT 18 --
type InputProps18 = { label: string } & ComponentProps<'input'>;

//                              ↓ tipo da ref     ↓ tipo das props (ordem trocada!)
const Input18 = forwardRef<HTMLInputElement, InputProps18>(function Input18(
  { label, ...rest }, // 1.º argumento: as props (SEM a ref)
  ref, //               2.º argumento: a ref, à parte
) {
  const id = useId(); // label ↔ input associados por id (associação explícita)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...rest} />
    </div>
  );
});

// ---------------------------------------------------------------- REACT 19 --
type InputProps19 = { label: string } & ComponentProps<'input'>; // já inclui `ref`

function Input19({ label, ref, ...rest }: InputProps19) {
  // `ref` chega como qualquer outra prop — é só passá-la ao <input>
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...rest} />
    </div>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function RefComoProp() {
  // Igual em 18 e 19: a "caixa" começa a null e o React mete lá o <input> real.
  const ref18 = useRef<HTMLInputElement>(null);
  const ref19 = useRef<HTMLInputElement>(null);

  return (
    <div className="demo">
      <div className="col">
        <h4>React 18 · forwardRef</h4>
        <Input18 ref={ref18} label="From" placeholder="Lisbon" />
        <button onClick={() => ref18.current?.focus()}>Focar</button>
      </div>
      <div className="col">
        <h4>React 19 · ref como prop</h4>
        <Input19 ref={ref19} label="From" placeholder="Lisbon" />
        <button onClick={() => ref19.current?.focus()}>Focar</button>
      </div>
    </div>
  );
}
