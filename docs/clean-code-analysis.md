# Clean Code 분석 보고서

## 📋 개요

`src/basic/App.tsx` 파일에 대한 클린 코드 원칙 준수 여부를 분석한 결과입니다.
총 1,502줄의 거대한 컴포넌트로, 다양한 클린 코드 원칙을 위반하고 있어 즉시 리팩토링이 필요합니다.

## 📊 분석 결과 요약

| 클린 코드 원칙            | 현재 상태      | 개선 필요도 | 위반 사례 수    |
| ------------------------- | -------------- | ----------- | --------------- |
| **Single Responsibility** | ❌ 심각한 위반 | 🔴 높음     | 7개 도메인 혼재 |
| **함수 길이 (20줄 이하)** | ❌ 다수 위반   | 🔴 높음     | 5개 이상 함수   |
| **DRY (중복 제거)**       | ❌ 많은 중복   | 🔴 높음     | 10개 이상 패턴  |
| **매직 넘버 제거**        | ❌ 다수 존재   | 🟡 중간     | 8개 이상        |
| **명확한 네이밍**         | ⚠️ 부분적 위반 | 🟡 중간     | 5개 이상        |
| **낮은 Coupling**         | ❌ 높은 결합도 | 🔴 높음     | 전체적 문제     |
| **높은 Cohesion**         | ❌ 낮은 응집도 | 🔴 높음     | 전체적 문제     |

## 🚨 주요 문제점 분석

### 1. Single Responsibility Principle (SRP) 심각한 위반

#### 문제점

하나의 컴포넌트가 **7개의 서로 다른 도메인**을 관리하고 있습니다.

```typescript
// ❌ 하나의 컴포넌트가 담당하는 책임들
const App = () => {
  // 1. 상품 관리 (5개 상태)
  const [products, setProducts] = useState(...)
  const [editingProduct, setEditingProduct] = useState(...)
  const [productForm, setProductForm] = useState(...)
  const [showProductForm, setShowProductForm] = useState(...)

  // 2. 장바구니 관리 (2개 상태)
  const [cart, setCart] = useState(...)
  const [totalItemCount, setTotalItemCount] = useState(...)

  // 3. 쿠폰 관리 (3개 상태)
  const [coupons, setCoupons] = useState(...)
  const [selectedCoupon, setSelectedCoupon] = useState(...)
  const [couponForm, setCouponForm] = useState(...)

  // 4. UI/UX 관리 (3개 상태)
  const [showCouponForm, setShowCouponForm] = useState(...)
  const [activeTab, setActiveTab] = useState(...)
  const [notifications, setNotifications] = useState(...)

  // 5. 검색 기능 (2개 상태)
  const [searchTerm, setSearchTerm] = useState(...)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(...)

  // 6. 관리자 모드 (1개 상태)
  const [isAdmin, setIsAdmin] = useState(...)

  // 7. 총 15개의 상태 + 20개 이상의 함수
}
```

#### 개선 방안

```typescript
// ✅ 권장되는 구조
// AdminPage 컴포넌트 분리
// CartPage 컴포넌트 분리
// ProductList 컴포넌트 분리
// NotificationSystem 컴포넌트 분리
```

### 2. 함수 길이 제한 위반 (20줄 초과)

#### 위반 사례들

**`addToCart` 함수 (38줄)**

```typescript
// ❌ 252-289줄: 38줄의 복잡한 함수
const addToCart = useCallback(
  (product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });

    addNotification("장바구니에 담았습니다", "success");
  },
  [cart, addNotification, getRemainingStock]
);
```

**`return` JSX (1,030줄)**

```typescript
// ❌ 469-1498줄: 거대한 JSX 블록
return (
  <div className="min-h-screen bg-gray-50">
    {/* 1,030줄의 복잡한 JSX */}
  </div>
);
```

#### 개선 방안

```typescript
// ✅ 함수 분할 예시
const validateStock = (product, quantity) => {
  /* 5줄 */
};
const updateCartQuantity = (productId, newQuantity) => {
  /* 8줄 */
};
const addNewItemToCart = (product) => {
  /* 4줄 */
};

const addToCart = useCallback((product) => {
  if (!validateStock(product, 1)) return;

  const existingItem = findCartItem(product.id);
  if (existingItem) {
    updateCartQuantity(product.id, existingItem.quantity + 1);
  } else {
    addNewItemToCart(product);
  }

  showSuccessNotification("장바구니에 담았습니다");
}, []);
```

