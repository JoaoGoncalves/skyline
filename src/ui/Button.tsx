import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn-${variant} ${className ?? ''}`}  {...rest} />;
}


