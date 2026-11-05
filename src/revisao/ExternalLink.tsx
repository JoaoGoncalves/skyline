/*
 * Revisão · 2 — Componente que ESTENDE um elemento nativo (<a>)
 * ---------------------------------------------------------------------------
 * React 18 + TypeScript:
 *   type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;   // nome diferente por elemento
 *   const ExternalLink = forwardRef<HTMLAnchorElement, Props>(     // para aceitar uma ref
 *     ({ children, ...rest }, ref) => <a ref={ref} {...rest}>{children} ↗</a>
 *   );
 *
 * React 19 + TypeScript:
 *   - ComponentProps<'a'> → tudo o que um <a> aceita (href, title, aria-*, onClick…) E a ref
 *   - & { … }             → acrescentar ou apertar props (aqui: href passa a obrigatório)
 *   - ...rest             → o que não usamos segue direto para o elemento
 *   - sem forwardRef: a ref é uma prop normal (já vem no ComponentProps)
 *
 * É o mesmo padrão do Button do Skyline (e do Badge, mais à frente).
 */

import type { ComponentProps } from 'react';

type ExternalLinkProps = ComponentProps<'a'> & {
  href: string,
};

export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  return (
     <a target='_blank' rel="noreferrer" {...rest}>
        {children} ➚
    </a>
  )
 
}
