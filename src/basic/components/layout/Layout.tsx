import { Dispatch, SetStateAction } from "react";
import { ShoppingCartIcon } from "../icons";
import { Search } from "../ui/Search";

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  totalItemCount: number;
}

function Header({
  isAdmin,
  searchTerm,
  setSearchTerm,
  setIsAdmin,
  totalItemCount,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            {!isAdmin && (
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
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
                <ShoppingCartIcon />
                {totalItemCount > 0 && (
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
}

function Main({ children }: { children: React.ReactNode }) {
  return <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>;
}

Layout.Header = Header;
Layout.Main = Main;

export { Layout };
