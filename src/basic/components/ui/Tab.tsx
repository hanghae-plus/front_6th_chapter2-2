import { ReactNode } from 'react';

interface TabProps {
  children: ReactNode;
  onClick?: () => void;
  isActive: boolean;
}

export default function Tab({ children, onClick, isActive }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      {children}
    </button>
  );
}