### 3. DRY 원칙 위반 (중복 코드)

#### 중복 패턴 1: localStorage 초기화 로직

```typescript
// ❌ 동일한 패턴이 3번 반복
const [products, setProducts] = useState<ProductWithUI[]>(() => {
  const saved = localStorage.getItem("products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
});

const [cart, setCart] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
});

const [coupons, setCoupons] = useState<Coupon[]>(() => {
  const saved = localStorage.getItem("coupons");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
});
```

#### 중복 패턴 2: 폼 초기화 로직

```typescript
// ❌ 폼 초기화 패턴 반복
// 첫 번째 위치
setProductForm({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

// 두 번째 위치 (동일한 패턴)
setProductForm({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

// 세 번째 위치 (동일한 패턴)
setProductForm({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});
```

#### 개선 방안

```typescript
// ✅ 커스텀 훅으로 중복 제거
const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  // localStorage 동기화 로직
  return [state, setState];
};

// ✅ 상수로 중복 제거
const INITIAL_PRODUCT_FORM = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

const resetProductForm = () => setProductForm(INITIAL_PRODUCT_FORM);
```

### 4. 매직 넘버 남용

#### 발견된 매직 넘버들

```typescript
// ❌ 의미를 알 수 없는 숫자들
setTimeout(() => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
}, 3000); // 3000은 무엇인가?

const timer = setTimeout(() => {
  setDebouncedSearchTerm(searchTerm);
}, 500); // 500은 무엇인가?

if (currentTotal < 10000 && coupon.discountType === "percentage") {
  // 10000은 무엇인가?
}

return Math.min(baseDiscount + 0.05, 0.5); // 0.05, 0.5는?

if (product.stock > 10) // 10은 무엇인가?

if (value > 9999) // 9999는 무엇인가?

if (value > 100000) // 100000은 무엇인가?
```

#### 개선 방안

```typescript
// ✅ 의미있는 상수로 정의
const NOTIFICATION_TIMEOUT_MS = 3000;
const SEARCH_DEBOUNCE_DELAY_MS = 500;
const COUPON_MINIMUM_AMOUNT = 10000;
const BULK_PURCHASE_BONUS_RATE = 0.05;
const MAX_DISCOUNT_RATE = 0.5;
const LOW_STOCK_THRESHOLD = 10;
const MAX_STOCK_LIMIT = 9999;
const MAX_COUPON_AMOUNT = 100000;

// 사용 예시
setTimeout(() => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
}, NOTIFICATION_TIMEOUT_MS);

if (
  currentTotal < COUPON_MINIMUM_AMOUNT &&
  coupon.discountType === "percentage"
) {
  addNotification(
    `percentage 쿠폰은 ${COUPON_MINIMUM_AMOUNT.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
    "error"
  );
}
```

### 5. 불명확한 네이밍

#### 문제가 있는 네이밍들

```typescript
// ❌ 불명확한 변수명
const totals = calculateCartTotal(); // 무엇의 총합?
const filteredProducts = debouncedSearchTerm ? ... // 필터링 조건이 불명확
const remainingStock = getRemainingStock(product); // remaining이 중복

// ❌ 약어 사용
const [isAdmin, setIsAdmin] = useState(false); // Admin이 무엇인지 불명확

// ❌ 부정확한 타입명
interface ProductWithUI extends Product {
  // UI와 관련된 것이 무엇인지 불명확
  description?: string;
  isRecommended?: boolean;
}

// ❌ 함수명이 동작을 명확히 표현하지 못함
const handleProductSubmit = (e: React.FormEvent) => {
  // handle은 너무 일반적
}

const startEditProduct = (product: ProductWithUI) => {
  // start가 무엇을 의미하는지 불명확
}
```

#### 개선 방안

```typescript
// ✅ 명확한 네이밍
const cartTotals = calculateCartTotal();
const searchFilteredProducts = debouncedSearchTerm ? ... ;
const availableStock = getAvailableStock(product);

const [isAdminMode, setIsAdminMode] = useState(false);

interface ProductWithDisplayInfo extends Product {
  description?: string;
  isRecommended?: boolean;
}

