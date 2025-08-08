import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Card({ children }: Props) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      {children}
    </div>
  );
}
