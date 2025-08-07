# Basic 과제 리팩토링 작업 타임라인 (2024-08-04)

## �� 작업 개요

단일책임원칙을 위반한 거대한 컴포넌트(`src/basic/App.tsx`)를 단계별로 리팩토링하는 작업을 진행했습니다.

## 🕐 작업 타임라인

### 1단계: 계산 함수 분리 (순수 함수 리팩토링)

#### �� 작업 내용

- **파일 생성**: `src/basic/utils/calculators.ts`
- **분리된 순수 함수들**:
  - `calculateItemTotal`: 장바구니 아이템 총액 계산
  - `getMaxApplicableDiscount`: 최대 적용 가능한 할인율 계산
  - `calculateCartTotal`: 장바구니 전체 총액 계산

#### �� 수정 사항

**1. utils/calculators.ts 파일 생성**

```typescript
import { CartItem, Coupon } from '../../types';

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  return Math.round(price * quantity * (1 - discount));
};

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce(
    (maxDiscount: number, discount: any) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    },
    0
  );

  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
```

**2. App.tsx 수정 사항**

**Import 구문 추가** (3-7번째 줄):

```typescript
import {
  calculateCartTotal,
  calculateItemTotal,
  getMaxApplicableDiscount,
} from './utils/calculators';
```

**함수 호출 부분 수정**:

- 402번째 줄: `const totals = calculateCartTotal(cart, selectedCoupon || null);`
- 1274번째 줄: `const itemTotal = calculateItemTotal(item, cart);`

**기존 함수들 제거**:

- App.tsx 내부의 `calculateItemTotal`, `getMaxApplicableDiscount`, `calculateCartTotal` 함수들 삭제

#### �� 발생한 문제들과 해결 과정

**1. 타입 에러**

- **문제**: `utils/calculators.ts`에서 `CartItem`, `Coupon` 타입을 찾을 수 없음
- **해결**: `import { CartItem, Coupon } from '../../types';` 추가

**2. 매개변수 누락**

- **문제**: `calculateCartTotal()` 함수 호출 시 매개변수 전달 안됨
- **해결**: `calculateCartTotal(cart, selectedCoupon || null)` 형태로 수정

**3. 함수 의존성 문제**

- **문제**: `getMaxApplicableDiscount`에서 `cart` 변수 참조 불가
- **해결**: `cart`를 매개변수로 전달하도록 수정

**4. 테스트 에러**

- **문제**: `pnpm test:basic` 실행 시 `cart is not defined` 에러
- **해결**: 모든 계산 함수에 필요한 매개변수들을 전달하도록 수정

#### ✅ 최종 결과

- **순수 함수 분리 완료**: 3개의 계산 함수를 별도 파일로 분리
- **타입 안정성 확보**: TypeScript 타입 에러 해결
- **테스트 통과**: `pnpm test:basic` 실행 시 에러 없음
- **단일 책임 원칙 적용**: 계산 로직과 UI 로직 분리

## �� 다음 단계 계획

### 2단계: 유틸리티 함수 분리 (예정)

- `formatPrice` 함수 → `utils/formatters.ts`
- `getRemainingStock` 함수 → `utils/calculators.ts`
- 검색 필터링 로직 → `utils/calculators.ts`

### 3단계: useLocalStorage Hook 분리 (예정)

- 로컬 스토리지 관리 로직을 재사용 가능한 Hook으로 분리

### 4단계: 엔티티별 Hook 분리 (예정)

- `useCart`, `useProducts`, `useCoupons` Hook 분리

## 📊 작업 통계

- **생성된 파일**: 1개 (`utils/calculators.ts`)
- **수정된 파일**: 1개 (`App.tsx`)
- **분리된 함수**: 3개
- **해결된 에러**: 4개
- **소요 시간**: 약 2시간

## �� 학습한 내용

1. **순수 함수의 중요성**: 테스트 가능성과 재사용성 향상
2. **타입 안정성**: TypeScript를 통한 런타임 에러 방지
3. **단일 책임 원칙**: 각 함수가 하나의 책임만 가지도록 설계
4. **점진적 리팩토링**: 작은 단위로 나누어 안전하게 진행

## �� 관련 문서

- [Basic 과제 요구사항](../pr/basic-requirements.md)
- [리팩토링 계획](../work-plan.md)

## 🔧 순수함수 내부 리팩토링 고려사항 (2024-08-04 추가)

### 함수형 프로그래밍의 합성(Composition) 개념

#### 기본 개념

**함수형 프로그래밍의 합성**은 작은 순수함수들을 조합해서 더 복잡한 기능을 만드는 것입니다.

```typescript
// 작은 순수함수들
const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const square = (x: number): number => x * x;

// 합성: 작은 함수들을 조합해서 복잡한 기능 만들기
const calculateComplexValue = (x: number, y: number): number => {
  return square(add(multiply(x, 2), y)); // (2x + y)²
};
```

#### 현재 코드에서의 합성 예시

