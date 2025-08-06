import type { InputHTMLAttributes } from 'react';
import { Label } from './Label';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...inputOptions }: Props) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="text" {...inputOptions} />
    </div>
  );
}
