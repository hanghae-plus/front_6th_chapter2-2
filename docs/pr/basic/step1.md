# 1단계: 순수함수 분리 완료 요약 (2024-08-04)

## 🎯 완료된 작업

### 1. 계산 함수 분리

- **파일**: `src/basic/utils/calculators.ts` 생성
- **분리된 함수들**:
  - `calculateItemTotal`: 장바구니 아이템 총액 계산
  - `getMaxApplicableDiscount`: 최대 적용 가능한 할인율 계산
  - `calculateCartTotal`: 장바구니 전체 총액 계산
  - `getRemainingStock`: 상품별 남은 재고 계산

### 2. 포맷팅 함수 분리

- **파일**: `src/basic/utils/formatters.ts` 생성
- **분리된 함수들**:
  - `formatPrice`: 가격 포맷팅 (관리자/일반 사용자 구분, 품절 표시)

### 3. App.tsx 수정

- **Import 구문 추가**: 분리된 함수들 import
- **함수 호출 수정**: 매개변수 전달 방식으로 변경
- **기존 함수 제거**: App.tsx 내부의 중복 함수들 삭제

## �� 순수함수의 개념

### 순수함수란?

- **동일한 입력에 대해 항상 동일한 출력**을 반환하는 함수
- **부수 효과(side effect)가 없음** (외부 상태 변경, API 호출 등)
- **외부 상태에 의존하지 않음**

### 예시

```typescript
// ✅ 순수함수
const add = (a: number, b: number): number => a + b;

// ❌ 순수함수가 아님
const getCurrentTime = (): string => new Date().toISOString(); // 매번 다른 결과
const updateGlobalState = (value: number) => (globalState = value); // 부수 효과
```

## �� 현재 단계가 필요한 이유

### 1. **안전성 (Safety First)**

```typescript
// 분리 전: App.tsx 내부에 혼재
const calculateItemTotal = (item: CartItem): number => {
  // cart, selectedCoupon 등 외부 상태에 의존
  // UI 로직과 비즈니스 로직이 섞여있음
};

// 분리 후: utils/calculators.ts
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  // 순수 함수: 입력값만으로 결과 결정
  // 테스트하기 쉬움
};
```

**왜 안전한가?**

- 기존 기능을 건드리지 않고 분리 가능
- 입력값과 출력값이 명확함
- 실수로 인한 버그 발생 가능성 낮음

### 2. **테스트 가능성 (Testability)**

```typescript
// 순수함수는 테스트하기 매우 쉬움
describe('calculateItemTotal', () => {
  it('should calculate total with discount', () => {
    const item = { product: { price: 1000, discounts: [] }, quantity: 2 };
    const cart = [];

    const result = calculateItemTotal(item, cart);
    expect(result).toBe(2000);
  });
});
```

**장점:**

- 단위 테스트 작성 용이
- 예상 결과를 쉽게 검증
- 리팩토링 시 안전장치 역할

### 3. **재사용성 (Reusability)**

```typescript
// 다른 컴포넌트에서도 쉽게 사용 가능
import { calculateItemTotal } from './utils/calculators';

// ProductCard에서 사용
const ProductCard = ({ item }) => {
  const total = calculateItemTotal(item, cart);
  return <div>{total}원</div>;
};

// CartSummary에서 사용
const CartSummary = ({ items }) => {
  const total = items.reduce((sum, item) => sum + calculateItemTotal(item, cart), 0);
  return <div>총 {total}원</div>;
};
```

### 4. **의존성 분리 (Dependency Separation)**

```typescript
// 분리 전: App.tsx의 복잡한 의존성
const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [products, setProducts] = useState([]);
  // ... 20개 이상의 상태들

  const calculateItemTotal = item => {
    // cart, selectedCoupon, products 등에 의존
  };
};

// 분리 후: 명확한 의존성
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  // 필요한 데이터만 매개변수로 받음
  // 외부 상태에 의존하지 않음
};
```

## 📊 작업 통계

- **생성된 파일**: 2개
  - `utils/calculators.ts` (74줄)
  - `utils/formatters.ts` (15줄)
- **수정된 파일**: 1개 (`App.tsx`)
- **분리된 함수**: 4개
- **해결된 에러**: 5개
- **테스트 통과**: ✅

## �� 해결된 문제들

### 1. 타입 에러

- **문제**: `utils/calculators.ts`에서 `CartItem`, `Coupon` 타입을 찾을 수 없음
- **해결**: `import { CartItem, Coupon } from '../../types';` 추가

### 2. 매개변수 누락

- **문제**: `calculateCartTotal()` 함수 호출 시 매개변수 전달 안됨
- **해결**: `calculateCartTotal(cart, selectedCoupon || null)` 형태로 수정

### 3. 함수 의존성 문제

- **문제**: `getMaxApplicableDiscount`에서 `cart` 변수 참조 불가
- **해결**: `cart`를 매개변수로 전달하도록 수정

### 4. 테스트 에러

- **문제**: `pnpm test:basic` 실행 시 `cart is not defined` 에러
- **해결**: 모든 계산 함수에 필요한 매개변수들을 전달하도록 수정

## �� 다음 단계 준비

### 2단계: Hook 분리 (다음 단계)

- **목적**: 상태 관리 로직 분리
- **위험도**: 중간 (상태 변경 시 영향)
- **기반**: 1단계에서 분리한 순수 함수들 활용

### 3단계: 컴포넌트 분리 (최종 단계)

- **목적**: UI 컴포넌트 분리
- **위험도**: 높음 (렌더링 로직 변경)
- **기반**: 1-2단계에서 분리한 함수들과 Hook들 활용

