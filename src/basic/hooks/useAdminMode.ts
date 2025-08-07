import { useState } from "react";

export const useAdminMode = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => {
    setIsAdmin((prev) => !prev);
  };

  return {
    isAdmin,
    toggleAdmin,
  };
};
