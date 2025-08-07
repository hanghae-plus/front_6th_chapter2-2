import { Header } from '../ui/Header';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setIsAdmin: (value: boolean) => void;
  totalItemCount: number;
}

export function CartPageHeader({
  searchTerm,
  setSearchTerm,
  setIsAdmin,
  totalItemCount,
}: Props) {
  return (
    <Header
      main={
        <div className="ml-8 flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="상품 검색..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      }
      nav={
        <>
          <button
            onClick={() => setIsAdmin(true)}
            className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
          >
            관리자 페이지로
          </button>

          <div className="relative">
            {/* icon */}
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
            {totalItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
        </>
      }
    />
  );
}
