import { useAtomValue } from "jotai";
import { isAdminAtom } from "../../atoms";
import { useAppState } from "../../hooks/useAppState";
import { useCart } from "../../entities/cart/useCart";
import { CartIcon } from "../icons";
import { SearchInput } from "../ui/SearchInput";

export const Header = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const { toggleAdminMode } = useAppState();
  const { totalItemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-lg">
                <SearchInput />
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            {!isAdmin && (
              <div className="relative">
                <CartIcon />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={toggleAdminMode}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
