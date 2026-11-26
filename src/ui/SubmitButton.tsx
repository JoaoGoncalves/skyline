import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './Button';

type SubmitButtonProps = {
  pendingText: string;
  children: ReactNode;
};

export function SubmitButton({ pendingText, children }: SubmitButtonProps) {
  const { pending } = useFormStatus(); // o status do <form> pai — sem props
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}