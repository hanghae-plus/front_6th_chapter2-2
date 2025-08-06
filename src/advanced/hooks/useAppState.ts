import { useCallback } from "react";
import { useAtom } from "jotai";
import { isAdminAtom } from "../atoms";

export const useAppState = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  const toggleAdminMode = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, [setIsAdmin]);

  return {
    isAdmin,
    toggleAdminMode,
  };
};
