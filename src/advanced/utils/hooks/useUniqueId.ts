import { useId } from "react";

export const useUniqueId = () => {
  const baseId = useId();

  return () => {
    return `${baseId}`;
  };
};
