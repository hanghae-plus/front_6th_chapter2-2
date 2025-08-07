import { useState } from "react";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);
  const handleToggleAdmin = () => {
    setIsAdmin((prev) => !prev);
  };
  return { isAdmin, handleToggleAdmin };
}
