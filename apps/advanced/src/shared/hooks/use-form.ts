import { useCallback, useState } from 'react';

type ValidationRule<T> = {
  validate: (value: T[keyof T]) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

export const useForm = <T extends Record<string, unknown>>(
  initialState: T,
  validationRules?: ValidationRules<T>
) => {
  const [form, setForm] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isDirty, setIsDirty] = useState<{ [K in keyof T]?: boolean }>({});

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const fieldRules = validationRules?.[name];
      if (!fieldRules) return undefined;

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return undefined;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setIsDirty(prev => ({ ...prev, [name]: true }));

      if (validationRules) {
        const error = validateField(name as keyof T, value as T[keyof T]);
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    },
    [validateField, validationRules]
  );

  const updateForm = useCallback(
    (updatedForm: Partial<T>) => {
      setForm(prev => {
        const newForm = { ...prev, ...updatedForm };

        // 업데이트된 필드들의 유효성 검사
        if (validationRules) {
          const newErrors: FormErrors<T> = { ...errors };
          Object.keys(updatedForm).forEach(key => {
            const fieldName = key as keyof T;
            const error = validateField(fieldName, newForm[fieldName]);
            if (error) {
              newErrors[fieldName] = error;
            } else {
              delete newErrors[fieldName];
            }
          });
          setErrors(newErrors);
        }

        return newForm;
      });
    },
    [errors, validateField, validationRules]
  );

  const reset = useCallback(() => {
    setForm(initialState);
    setErrors({});
    setIsDirty({});
  }, [initialState]);

  const isValid = useCallback(() => {
    if (!validationRules) return true;
    return Object.keys(form).every(key => {
      const fieldName = key as keyof T;
      return !validateField(fieldName, form[fieldName]);
    });
  }, [form, validateField, validationRules]);

  return {
    form,
    errors,
    isDirty,
    isValid: isValid(),
    handleChange,
    updateForm,
    reset,
    validateField
  };
};
