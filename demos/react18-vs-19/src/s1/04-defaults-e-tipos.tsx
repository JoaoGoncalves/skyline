/*
 * S1 · 04 — Valores por omissão e validação de props: adeus `defaultProps` e `propTypes`
 * ----------------------------------------------------------------------------
 * REACT 18 (muito comum em código e cursos antigos, incluindo o de introdução):
 *
 *   function Button({ variant, label }) { ... }
 *   Button.defaultProps = { variant: 'primary' };
 *   Button.propTypes = { variant: PropTypes.oneOf(['primary', 'ghost']), label: PropTypes.string.isRequired };
 *
 *   - defaultProps → valores por omissão
 *   - propTypes    → validação em RUNTIME (avisos na consola, só em dev)
 *
 * REACT 19: as duas coisas foram REMOVIDAS para componentes função.
 *   - Button.defaultProps → é simplesmente ignorado (o variant fica undefined!)
 *   - Button.propTypes    → ignorado em silêncio
 *
 *   Substitutos:
 *   - defaults → valor por omissão na desestruturação (JavaScript normal)
 *   - validação → TypeScript, em tempo de COMPILAÇÃO (o erro aparece no editor,
 *                 antes de correr). Para dados que vêm de fora (API, formulários)
 *                 valida-se em runtime com Zod — Sessão 8.
 *
 * Isto é exatamente o Button do slide 17.
 */
import type { ComponentProps } from 'react';

// ---------------------------------------------------------------- REACT 18 --
// (não corre em 19 — fica como referência para reconhecer em código antigo)
//
// import PropTypes from 'prop-types';
//
// function Button18({ variant, label, onClick }) {
//   return <button className={`btn btn-${variant}`} onClick={onClick}>{label}</button>;
// }
// Button18.defaultProps = { variant: 'primary' };
// Button18.propTypes = {
//   variant: PropTypes.oneOf(['primary', 'ghost']),
//   label: PropTypes.string.isRequired,
//   onClick: PropTypes.func,
// };

// ---------------------------------------------------------------- REACT 19 --
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost'; // ← o "PropTypes.oneOf", mas verificado pelo compilador
};

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  //                     ↑ o "defaultProps", agora na desestruturação
  return <button type={type} className={`btn btn-${variant} ${className ?? ''}`} {...rest} />;
}

// -------------------------------------------------------------------- DEMO --
export default function DefaultsDemo() {
  return (
    <div className="demo">
      <div className="col">
        <Button>Sem variant → primary</Button>
        <Button variant="ghost">variant="ghost"</Button>
        <Button disabled>disabled (prop nativa, veio do ComponentProps)</Button>
        {/* Experimenta: descomenta a linha seguinte → erro de compilação no editor */}
        {/* <Button variant="danger">danger</Button> */}
      </div>
    </div>
  );
}
