import { useCartStore } from '@/basic/store';
import { Link } from 'react-router-dom';

type Props = {
  searchTerm: string;
  handleSearchTem: (value: string) => void;
};

export const Header = ({ searchTerm, handleSearchTem }: Props) => {
  const cartStore = useCartStore();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={e => handleSearchTem(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/admin">
              <button
                className={`px-3 py-1.5 text-sm rounded transition-colors 'text-gray-600 hover:text-gray-900`}
              >
                관리자 페이지로
              </button>
            </Link>
            <div className="relative">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartStore.cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartStore.totalItemCount}
                </span>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
