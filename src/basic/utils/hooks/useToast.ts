// src/basic/utils/hooks/useToast.ts
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  return { toastMessage, showToast };
};
