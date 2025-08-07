import { ChangeEvent } from 'react';
interface SelectProps<T> {
  value: string;
  className?: string;
  items: T[];
  defaultText?: string;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select = <T,>({
  value,
  getValue,
  getLabel,
  className,
  defaultText,
  onChange,
  items,
}: SelectProps<T>) => {
  return (
    <select className={className} value={String(value)} onChange={onChange}>
      {defaultText && <option value="">{defaultText}</option>}
      {items.map(option => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
};

export default Select;
