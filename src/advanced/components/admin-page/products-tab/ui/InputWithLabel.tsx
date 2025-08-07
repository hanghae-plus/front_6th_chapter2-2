import type { InputHTMLAttributes } from 'react';
import { InputWithLabel as InputWithLabelBase } from '../../ui/InputWithLabel';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...inputOptions }: Props) {
  return (
    <InputWithLabelBase
      label={label}
      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      {...inputOptions}
    />
  );
}
