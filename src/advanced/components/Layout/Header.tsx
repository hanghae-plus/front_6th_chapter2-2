import { useAtom } from "jotai";
import { isAdminAtom, toggleAdminAtom, totalCartCountAtom } from "../../store";
import { Icons } from "../icons";
import { SearchBar } from "../searchBar";

const Header = () => {
  const [isAdmin] = useAtom(isAdminAtom);
  const [, toggleAdmin] = useAtom(toggleAdminAtom);

  return (
    <div className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <span className="text-x/l font-bold text-gray-800">SHOP</span>
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <SearchBar />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAdmin}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
            {!isAdmin && (
              <div className="relative">
                <Icons.Cart />
                <CartBadge />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 장바구니 배지 컴포넌트
const CartBadge = () => {
  const [totalCartCount] = useAtom(totalCartCountAtom);

  if (totalCartCount <= 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {totalCartCount}
    </span>
  );
};

export default Header;
