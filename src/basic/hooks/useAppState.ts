import { useState } from 'react';

export const useAppState = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };

  return {
    isAdmin,
    toggleAdminMode,
  };
};
