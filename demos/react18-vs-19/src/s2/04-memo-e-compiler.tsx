/**
 * S2 · 04 — memo / useCallback à mão (18) → React Compiler (19) — antevisão da S4
 * ----------------------------------------------------------------------------
 * Quando composição e "moving state down" não chegam, no React 18 a resposta era:
 *   - memo(Componente)   → só renderiza se as props mudarem (comparação por referência)
 *   - useCallback(fn)    → mantém a MESMA função entre renders, senão o memo não serve
 *   - useMemo(valor)     → idem para objetos/arrays/cálculos pesados
 * E era fácil errar: esquecer um useCallback anula o memo; dependências erradas
 * dão bugs.
 *
 * REACT 19 + React Compiler (1.0, um plugin de build — não vem ligado por omissão):
 * o Compiler analisa o código e insere a memoization sozinho, com as
 * dependências certas. O código volta a ser "React simples", como na versão
 * SEM memo abaixo. memo/useMemo/useCallback não estão deprecated — ficam como
 * "escape hatch" e para código sem Compiler.
 *
 * Este projeto NÃO tem o Compiler ligado — a demo com e sem Compiler é a
 * demos/compiler-demo (Sessão 4).
 */
import { memo, useCallback, useState } from 'react';
import { RenderFlash } from './RenderFlash';

type CardProps = { id: number; onSelect: (id: number) => void };

function Card({ id, onSelect }: CardProps) {
  return (
    <RenderFlash name={`Card #${id}`}>
      <button onClick={() => onSelect(id)}>Select</button>
    </RenderFlash>
  );
}
const CardMemo = memo(Card); // React 18: memoization à mão

// --------------------------------------------- SEM memo (código "normal") --
function ListaSemMemo() {
  const [sel, setSel] = useState<number | null>(null);
  const select = (id: number) => setSel(id); // função nova em cada render
  return (
    <RenderFlash name="ListaSemMemo">
      <p>selecionado: {sel ?? '—'}</p>
      {[5, 7].map((id) => <Card key={id} id={id} onSelect={select} />)}
    </RenderFlash>
  );
}

// ---------------------------------------------- COM memo à mão (React 18) --
function ListaComMemo() {
  const [sel, setSel] = useState<number | null>(null);
  const select = useCallback((id: number) => setSel(id), []); // sem isto, o memo não serve
  return (
    <RenderFlash name="ListaComMemo">
      <p>selecionado: {sel ?? '—'}</p>
      {[5, 7].map((id) => <CardMemo key={id} id={id} onSelect={select} />)}
    </RenderFlash>
  );
}

// -------------------------------------------------------------------- DEMO --
export default function MemoECompiler() {
  return (
    <div className="demo">
      <div className="col">
        <h4>Sem memo: os cards renderizam sempre</h4>
        <ListaSemMemo />
      </div>
      <div className="col">
        <h4>memo + useCallback: só a lista renderiza</h4>
        <ListaComMemo />
      </div>
      <small>Com o React Compiler, a versão da esquerda passa a portar-se como a da direita — sem escrever memo.</small>
    </div>
  );
}
