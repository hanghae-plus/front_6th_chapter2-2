import { createContext } from "react";

export const AdminContext = createContext<{
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}>({
  isAdmin: false,
  setIsAdmin: () => {},
});
