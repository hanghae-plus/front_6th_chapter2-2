import { useState } from 'react';

export function useForm<T>(initialFormData: T) {
  const [formData, setFormData] = useState<T>(initialFormData);

  const updateForm = (updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return [formData, updateForm, resetForm] as const;
}
