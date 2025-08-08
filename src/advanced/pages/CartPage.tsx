import { useAtom } from 'jotai';

import PaymentSection from '../layouts/PaymentSection';
import ProductList from '../layouts/ProductList';
import { debouncedSearchTermAtom } from '../store/atoms';

// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제

export function CartPage() {
  const [debouncedSearchTerm] = useAtom(debouncedSearchTermAtom);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 */}
        <ProductList debouncedSearchTerm={debouncedSearchTerm} />
      </div>

      <div className='lg:col-span-1'>
        <PaymentSection />
      </div>
    </div>
  );
}
