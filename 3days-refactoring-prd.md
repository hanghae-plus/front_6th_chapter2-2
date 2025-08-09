# Day 3: Coupon 도메인 완전 분리 (컴포넌트 → 상수 → 순수함수 → 상태관리)

## 목표

- Coupon 도메인의 모든 요소를 단계별로 완전 분리
- 쿠폰 관련 컴포넌트, 상수, 순수함수, 상태관리 모두 분리

## 작업 범위

### 1단계: Coupon 관련 컴포넌트 분리

```typescript
// src/advanced/components/CouponList.tsx
export const CouponList: React.FC<{
  coupons: Coupon[];
  onApplyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
}>;

// src/advanced/components/CouponCard.tsx
export const CouponCard: React.FC<CouponCardProps>;

// src/advanced/components/CouponForm.tsx (관리자용)
export const CouponForm: React.FC<CouponFormProps>;

// src/advanced/components/CouponManagement.tsx (관리자용)
export const CouponManagement: React.FC<CouponManagementProps>;
```

### 2단계: Coupon 상수 분리

```typescript
// src/advanced/constants/coupon.ts
export const initialCoupons: Coupon[] = [...]
export const COUPON_FORM_INITIAL_STATE = {...}
export const COUPON_VALIDATION_RULES = {...}
```

### 3단계: Coupon 순수함수 분리

```typescript
// src/advanced/utils/couponUtils.ts
export const validateCouponCondition = (coupon: Coupon, cartTotal: number): boolean
export const applyCouponDiscount = (total: number, coupon: Coupon): number
export const generateCouponCode = (): string
export const validateCouponData = (coupon: Partial<Coupon>): boolean
export const isCouponDuplicate = (coupons: Coupon[], code: string): boolean
export const getCouponDisplayText = (coupon: Coupon): string
```

### 4단계: Coupon 상태관리 (Atom + Hook)

```typescript
// src/advanced/models/couponAtoms.ts
export const couponsAtom = atom<Coupon[]>(initialCoupons)
export const availableCouponsAtom = atom<Coupon[]>((get) => ...)

// src/advanced/hooks/useCoupons.ts
export const useCoupons = () => {
  // localStorage 연동
  // CRUD 함수들
  // 검증 로직
}
```

### 5단계: App.tsx에서 Coupon 관련 코드 제거 및 연결

## 이전 작업과의 연결점

- Day 2의 Cart total과 연동하여 쿠폰 적용 검증
- 기존 localStorage 유틸리티 재사용

## 테스트 전략

- [ ] 각 단계 완료 후 즉시 테스트 실행
- [ ] 쿠폰 적용 조건 검증 테스트
- [ ] 쿠폰 할인 계산 테스트
- [ ] 쿠폰 CRUD 기능 테스트

## 성공 기준

1. Coupon 도메인이 완전히 분리됨
2. App 컴포넌트에서 Coupon 관련 코드가 모두 제거됨
3. 쿠폰 적용 및 검증이 정상 동작함
4. 모든 기존 테스트가 통과함

## 다음 날 준비사항

- Notification 시스템 분석 준비
