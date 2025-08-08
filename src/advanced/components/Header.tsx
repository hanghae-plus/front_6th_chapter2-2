import { ShoppingCartIcon } from "./icons";
import {
  getSearchDisplayInfo,
  getAdminButtonInfo,
  getCartIconInfo,
  getHeaderLayoutInfo,
} from "../models/header";

import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  isAdminAtom,
  searchTermAtom,
  totalItemCountAtom,
  debouncedSearchTermAtom,
} from "../atoms";

// interface HeaderProps {
//   // 상태
//   isAdmin: boolean;
//   searchTerm: string;
//   cartItemCount: number;

//   // 이벤트 핸들러
//   onToggleAdmin: () => void;
//   onSearchChange: (value: string) => void;
// }

// export function Header({
//   isAdmin,
//   searchTerm,
//   cartItemCount,
//   onToggleAdmin,
//   onSearchChange,
// }: HeaderProps) {
//   const searchInfo = getSearchDisplayInfo(isAdmin, searchTerm);
//   const adminButtonInfo = getAdminButtonInfo(isAdmin);
//   const cartIconInfo = getCartIconInfo(cartItemCount, isAdmin);
//   const layoutInfo = getHeaderLayoutInfo();

export function Header() {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const searchTerm = useAtomValue(searchTermAtom);
  const setSearchTerm = useSetAtom(debouncedSearchTermAtom);
  const cartItemCount = useAtomValue(totalItemCountAtom);

  const handleToggleAdmin = () => setIsAdmin(!isAdmin);
  const handleSearchChange = (value: string) => setSearchTerm(value);

  const searchInfo = getSearchDisplayInfo(isAdmin, searchTerm);
  const adminButtonInfo = getAdminButtonInfo(isAdmin);
  const cartIconInfo = getCartIconInfo(cartItemCount, isAdmin);
  const layoutInfo = getHeaderLayoutInfo();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className={layoutInfo.containerClass}>
        <div className={layoutInfo.innerClass}>
          {/* 왼쪽 섹션 */}
          <div className={layoutInfo.leftSectionClass}>
            <h1 className="text-xl font-semibold text-gray-800">
              {layoutInfo.logoText}
            </h1>

            {searchInfo.shouldShow && (
              <div className={`ml-8 flex-1 ${searchInfo.maxWidth}`}>
                <input
                  type="text"
                  value={searchInfo.searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchInfo.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* 오른쪽 섹션 */}
          <nav className={layoutInfo.rightSectionClass}>
            {/* ✅ 관리자 버튼 - 비즈니스 로직 분리 */}
            <button
              onClick={handleToggleAdmin}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${adminButtonInfo.className}`}
            >
              {adminButtonInfo.text}
            </button>

            {/* ✅ 장바구니 아이콘 - 비즈니스 로직 분리 */}
            {cartIconInfo.shouldShow && (
              <div className="relative">
                <ShoppingCartIcon
                  className="w-6 h-6 text-gray-700"
                  strokeWidth={2}
                />
                {cartIconInfo.showBadge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartIconInfo.badgeText}
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
