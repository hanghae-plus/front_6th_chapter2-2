import { CartIcon } from './icons';
import { useCart } from '../hooks/useCart';
import { useSearch } from '../hooks/useSearch';
import { useAtom } from 'jotai';
import { isAdminAtom } from '../../store/atoms/appAtom';

export const Header = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const { searchTerm, setSearchTerm } = useSearch();
  const { cart, totalItemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="상품 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* 네비게이션 */}
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>

            {/* 장바구니 */}
            {!isAdmin && (
              <div className="relative">
                <CartIcon />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
};