## �� 학습한 내용

1. **순수 함수의 중요성**: 테스트 가능성과 재사용성 향상
2. **타입 안정성**: TypeScript를 통한 런타임 에러 방지
3. **단일 책임 원칙**: 각 함수가 하나의 책임만 가지도록 설계
4. **점진적 리팩토링**: 작은 단위로 나누어 안전하게 진행

## �� 결론

순수 함수 분리는 **"기초 공사"**와 같습니다:

- **쉽지만 필수적**: 건물을 지을 때 기초가 튼튼해야 함
- **안전한 시작점**: 이후 모든 리팩토링의 기반
- **장기적 이익**: 코드 품질과 유지보수성 향상

1단계가 성공적으로 완료되어 2단계 Hook 분리로 진행할 준비가 되었습니다.

## �� 관련 문서

- [Basic 과제 요구사항](../pr/basic-requirements.md)
- [리팩토링 계획](../work-plan.md)
- [작업 타임라인](./work-timeline-250804.md)
- [순수함수 중요성](./step1-pure-functions-importance.md)

## 🧩 함수합성 (Function Composition) 개념

### 함수합성이란?

**함수합성**은 작은 순수함수들을 조합해서 더 복잡한 기능을 만드는 함수형 프로그래밍의 핵심 개념입니다.

### 기본 개념

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

### 현재 코드에서의 함수합성 예시

```typescript
// calculators.ts에서의 함수합성
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  // 1단계: 기본 할인 계산
  const baseDiscount = calculateBaseDiscount(
    item.product.discounts,
    item.quantity
  );

  // 2단계: 대량 구매 할인 적용 (합성!)
  if (hasBulkPurchase(cart)) {
    return applyBulkPurchaseDiscount(baseDiscount);
  }

  return baseDiscount;
};
```

### 함수합성의 장점

1. **가독성 향상**: 각 단계가 명확함
2. **테스트 용이성**: 각 함수를 독립적으로 테스트 가능
3. **재사용성**: 다른 곳에서도 조합해서 사용 가능

### 함수합성의 원칙

1. **단일 책임 원칙**: 각 함수가 하나의 책임만
2. **순수함수 유지**: 부수 효과 없이
3. **적절한 추상화 수준**: 과도한 세분화 방지

### 결론

함수합성은 **"레고 블록 조립"**과 같습니다:

- **작은 블록들**: 각각의 순수함수
- **조립 과정**: 함수들을 조합해서 복잡한 기능 만들기
- **결과**: 깔끔하고 유지보수하기 쉬운 코드

이러한 함수합성 패턴은 앞으로의 Hook 분리와 컴포넌트 분리에서도 계속 활용될 것입니다.

## 🎣 Hook vs Model 차이점

### Hook과 Model의 개념적 차이

리팩토링을 진행하기 전에 **Hook**과 **Model**의 차이점을 명확히 이해하는 것이 중요합니다.

#### **Hook (React Hook)**

```typescript
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    if (storedValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
```

**Hook의 특징:**

- ✅ **React 생명주기와 연동**: useState, useEffect 사용
- ✅ **상태 관리**: 컴포넌트의 상태를 관리
- ✅ **재사용 가능**: 여러 컴포넌트에서 사용
- ✅ **부수 효과**: localStorage 읽기/쓰기, API 호출 등

#### **Model (데이터 모델)**

```typescript
// models/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export class ProductModel {
  static validate(product: Product): string[] {
    const errors: string[] = [];
    if (!product.name.trim()) errors.push('상품명은 필수입니다');
    if (product.price <= 0) errors.push('가격은 0보다 커야 합니다');
    if (product.stock < 0) errors.push('재고는 0 이상이어야 합니다');
    return errors;
  }

  static calculateDiscount(product: Product, quantity: number): number {
    return product.discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);
  }
}
```

**Model의 특징:**

- ✅ **순수 함수**: 부수 효과 없음
- ✅ **데이터 중심**: 비즈니스 로직과 검증
- ✅ **테스트 용이**: 독립적으로 테스트 가능
- ✅ **플랫폼 독립적**: React와 무관

### 현재 프로젝트에서의 구분

#### **Hook으로 분리할 것들**

```typescript
// hooks/useLocalStorage.ts - 로컬 스토리지 관리
// hooks/useCart.ts - 장바구니 상태 관리
// hooks/useProducts.ts - 상품 상태 관리
// hooks/useCoupons.ts - 쿠폰 상태 관리
```

#### **Model로 분리할 것들**

```typescript
// models/Product.ts - 상품 검증 및 계산
// models/Cart.ts - 장바구니 계산 로직
// models/Coupon.ts - 쿠폰 적용 로직
```

### 실제 차이점 예시

#### **Hook (상태 관리)**

```typescript
// hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  }, []);

  return { cart, addToCart };
};
```

#### **Model (비즈니스 로직)**

```typescript
// models/Cart.ts
export class CartModel {
  static addItem(cart: CartItem[], product: Product): CartItem[] {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      return cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...cart, { product, quantity: 1 }];
  }

  static calculateTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}
```

### 결론

- **Hook**: React 상태 관리, 생명주기 연동, 부수 효과
- **Model**: 순수 비즈니스 로직, 데이터 검증, 계산

현재 프로젝트에서는 **Hook 분리**부터 시작하는 것이 맞습니다. 왜냐하면:

1. 로컬 스토리지 관리가 우선
2. 상태 관리 로직이 복잡함
3. Model은 이미 `utils/calculators.ts`로 분리됨

이러한 이해를 바탕으로 **useLocalStorage Hook 분리**부터 시작할 준비가 되었습니다.
