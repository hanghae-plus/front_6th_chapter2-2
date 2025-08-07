import { useSearch } from "../../../utils/hooks/useSearch";
import { useProducts } from "../../../hooks/useProducts";

// Admin 헤더용 인터페이스
interface AdminHeaderProps {
  onToggleAdmin: () => void;
}

// 일반 헤더용 인터페이스
interface ShopHeaderProps {
  totalItemCount: number;
  cartItemCount: number;
  onToggleAdmin: () => void;
}

// Admin 헤더 컴포넌트
export const AdminHeader = ({ onToggleAdmin }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">관리자 페이지</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={onToggleAdmin}
              className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white hover:bg-gray-700"
            >
              쇼핑몰로 돌아가기
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

// 일반 쇼핑몰 헤더 컴포넌트
export const ShopHeader = ({
  totalItemCount,
  cartItemCount,
  onToggleAdmin,
}: ShopHeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={onToggleAdmin}
              className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
            >
              관리자 페이지로
            </button>
            <div className="relative">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

// 기존 Header 컴포넌트 (하위 호환성을 위해 유지)
interface HeaderProps {
  isAdmin: boolean;
  totalItemCount: number;
  cartItemCount: number;
  onToggleAdmin: () => void;
}

export const Header = ({
  isAdmin,
  totalItemCount,
  cartItemCount,
  onToggleAdmin,
}: HeaderProps) => {
  if (isAdmin) {
    return <AdminHeader onToggleAdmin={onToggleAdmin} />;
  }

  return (
    <ShopHeader
      totalItemCount={totalItemCount}
      cartItemCount={cartItemCount}
      onToggleAdmin={onToggleAdmin}
    />
  );
};
