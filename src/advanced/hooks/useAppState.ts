import { useState, useCallback } from "react";

export const useAppState = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdminMode = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, []);

  return {
    isAdmin,
    toggleAdminMode,
  };
};
