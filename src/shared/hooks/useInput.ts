import { useState, ChangeEvent } from 'react';

export function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return { value, handleChange, reset };
}
