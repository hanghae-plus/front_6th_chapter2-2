# Day 2: Cart 도메인 완전 분리 (컴포넌트 → 상수 → 순수함수 → 상태관리)

## 목표

- Cart 도메인의 모든 요소를 단계별로 완전 분리
- 장바구니 관련 컴포넌트, 상수, 순수함수, 상태관리 모두 분리

## 작업 범위

### 1단계: Cart 관련 컴포넌트 분리

```typescript
// src/advanced/components/CartSummary.tsx
export const CartSummary: React.FC<{
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onCompleteOrder: () => void;
}>;

// src/advanced/components/CartItem.tsx
export const CartItem: React.FC<CartItemProps>;

// src/advanced/components/CouponSelector.tsx
export const CouponSelector: React.FC<CouponSelectorProps>;
```

### 2단계: Cart 상수 분리

```typescript
// src/advanced/constants/cart.ts
export const BULK_PURCHASE_THRESHOLD = 10;
export const BULK_PURCHASE_ADDITIONAL_DISCOUNT = 0.05;
export const MAX_DISCOUNT_RATE = 0.5;
export const MIN_PERCENTAGE_COUPON_AMOUNT = 10000;
```

### 3단계: Cart 순수함수 분리

```typescript
// src/advanced/utils/cartUtils.ts
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null): CartTotal
export const getRemainingStock = (product: Product, cart: CartItem[]): number
export const getCartItemCount = (cart: CartItem[]): number

// src/advanced/utils/discountUtils.ts
export const calculateDiscountRate = (discounts: Discount[], quantity: number): number
export const hasBulkPurchase = (cart: CartItem[]): boolean
export const applyCouponDiscount = (total: number, coupon: Coupon): number
```

### 4단계: Cart 상태관리 (Atom + Hook)

```typescript
// src/advanced/models/cartAtoms.ts
export const cartAtom = atom<CartItem[]>([])
export const selectedCouponAtom = atom<Coupon | null>(null)
export const cartTotalAtom = atom<CartTotal>((get) => ...)
export const cartItemCountAtom = atom<number>((get) => ...)

// src/advanced/hooks/useCart.ts
export const useCart = () => {
  // localStorage 연동
  // CRUD 함수들
  // 재고 검증
}
```

### 5단계: LocalStorage 연동

```typescript
// src/advanced/utils/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T)
```

### 6단계: App.tsx에서 Cart 관련 코드 제거 및 연결

## 이전 작업과의 연결점

- Day 1에서 분리한 formatPrice 유틸리티 활용
- Product 도메인과의 연동 (재고 계산)

## 테스트 전략

- [ ] 각 단계 완료 후 즉시 테스트 실행
- [ ] 장바구니 CRUD 기능 테스트
- [ ] 할인 계산 로직 테스트
- [ ] localStorage 연동 테스트

## 성공 기준

1. Cart 도메인이 완전히 분리됨
2. App 컴포넌트에서 Cart 관련 코드가 모두 제거됨
3. 장바구니 기능이 정상 동작함
4. 모든 기존 테스트가 통과함

## 다음 날 준비사항

- Coupon 도메인 분석 준비
