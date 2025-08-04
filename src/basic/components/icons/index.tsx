// TODO: SVG 아이콘 컴포넌트들
// 구현할 아이콘:
// - CartIcon: 장바구니 아이콘
// - AdminIcon: 관리자 아이콘
// - PlusIcon: 플러스 아이콘
// - MinusIcon: 마이너스 아이콘
// - TrashIcon: 삭제 아이콘
// - ChevronDownIcon: 아래 화살표
// - ChevronUpIcon: 위 화살표
// - CheckIcon: 체크 아이콘

// TODO: 구현

export const CartIcon = () => (
  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