const submitProductForm = (e: React.FormEvent) => { /* */ };
const initializeProductEdit = (product: ProductWithDisplayInfo) => { /* */ };
```

### 6. 높은 Coupling (결합도)

#### 문제점

```typescript
// ❌ 하나의 함수가 너무 많은 것에 의존
const addToCart = useCallback(
  (product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product); // 재고 계산에 의존
    addNotification("재고가 부족합니다!", "error"); // 알림 시스템에 의존
    setCart(/* ... */); // 장바구니 상태에 의존
    // 총 3개의 서로 다른 도메인에 의존
  },
  [cart, addNotification, getRemainingStock] // 많은 의존성
);

const updateQuantity = useCallback(
  (productId: string, newQuantity: number) => {
    // products, removeFromCart, addNotification, getRemainingStock에 의존
  },
  [products, removeFromCart, addNotification, getRemainingStock]
);
```

#### 개선 방안

```typescript
// ✅ 의존성 분리
const useCart = () => {
  // 장바구니 관련 로직만 담당
};

const useStock = () => {
  // 재고 관련 로직만 담당
};

const useNotification = () => {
  // 알림 관련 로직만 담당
};
```

## 🎯 리팩토링 우선순위

### Phase 1: 긴급 (즉시 적용 가능)

#### 1.1 매직 넘버 상수화 ⚡

```typescript
// constants/index.ts 생성
export const NOTIFICATION_TIMEOUT_MS = 3000;
export const SEARCH_DEBOUNCE_DELAY_MS = 500;
export const COUPON_MINIMUM_AMOUNT = 10000;
// ... 기타 상수들
```

#### 1.2 중복 코드 제거 ⚡

```typescript
// hooks/useLocalStorage.ts 생성
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // localStorage 공통 로직
};

// constants/formDefaults.ts 생성
export const INITIAL_PRODUCT_FORM = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};
```

### Phase 2: 중요 (구조적 개선)

#### 2.1 커스텀 훅 분리 🔄

```typescript
// hooks/useCart.ts
export const useCart = () => {
  // 장바구니 관련 모든 로직
};

// hooks/useProducts.ts
export const useProducts = () => {
  // 상품 관리 관련 모든 로직
};

// hooks/useCoupons.ts
export const useCoupons = () => {
  // 쿠폰 관련 모든 로직
};
```

#### 2.2 컴포넌트 분리 🔄

```typescript
// components/AdminPage.tsx
export const AdminPage = () => {
  // 관리자 페이지 관련 모든 UI
};

// components/ProductList.tsx
export const ProductList = () => {
  // 상품 목록 관련 UI
};

// components/Cart.tsx
export const Cart = () => {
  // 장바구니 관련 UI
};
```

### Phase 3: 중장기 (아키텍처 개선)

#### 3.1 도메인별 폴더 구조

```
src/
├── domains/
│   ├── product/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── coupon/
│       ├── components/
│       ├── hooks/
│       └── types/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
```

#### 3.2 상태 관리 개선

```typescript
// Context API 또는 상태 관리 라이브러리 도입
export const CartProvider = ({ children }) => {
  // 장바구니 상태 관리
};

export const ProductProvider = ({ children }) => {
  // 상품 상태 관리
};
```

## 📈 예상 개선 효과

| 항목               | 현재    | 개선 후 | 개선율    |
| ------------------ | ------- | ------- | --------- |
| **컴포넌트 크기**  | 1,502줄 | ~100줄  | 93% 감소  |
| **함수 평균 길이** | ~40줄   | ~15줄   | 62% 감소  |
| **상태 변수 수**   | 15개    | 3-4개   | 75% 감소  |
| **의존성 수**      | 8개+    | 2-3개   | 65% 감소  |
| **중복 코드**      | 높음    | 낮음    | 80% 감소  |
| **유지보수성**     | 낮음    | 높음    | 크게 향상 |
| **테스트 가능성**  | 불가능  | 용이    | 크게 향상 |

## 🔄 다음 단계

1. **docs/refactoring-process.md** 업데이트
2. **Phase 1** 작업 시작 (매직 넘버, 중복 코드)
3. **Phase 2** 계획 수립 (컴포넌트 분리)
4. **테스트 코드** 작성으로 리팩토링 안정성 확보

---

**작성일**: 2024년  
**분석 대상**: `src/basic/App.tsx` (1,502줄)  
**리팩토링 필요도**: 🔴 매우 높음
