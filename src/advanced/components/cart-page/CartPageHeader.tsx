import { useTotalItemCount } from '../../hooks/useCart';
import { useGotoAdminPage } from '../../hooks/usePage';
import { useSearch } from '../../hooks/useSearch';
import { CartIcon } from '../icons';
import { Badge } from '../ui/Badge';
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
              <Badge
                variant="error"
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center"
              >
                {totalItemCount}
              </Badge>
            )}
          </div>
        </>
      }
    />
  );
}
