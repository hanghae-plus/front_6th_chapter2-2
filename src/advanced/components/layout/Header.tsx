import React from 'react';
import { useAtom } from 'jotai';
import { SearchBar } from './SearchBar';
import { Navigation } from './Navigation';
import { CartIcon } from './CartIcon';
import { isAdminAtom } from '../../atoms/uiAtoms';

export const Header: React.FC = () => {
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center flex-1'>
            <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
            {!isAdmin && <SearchBar />}
          </div>
          <nav className='flex items-center space-x-4'>
            <Navigation />
            {!isAdmin && <CartIcon />}
          </nav>
        </div>
      </div>
    </header>
  );
};
