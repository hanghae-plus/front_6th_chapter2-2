import Header from '../ui/_layout/Header.tsx';
import { SearchBar } from '../ui/SearchBar.tsx';
import Button from '../ui/Button.tsx';
import { CartIcon } from '../icons';
interface AppHeaderProps {
  // 상태들
  isAdmin: boolean;
  searchTerm: string;
  totalItemCount: number;
  cartLength: number;

  // 액션들
  toggleAdminMode: () => void;
  setSearchTerm: (term: string) => void;
}

const AppHeader = ({
  isAdmin,
  searchTerm,
  totalItemCount,
  cartLength,
  toggleAdminMode,
  setSearchTerm,
}: AppHeaderProps) => {
  return (
    <Header>
      <Header.Left>
        <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
        {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
        {!isAdmin && (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className={'ml-8 flex-1 max-w-md'}
          />
        )}
      </Header.Left>
      <Header.Right>
        <Button
          onClick={toggleAdminMode}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            isAdmin
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
        </Button>
        {!isAdmin && (
          <div className="relative">
            <CartIcon />
            {cartLength > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
        )}
      </Header.Right>
    </Header>
  );
};

export default AppHeader;
