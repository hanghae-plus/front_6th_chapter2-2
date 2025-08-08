import { useState } from "react";

export function useToggle(defaultValue?: boolean) {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = () => {
    setValue((prev) => !prev);
  };

  return [value, toggle, setValue] as const;
}
