/**
 * 헤더 검색 상태 정보
 */
export function getSearchDisplayInfo(isAdmin: boolean, searchTerm: string) {
  return {
    shouldShow: !isAdmin,
    searchValue: searchTerm,
    placeholder: "상품 검색...",
    maxWidth: "max-w-md",
  };
}

/**
 * 관리자 버튼 정보
 */
export function getAdminButtonInfo(isAdmin: boolean) {
  return {
    text: isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로",
    className: isAdmin
      ? "bg-gray-800 text-white"
      : "text-gray-600 hover:text-gray-900",
  };
}

/**
 * 장바구니 아이콘 정보
 */
export function getCartIconInfo(cartItemCount: number, isAdmin: boolean) {
  return {
    shouldShow: !isAdmin,
    showBadge: cartItemCount > 0,
    badgeCount: cartItemCount,
    badgeText: cartItemCount > 99 ? "99+" : cartItemCount.toString(),
  };
}

/**
 * 헤더 레이아웃 정보
 */
export function getHeaderLayoutInfo() {
  return {
    containerClass: "max-w-7xl mx-auto px-4",
    innerClass: "flex justify-between items-center h-16",
    leftSectionClass: "flex items-center flex-1",
    rightSectionClass: "flex items-center space-x-4",
    logoText: "SHOP",
  };
}