```typescript
// calculators.ts에서의 합성
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = calculateBaseDiscount(
    item.product.discounts,
    item.quantity
  );

  if (hasBulkPurchase(cart)) {
    return applyBulkPurchaseDiscount(baseDiscount); // 합성!
  }

  return baseDiscount;
};
```

### 분리 수준에 대한 고려사항

#### 1. 너무 세분화 (과도함) ❌

```typescript
// 한 줄짜리 함수들 - 의미 없음
const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const square = (x: number): number => x * x;
```

#### 2. 중간 정도 분리 (적절함) ✅

```typescript
// 할인 계산 로직을 하나의 함수로
const calculateDiscountWithBulkPurchase = (
  discounts: any[],
  quantity: number,
  cart: CartItem[]
): number => {
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};
```

#### 3. 분리하지 않음 (복잡함) ❌

```typescript
// 모든 로직이 한 함수에 - 읽기 어려움
export const getMaxApplicableDiscount = (item, cart) => {
  const baseDiscount = item.product.discounts.reduce((max, discount) => {
    return item.quantity >= discount.quantity && discount.rate > max
      ? discount.rate
      : max;
  }, 0);

  if (cart.some(cartItem => cartItem.quantity >= 10)) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }
  return baseDiscount;
};
```

### 적절한 분리의 기준

#### ✅ 적절한 분리 기준:

1. **의미 있는 단위**: 비즈니스 로직의 한 단계
2. **재사용 가능성**: 다른 곳에서도 쓸 수 있는지
3. **테스트 용이성**: 독립적으로 테스트하기 적당한 크기
4. **가독성**: 함수명만 봐도 이해되는 수준

#### ❌ 너무 세분화하지 않는 기준:

1. **한 줄짜리 함수**: 의미가 없음
2. **매우 구체적인 로직**: 재사용 불가능
3. **너무 작은 단위**: 오히려 복잡해짐

### 다른 수강생의 접근 방식과 비교

#### 현재 우리의 접근 방식 (순수함수 분리)

**장점:**

- 테스트 용이성: 순수함수는 단위 테스트가 매우 쉬움
- 재사용성: 다른 컴포넌트에서도 쉽게 사용 가능
- 예측 가능성: 입력값만 알면 결과를 완전히 예측 가능
- 함수형 프로그래밍: 부수 효과가 없어 안전함

**단점:**

- 인자 전달 복잡성: `cart`, `products` 등 많은 데이터를 매번 전달해야 함
- Props Drilling: 컴포넌트 간 데이터 전달이 복잡해질 수 있음
- 실용성 부족: React 컴포넌트에서는 상태 관리가 더 자연스러울 수 있음

#### 다른 수강생의 접근 방식 (상태 관리 훅)

**장점:**

- 실용성: React의 상태 관리 패턴에 더 적합
- 간결성: 인자 전달 없이 상태에 직접 접근
- 성능: 불필요한 재계산 방지 가능
- React 패러다임: 컴포넌트 중심 사고에 더 부합

**단점:**

- 테스트 복잡성: 상태 의존성으로 인한 테스트 어려움
- 부수 효과: 상태 변경으로 인한 예측 불가능성
- 재사용성 제한: 특정 상태에 종속됨

### Jotai 사용 시 고려사항

Jotai를 사용할 예정이므로 **순수함수 방식이 더 적합**합니다:

```typescript
// atoms/cart.ts
export const cartAtom = atom<CartItem[]>([]);
export const selectedCouponAtom = atom<Coupon | null>(null);

// utils/calculators.ts (순수함수 유지)
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  // 순수함수로 유지
};

// hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon] = useAtom(selectedCouponAtom);

  const calculateItemTotal = useCallback(
    (item: CartItem) => {
      return calculateItemTotal(item, cart); // 순수함수 호출
    },
    [cart]
  );

  return { cart, setCart, calculateItemTotal };
};
```

**이유:**

1. **Jotai의 장점 활용**: 상태는 Jotai로, 계산 로직은 순수함수로 분리
2. **학습 효과**: 순수함수 개념 습득과 함수형 프로그래밍 이해
3. **확장성**: 나중에 다른 상태 관리 라이브러리로 변경해도 순수함수는 그대로 사용
4. **Jotai와의 시너지**: 각각의 역할이 명확해짐

### 결론

**중간 정도 분리**가 가장 적절합니다:

- ✅ 비즈니스 로직 단위로 분리
- ✅ 재사용 가능한 수준
- ✅ 테스트하기 적당한 크기
- ✅ 가독성과 유지보수성의 균형

너무 세분화하면 오히려 **"과도한 추상화"**가 되어 코드를 이해하기 어려워질 수 있습니다.

현재 `calculators.ts`와 `formatters.ts`의 함수들은 모두 **진정한 순수함수**이며, 함수형 프로그래밍의 합성을 통해 더 깔끔하고 유지보수하기 쉬운 코드가 되었습니다.

## 2024-08-04 추가 작업 요약

