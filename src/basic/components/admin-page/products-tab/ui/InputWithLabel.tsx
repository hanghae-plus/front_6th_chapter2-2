import type { InputHTMLAttributes } from 'react';
import { Label } from './Label';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...inputOptions }: Props) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        {...inputOptions}
      />
    </div>
  );
}
