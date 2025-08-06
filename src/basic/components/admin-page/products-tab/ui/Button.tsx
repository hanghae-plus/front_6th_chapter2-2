import type { ReactNode } from 'react';

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export function Button({ onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
    >
      {children}
    </button>
  );
}
