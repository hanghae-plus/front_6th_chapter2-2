import { useState } from 'react';

export function useToggle(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, toggle };
}
