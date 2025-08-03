# 쿠폰과 장바구니 훅 통합 결정 문서

## 📋 개요

본 문서는 `useCoupons`와 `useCart` 훅을 통합하기로 결정한 배경과 그 결과를 정리합니다.

## 🔍 문제 상황

### 초기 분리 구조의 문제점

```typescript
// 문제가 있던 구조
const { cart, getTotals } = useCart(addNotification);
const { selectedCoupon, applyCoupon } = useCoupons(getTotals, addNotification); // ❌ 순환 의존성
const totals = getTotals(selectedCoupon); // ❌ App.tsx에서 비즈니스 로직 계산
```

**핵심 문제:**
1. **순환 의존성**: useCoupons가 useCart의 getTotals 함수 필요
2. **비즈니스 로직 노출**: App.tsx에서 `getTotals(selectedCoupon)` 계산
3. **강결합**: 쿠폰 적용 검증에 장바구니 총액 필수
4. **복잡한 API**: 두 훅 간의 데이터 전달 복잡

### 근본 원인 분석

**쿠폰의 본질적 특성:**
- 쿠폰은 **장바구니에 적용되는 것**
- 쿠폰 검증에는 **장바구니 총액이 필수**
- 독립적으로 존재할 수 없는 **종속적 개념**

**discount vs coupon 차이:**
```typescript
// discount: 순수 계산 함수 (상태 없음)
getMaxApplicableDiscount(item, cart) → number

// coupon: 상태 + 검증 + 적용 (복합적)
applyCoupon(coupon) {
  const total = getTotals(null); // ❌ 외부 의존성
  const validation = validateCoupon(coupon, total);
  setSelectedCoupon(coupon); // 상태 변경
}
```

## 🔄 시도한 해결책들

### 1. useCartWithCoupons 조합 훅
```typescript
// 시도: 별도 조합 훅 생성
export function useCartWithCoupons() {
  const cartHook = useCart();
  const couponHook = useCoupons(cartHook.getTotals);
  return { ...cartHook, ...couponHook };
}
```
**문제점:** 불필요한 추상화 계층, "억지 조합"

### 2. models/index.ts 조합 함수 활용
```typescript
// 시도: 검증 로직을 모델로 분리
export function applyCouponToCart(cart, coupon) {
  const total = calculateCartTotal(cart, null);
  return validateCouponUsage(coupon, total);
}
```
**한계:** 여전히 useCoupons에서 cart 상태 접근 불가

### 3. App.tsx에서 조합 유지
```typescript
// 시도: 현재 구조 유지
const totals = getTotals(selectedCoupon);
```
**문제점:** 비즈니스 로직이 UI 계층에 노출

## ✅ 최종 결정: 훅 통합

### 통합 후 구조
```typescript
export function useCart() {
  // ========== 장바구니 상태 ==========
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // ========== 쿠폰 상태 ==========
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  // ========== 계산된 값들 ==========
  const totals = useMemo(() => {
    return calculateCartTotal(cart, selectedCoupon); // ✅ 내부에서 자동 계산
  }, [cart, selectedCoupon]);
  
  // ========== 비즈니스 로직 ==========
  const applyCoupon = useCallback((coupon) => {
    const result = applyCouponToCart(cart, coupon); // ✅ models/index 조합 함수 활용
    if (result.success) setSelectedCoupon(coupon);
  }, [cart]);
}
```

## 🎯 통합의 이점

### 1. 의존성 문제 완전 해결
- ❌ **Before**: useCoupons ↔ useCart 순환 의존성
- ✅ **After**: 단일 훅 내부에서 처리

### 2. 비즈니스 로직 캡슐화
- ❌ **Before**: `const totals = getTotals(selectedCoupon)` (App.tsx)
- ✅ **After**: `const { totals } = useCart()` (자동 계산)

### 3. API 단순화
```typescript
// Before: 복잡한 연결
const cartHook = useCart(addNotification);
const couponHook = useCoupons(cartHook.getTotals, addNotification);
const totals = cartHook.getTotals(couponHook.selectedCoupon);

// After: 단순한 사용
const { cart, totals, coupons, selectedCoupon, applyCoupon } = useCart(addNotification);
```

### 4. 테스트 용이성
- 단일 훅 테스트로 전체 시나리오 검증 가능
- 훅 간 상호작용 테스트 불필요

## 📊 결과 비교

| 측면 | 분리 구조 | 통합 구조 |
|------|-----------|-----------|
| **의존성** | 순환 의존성 | 단방향 의존성 |
| **복잡성** | 높음 (2개 훅 + 조합) | 낮음 (1개 훅) |
| **재사용성** | 제한적 | 높음 |
| **테스트** | 복잡 (훅 간 상호작용) | 단순 (단일 훅) |
| **확장성** | 어려움 | 용이함 |

## 🔮 향후 고려사항

### 1. 내부 구조화
```typescript
// 섹션별 명확한 분리 유지
export function useCart() {
  // ========== 장바구니 섹션 ==========
  // ========== 쿠폰 섹션 ==========
  // ========== 계산 섹션 ==========
}
```

### 2. 확장 가능성
- 주문(Order) 도메인 추가 시 자연스러운 확장
- 결제(Payment) 기능과의 통합 용이

### 3. 성능 최적화
- useMemo를 통한 불필요한 재계산 방지
- 섹션별 useCallback을 통한 최적화

## 📝 결론

**쿠폰과 장바구니의 본질적 결합도**를 인정하고 **실용적 통합**을 선택했습니다.

- **이론적 분리**보다 **실제 비즈니스 도메인** 우선
- **복잡한 의존성 관리**보다 **단순한 API** 우선  
- **과도한 추상화**보다 **명확한 책임** 우선

이 결정을 통해 코드의 복잡성을 크게 줄이고, 유지보수성과 확장성을 동시에 확보할 수 있었습니다.

---

**작성일**: 2025-08-03  
**작성자**: Claude (Senior Frontend Developer)  
**프로젝트**: 쇼핑카트 리팩토링 (React + TypeScript)