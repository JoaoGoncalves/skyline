import { useId, type ComponentProps } from 'react';

type SearchInputProps = ComponentProps<'input'> & {
  label: string;
};

export function SearchInput({ label, ref, ...rest }: SearchInputProps) {
    const id = useId();
  return (
    <div className='field'>
        <label htmlFor={id}>{label}</label>
        <input id={id} ref={ref} {...rest} />
    </div>
  )
}
