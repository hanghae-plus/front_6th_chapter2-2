import { useCart } from "../../hooks/useCart";
import { CartIcon } from "../icons";
import Button from "../ui/Button";
import { useSearch, useSearchActions } from "../../hooks/useSearch";

interface HeaderProps {
  isAdmin: boolean;
  handleToggleAdmin: () => void;
}

const CartBadge = ({ itemCount }: { itemCount: number }) => (
  <div className="relative">
    <CartIcon className="w-6 h-6 text-gray-700" />
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </div>
);

const SearchBox = () => {
  const { searchTerm } = useSearch();
  const setSearchTerm = useSearchActions();

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

const AdminToggleButton = ({
  isAdmin,
  handleToggleAdmin,
}: {
  isAdmin: boolean;
  handleToggleAdmin: () => void;
}) => (
  <Button
    onClick={handleToggleAdmin}
    variant={isAdmin ? "primary" : "ghost"}
    sizes="md"
  >
    {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
  </Button>
);

export const Header = ({ isAdmin, handleToggleAdmin }: HeaderProps) => {
  const { totalItemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && <SearchBox />}
          </div>
          <nav className="flex items-center space-x-4">
            <AdminToggleButton
              isAdmin={isAdmin}
              handleToggleAdmin={handleToggleAdmin}
            />
            {!isAdmin && <CartBadge itemCount={totalItemCount} />}
          </nav>
        </div>
      </div>
    </header>
  );
};
