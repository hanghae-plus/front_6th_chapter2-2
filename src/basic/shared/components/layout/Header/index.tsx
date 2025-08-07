import { AdminToggle } from "./AdminToggle";
import { CartButton } from "./CartButton";
import { SearchBar } from "./SearchBar";

import { PropsWithChildren } from "react";

interface HeaderProps extends PropsWithChildren {
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Header({ children }: PropsWithChildren) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">{children}</div>
      </div>
    </header>
  );
}

Header.Admin = AdminHeader;
Header.Home = HomeHeader;

function AdminHeader({ setIsAdmin }: HeaderProps) {
  return (
    <Header>
      <div className="flex items-center flex-1">
        <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <AdminToggle isAdmin={true} onToggle={() => setIsAdmin(false)} />
      </nav>
    </Header>
  );
}

interface HomeHeaderProps extends HeaderProps {
  searchTerm: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalItemCount: number;
}

function HomeHeader({
  searchTerm,
  handleInputChange,
  totalItemCount,
  setIsAdmin,
}: HomeHeaderProps) {
  return (
    <Header>
      <div className="flex items-center flex-1">
        <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
        <SearchBar
          searchTerm={searchTerm}
          handleInputChange={handleInputChange}
        />
      </div>

      <nav className="flex items-center space-x-4">
        <AdminToggle isAdmin={false} onToggle={() => setIsAdmin(true)} />
        <CartButton totalItemCount={totalItemCount} />
      </nav>
    </Header>
  );
}
