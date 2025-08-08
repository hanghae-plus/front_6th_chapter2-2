import { useTotalItemCount } from '../../hooks/cart';
import { useGotoAdminPage } from '../../hooks/page';
import { useSearch } from '../../hooks/search';
import { CartIcon } from '../icons';
import { Header } from '../ui/Header';

export function CartPageHeader() {
  const totalItemCount = useTotalItemCount();
  const gotoAdminPage = useGotoAdminPage();
  const { searchTerm, setSearchTerm } = useSearch();

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
            onClick={gotoAdminPage}
            className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
          >
            관리자 페이지로
          </button>

          <div className="relative">
            <CartIcon />
            {totalItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItemCount}
              </div>
            )}
          </div>
        </>
      }
    />
  );
}
