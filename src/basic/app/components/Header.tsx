import type { CartItem } from "../../domains/cart";
import { CartIcon, SearchInput } from "../../shared";

type HeaderProps = {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  cart: CartItem[];
  totalItemCount: number;
};

export function Header({
  cart,
  isAdmin,
  searchTerm,
  setIsAdmin,
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
            {!isAdmin && (
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
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                isAdmin ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
            {!isAdmin && (
              <div className="relative">
                <CartIcon className="h-6 w-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalItemCount}
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
