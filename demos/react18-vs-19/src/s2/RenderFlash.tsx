/**
 * Utilitário dos exemplos da S2: cada vez que um componente RENDERIZA, muda de cor.
 * Assim "vê-se" o re-render sem abrir o DevTools.
 *
 * (Math.random() durante o render é impuro — de propósito, só para a demo.
 *  Em dev, o StrictMode renderiza 2x: é normal.)
 */
import type { ReactNode } from 'react';

const cores = ['#E6F5F6', '#FFF3C4', '#FDE2E4', '#E2F0CB', '#E3E7FF', '#FFE5CC'];

export function RenderFlash({ name, children }: { name: string; children?: ReactNode }) {
  const bg = cores[Math.floor(Math.random() * cores.length)];
  console.log(`render: ${name}`);
  return (
    <div className="flash" style={{ background: bg }}>
      <code>{name}</code>
      {children}
    </div>
  );
}
