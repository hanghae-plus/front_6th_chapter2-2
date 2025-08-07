import React from 'react';
import { useAtom } from 'jotai';
import { isAdminAtom } from '../../atoms/uiAtoms';

export const Navigation: React.FC = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  const onToggleAdmin = () => {
    setIsAdmin(prev => !prev);
  };

  return (
    <button
      onClick={onToggleAdmin}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
    </button>
  );
};
