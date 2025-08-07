import type { CartItem } from "../../domains/cart";
import { BadgeContainer, CartIcon, SearchInput } from "../../shared";
import { AdminToggleButton } from "./AdminToggleButton";

type HeaderProps = {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  cart: CartItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalItemCount: number;
};

export function Header({
  isAdminMode,
  onToggleAdminMode,
  cart,
  searchTerm,
  setSearchTerm,
  totalItemCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            {!isAdminMode && (
              <div className="ml-8 flex max-w-md flex-1 gap-3">
                <SearchInput
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="상품 검색..."
                  color="blue"
                  size="lg"
                />
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            <AdminToggleButton isAdmin={isAdminMode} onToggleAdminMode={onToggleAdminMode} />
            {!isAdminMode && (
              <BadgeContainer label={String(totalItemCount)} visible={cart.length > 0}>
                <CartIcon className="h-6 w-6 text-gray-700" />
              </BadgeContainer>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
