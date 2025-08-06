import { useState } from "react";

export const useAppState = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return {
    isAdmin,
    setIsAdmin,
  };
};
