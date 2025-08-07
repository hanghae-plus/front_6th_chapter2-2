import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateForm = (updatedForm: Partial<T>) => {
    setForm({ ...form, ...updatedForm });
  };

  const reset = () => {
    setForm(initialState);
  };

  return { form, handleChange, updateForm, reset };
};
