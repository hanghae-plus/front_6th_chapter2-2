import { useState } from "react";

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => ValidationResult;
  onSubmit: (values: T) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const validation = validate(values);
      setErrors(validation.errors);

      if (validation.valid) {
        onSubmit(values);
      }
    } else {
      onSubmit(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field as string]: error }));
  };

  return {
    values,
    errors,
    handleFieldChange,
    handleSubmit,
    resetForm,
    setFieldError,
  };
}