### 오늘 완료된 작업

#### 1. calculators.ts 리팩토링 완료

- **중간 수준 분리** 적용: 과도한 추상화 방지하면서 의미 있는 단위로 분리
- **매직 넘버 제거**: `BULK_PURCHASE_THRESHOLD`, `BULK_PURCHASE_BONUS`, `MAX_DISCOUNT_RATE` 상수 분리
- **함수합성 패턴 적용**: 작은 순수함수들을 조합해서 복잡한 기능 구현

#### 2. 함수합성 개념 정리

- **step1.md에 함수합성 섹션 추가**: 함수형 프로그래밍의 핵심 개념 정리
- **실제 적용 사례 포함**: 현재 프로젝트에서의 함수합성 예시
- **장점과 원칙 정리**: 가독성, 테스트 용이성, 재사용성 등

### 🔧 리팩토링된 코드 구조

```typescript
// 상수 정의
const BULK_PURCHASE_THRESHOLD = 10;
const BULK_PURCHASE_BONUS = 0.05;
const MAX_DISCOUNT_RATE = 0.5;

// 유틸리티 함수
const roundToInteger = (value: number): number => Math.round(value);

// 중간 수준 분리된 함수들
const calculateBaseDiscount = (discounts, quantity) => {
  /* ... */
};
const hasBulkPurchase = cart => {
  /* ... */
};
const applyBulkPurchaseDiscount = baseDiscount => {
  /* ... */
};

// 함수합성을 통한 최종 함수
export const getMaxApplicableDiscount = (item, cart) => {
  const baseDiscount = calculateBaseDiscount(
    item.product.discounts,
    item.quantity
  );

  if (hasBulkPurchase(cart)) {
    return applyBulkPurchaseDiscount(baseDiscount);
  }

  return baseDiscount;
};
```

### 학습한 내용

1. **함수합성의 중요성**: 작은 순수함수들을 조합해서 복잡한 기능 구현
2. **적절한 추상화 수준**: 과도한 세분화 방지와 의미 있는 단위 분리의 균형
3. **매직 넘버 제거**: 상수 분리를 통한 유지보수성 향상
4. **함수형 프로그래밍 패턴**: 순수함수들의 합성을 통한 깔끔한 코드 구조

### 🎯 다음 단계 준비

- **2단계 Hook 분리**: 상태 관리 로직 분리 준비 완료
- **함수합성 패턴 활용**: 앞으로의 리팩토링에서 계속 활용 예정
- **Jotai 도입 준비**: 순수함수와 상태 관리의 조화로운 결합

### 💡 핵심 인사이트

**"레고 블록 조립"** 개념으로 함수합성 이해:

- 작은 블록들(순수함수)을 조합해서 복잡한 기능 만들기
- 각 블록은 독립적이지만 조합하면 강력한 기능 구현
- 유지보수성과 재사용성의 균형점 찾기

이번 작업을 통해 **함수형 프로그래밍의 핵심 개념**을 실제 프로젝트에 적용하는 경험을 쌓았습니다.

## 2024-08-04 오후 작업

### **2단계: 검색 필터링 및 타입 분리 완료**

#### 1. 검색 필터링 로직 분리

- **파일 생성**: `src/basic/utils/filters.ts`
- **분리된 함수**: `filterProducts` - 상품명과 설명으로 검색 필터링
- **적용**: App.tsx의 복잡한 인라인 검색 로직을 순수함수로 분리

#### 2. 타입 분리 및 정리

- **파일 생성**: `src/basic/types.ts`
- **분리된 타입들**: `ProductWithUI`, `Notification`, `ProductForm`, `CouponForm`
- **결과**: 타입 안정성 확보 및 코드 구조화

#### 3. 타입 에러 해결

- **문제**: `ProductWithUI` 타입 상속 문제로 컴파일 에러 발생
- **해결**: import 경로 수정 및 타입 정의 정리
- **결과**: 모든 파일에서 타입 안정성 확보

### 📊 작업 통계

- **생성된 파일**: 2개 (`utils/filters.ts`, `types.ts`)
- **수정된 파일**: 3개 (`App.tsx`, `calculators.ts`, `filters.ts`)
- **분리된 함수**: 1개 (`filterProducts`)
- **분리된 타입**: 4개
- **해결된 에러**: 10+개

### **핵심 성과**

1. **검색 로직 분리**: 복잡한 인라인 필터링을 순수함수로 분리
2. **타입 안정성**: 모든 파일에서 TypeScript 타입 에러 해결
3. **코드 구조화**: 관련 타입들을 체계적으로 분리
4. **재사용성 향상**: 검색 로직을 다른 컴포넌트에서도 사용 가능

### **다음 단계 준비**

- **3단계: 폼 검증 로직 분리** → `utils/validators.ts`
- **4단계: 재고 상태 계산** → `utils/calculators.ts`에 추가
- **5단계: Hook 분리** → 상태 관리 로직 분리

### **현재 코드 구조**
