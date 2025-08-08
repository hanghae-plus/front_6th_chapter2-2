import { useState } from "react";

export const useAppState = () => {
  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);

  const [totalItemCount, setTotalItemCount] = useState(0);
  const toggleAdmin = () => setIsAdmin(!isAdmin);

  return {  
    // UI 상태
    isAdmin,
    toggleAdmin,
    totalItemCount,
    setTotalItemCount,
  };
};
