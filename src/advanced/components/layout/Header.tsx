import { useAtom } from "jotai";
import { searchTermAtom } from "../../atoms/searchAtoms";
import { isAdminAtom } from "../../atoms/adminAtoms";
import { totalItemCountAtom } from "../../atoms/cartAtoms";
import { CartIcon } from "../elements/Icons";
import { Dispatch, SetStateAction } from "react";

const Header = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 */}
            {!isAdmin && <SearchBar />}
          </div>
          <nav className="flex items-center space-x-4">
            <AdminToggle isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            {!isAdmin && <CartCount />}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

/** 검색창 */
export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

/** 관리자 토글 버튼 */
export const AdminToggle = ({ isAdmin, setIsAdmin }: { isAdmin: boolean; setIsAdmin: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <button onClick={() => setIsAdmin(!isAdmin)} className={`px-3 py-1.5 text-sm rounded transition-colors ${isAdmin ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}`}>
      {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
    </button>
  );
};

/** 장바구니 수량 */
export const CartCount = () => {
  const [totalItemCount] = useAtom(totalItemCountAtom);

  return (
    <div className="relative">
      <CartIcon />
      {totalItemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItemCount}</span>}
    </div>
  );
};
