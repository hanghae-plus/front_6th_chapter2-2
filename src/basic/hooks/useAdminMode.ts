import { useState, useCallback } from "react";

export const useAdminMode = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, []);

  const setAdminMode = useCallback((mode: boolean) => {
    setIsAdmin(mode);
  }, []);

  return {
    isAdmin,
    toggleAdmin,
    setAdminMode,
  };
};
