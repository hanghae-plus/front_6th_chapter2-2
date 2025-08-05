import { useCallback } from 'react';
import { Input } from '../input';

type Props = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  formatter?: (value: number) => string;
  parser?: (value: string) => number;
};

export const NumberInput = ({
  value,
  onChange,
  onBlur,
  min,
  max,
  placeholder,
  className = '',
  formatter = String,
  parser = (value: string) => parseInt(value) || 0
}: Props) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^\d+$/.test(value)) {
        const parsedValue = parser(value);
        onChange(value === '' ? 0 : parsedValue);
      }
    },
    [onChange, parser]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const parsedValue = parser(e.target.value);
      let finalValue = parsedValue;

      if (typeof min === 'number' && parsedValue < min) {
        finalValue = min;
      } else if (typeof max === 'number' && parsedValue > max) {
        finalValue = max;
      }

      onChange(finalValue);
      onBlur?.(finalValue);
    },
    [min, max, onChange, onBlur, parser]
  );

  return (
    <Input
      type='text'
      value={value === 0 ? '' : formatter(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
};
