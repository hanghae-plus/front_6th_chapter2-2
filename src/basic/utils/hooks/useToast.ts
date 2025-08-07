// src/basic/utils/hooks/useToast.ts
import { useAtom } from 'jotai';
import { toastMessageAtom } from '../../store/atoms';
import { useEffect } from 'react';

export const useToast = () => {
  const [toastMessage, setToastMessage] = useAtom(toastMessageAtom);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  return { toastMessage, showToast };
};

