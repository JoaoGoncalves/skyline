/**
 * S1 · 05 — O que mudou nos TIPOS (@types/react 19)
 * ----------------------------------------------------------------------------
 * Não são mudanças no comportamento do React, mas são os erros de TypeScript
 * que vão aparecer em código antigo (ou copiado de tutoriais).
 *
 * 1) useRef PRECISA de argumento
 *      18: useRef<HTMLInputElement>()       ✅ compilava
 *      19: useRef<HTMLInputElement>()       ❌ "Expected 1 argument"
 *          useRef<HTMLInputElement>(null)   ✅ → tipo RefObject<HTMLInputElement | null>
 *    E o `.current` deixou de ser readonly: podes escrever lá (ex.: guardar um timer).
 *
 * 2) Ref callbacks: o que a função DEVOLVE passou a ter significado (cleanup)
 *      18: ref={(el) => (inputEl = el)}     ✅ (o valor devolvido era ignorado)
 *      19: ref={(el) => (inputEl = el)}     ❌ devolve `el` → o TS acha que é um cleanup
 *          ref={(el) => { inputEl = el; }}  ✅ chavetas = não devolve nada
 *    (o cleanup em si é o exemplo 06)
 *
 * 3) Eventos: FormEvent → SubmitEvent
 *      18: (e: FormEvent<HTMLFormElement>)   — ainda compila, mas aparece riscado (deprecated)
 *      19: (e: SubmitEvent<HTMLFormElement>)
 *
 * 4) JSX global desapareceu
 *      18: function X(): JSX.Element
 *      19: function X(): React.JSX.Element   (ou não anotar o retorno — preferível)
 *    `import type { JSX } from 'react'` também resolve.
 */
import { useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

export default function TiposDemo() {
  // 1) useRef com argumento
  const inputRef = useRef<HTMLInputElement>(null); // RefObject<HTMLInputElement | null>
  const contador = useRef(0); // RefObject<number> — .current pode ser alterado
  const [log, setLog] = useState<string[]>([]);
  const destinoId = useId(); // label ↔ input pelo id (como no SearchInput do Skyline)

  // 3) SubmitEvent em vez de FormEvent — só se escreve o tipo porque o handler é uma função à parte
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    contador.current += 1;
    setLog((l) => [...l, `submit #${contador.current}: ${inputRef.current?.value ?? ''}`]);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // event.target está tipado como HTMLInputElement → .value existe
    if (event.target.value.length > 10) event.target.style.borderColor = 'tomato';
  }

  return (
    <div className="demo">
      <form className="col" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor={destinoId}>Destino</label>
          {/* 2) ref callback com chavetas: não devolve nada */}
          <input
            id={destinoId}
            ref={(el) => {
              inputRef.current = el;
            }}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submeter</button>
      </form>
      <ul className="col">
        {log.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
