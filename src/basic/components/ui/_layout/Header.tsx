import React from 'react';

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">{children}</div>
      </div>
    </header>
  );
};

export default Header;

Header.Left = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center flex-1">{children}</div>
);

Header.Right = ({ children }: { children: React.ReactNode }) => (
  <nav className="flex items-center space-x-4">{children}</nav>
);
