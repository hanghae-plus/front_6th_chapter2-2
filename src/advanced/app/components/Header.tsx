import CartIcon from "@assets/icons/CartIcon.svg?react";
import { useCart } from "@entities/cart";
import { SearchBar, Button } from "@shared";

interface HeaderProps {
  isAdmin: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdminToggle: () => void;
}

export default function Header({
  isAdmin,
  searchValue,
  onSearchChange,
  onAdminToggle,
}: HeaderProps) {
  const { cartItemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <SearchBar
                  placeholder="상품 검색..."
                  className="w-full"
                  value={searchValue}
                  onChange={onSearchChange}
                />
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            <Button
              variant={isAdmin ? "dark" : "secondary"}
              size="sm"
              onClick={onAdminToggle}
            >
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </Button>
            {!isAdmin && (
              <div className="relative">
                <CartIcon className="w-6 h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
