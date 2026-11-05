import type { ComponentProps } from 'react';

type BadgeProps = ComponentProps<'span'> & {
  variant?: 'info' | 'warn';
};

export function Badge({ variant = 'info', className, ...rest }: BadgeProps) {
   const variantClass = variant === 'warn' ? 'badge' : 'chip';
  return <span className={`${variantClass} ${className ?? ''}`} {...rest} />;
}
