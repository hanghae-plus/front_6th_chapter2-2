import { AdminToggle } from "./AdminToggle";
import { CartButton } from "./CartButton";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  // 관리자 모드 관련 props
  isAdmin: boolean;
  onAdminToggle: () => void;

  // 검색 관련 props
  searchTerm: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // 장바구니 관련 props
  totalItemCount: number;
}

export default function Header({
  isAdmin,
  onAdminToggle,
  searchTerm,
  handleInputChange,
  totalItemCount,
}: HeaderProps) {
  if (isAdmin) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <AdminToggle isAdmin={isAdmin} onToggle={onAdminToggle} />
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            <SearchBar
              searchTerm={searchTerm}
              handleInputChange={handleInputChange}
            />
          </div>

          <nav className="flex items-center space-x-4">
            <AdminToggle isAdmin={isAdmin} onToggle={onAdminToggle} />
            <CartButton totalItemCount={totalItemCount} />
          </nav>
        </div>
      </div>
    </header>
  );
}
