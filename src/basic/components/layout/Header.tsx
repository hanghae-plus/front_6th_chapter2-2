import React from 'react';
import { SearchBar } from './SearchBar';
import { Navigation } from './Navigation';
import { CartIcon } from './CartIcon';

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  cartLength: number;
  totalItemCount: number;
  onSearchChange: (value: string) => void;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  searchTerm,
  cartLength,
  totalItemCount,
  onSearchChange,
  onToggleAdmin,
}) => {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center flex-1'>
            <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
            {!isAdmin && (
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
              />
            )}
          </div>
          <nav className='flex items-center space-x-4'>
            <Navigation isAdmin={isAdmin} onToggleAdmin={onToggleAdmin} />
            {!isAdmin && (
              <CartIcon
                cartLength={cartLength}
                totalItemCount={totalItemCount}
              />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
