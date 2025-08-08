import type { SelectHTMLAttributes } from 'react';
import { Label } from '../../ui/Label';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectWithLabel({ label, options, ...selectOptions }: Props) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
        {...selectOptions}
      >
        {options.map(({ label, value }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
