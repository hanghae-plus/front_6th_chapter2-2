# Step 2: Hook 분리 작업 (2024-08-04)

## 🎯 목표

App.tsx의 상태 관리 로직을 재사용 가능한 Custom Hook으로 분리하여 단일 책임 원칙 적용

## 📋 Hook 분리 순서 (난이도별)

### 1단계: useLocalStorage Hook ⭐

**목적**: localStorage 관리 로직의 중복 제거  
**파일**: `src/basic/hooks/useLocalStorage.ts`

#### 기존 문제점

```typescript
// ❌ 3번 반복되는 패턴 (products, cart, coupons)
const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem('products');
  // ... 10줄의 중복 코드
});

useEffect(() => {
  localStorage.setItem('products', JSON.stringify(products));
}, [products]);
```

#### 해결 방법

```typescript
// ✅ 재사용 가능한 Hook
const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
  'products',
  initialProducts
);
```

#### 핵심 개념: React 함수형 상태 업데이트

```typescript
// ❌ 순환 참조 위험
const setValue = value => {
  const result = value(storedValue); // 오래된 값 참조 가능
  setStoredValue(result);
};

// ✅ React가 최신 값 제공
// prevValue는 setStoredValue의 함수형 업데이트에서 React가 자동으로 전달해주는 "이전 상태값"입니다.
// 즉, setStoredValue(prevValue => { ... }) 형태로 사용하면, prevValue는 항상 최신 상태를 보장합니다.
const setValue = useCallback(
  value => {
    setStoredValue(prevValue => {
      // prevValue는 setStoredValue 콜백의 첫 번째 인자로, React가 현재 상태의 최신값을 전달합니다.
      const result = value instanceof Function ? value(prevValue) : value;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  },
  [key]
);
```

### 2단계: useNotifications Hook ⭐⭐

**목적**: 알림 상태 관리 로직 분리  
**파일**: `src/basic/hooks/useNotifications.ts`

#### 분리된 기능

- 알림 추가 (`addNotification`)
- 알림 제거 (`removeNotification`)
- 3초 자동 제거 로직

#### 적용 결과

```typescript
// App.tsx에서 간단하게 사용
const { notifications, addNotification, removeNotification } = useNotifications();

// 알림 닫기 버튼
<button onClick={() => removeNotification(notif.id)}>×</button>
```

### 3단계: useDebounce Hook ⭐⭐⭐

**목적**: 검색 입력 지연 처리로 성능 최적화  
**파일**: `src/basic/hooks/useDebounce.ts`

#### 디바운스가 필요한 이유

- **성능 최적화**: 매 글자마다 검색하지 않고 입력 완료 후 검색
- **불필요한 연산 제거**: `"상품1"` 입력 시 5번 → 1번으로 감소
- **API 호출 최적화**: 서버 요청 횟수 대폭 감소

#### 적용 결과

```typescript
// ✅ 간단한 사용법
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// 기존 useEffect 제거됨 (5줄 → 1줄)
```

## 🏗️ 코드 구조 개선

### Before: 중복과 복잡성

```typescript
// App.tsx에 모든 로직이 집중됨
- localStorage 관리 로직 × 3
- 알림 상태 관리
- 검색 디바운스 로직
- 총 30+ 줄의 상태 관리 코드
```

### After: 깔끔한 분리

```typescript
// 재사용 가능한 Hook들
const [products, setProducts] = useLocalStorage('products', initialProducts);
const [cart, setCart] = useLocalStorage('cart', []);
const [coupons, setCoupons] = useLocalStorage('coupons', initialCoupons);
const { notifications, addNotification, removeNotification } =
  useNotifications();
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

## 📊 성과

### 코드 품질

- **중복 제거**: localStorage 관리 코드 70% 감소
- **재사용성**: 다른 컴포넌트에서도 Hook 활용 가능
- **테스트 용이성**: Hook별 독립적인 단위 테스트 가능

### 성능 향상

- **검색 성능**: 디바운스로 80% 연산 감소
- **메모리 효율성**: 함수형 상태 업데이트로 안정성 향상

### 유지보수성

- **단일 책임**: 각 Hook이 하나의 관심사만 처리
- **타입 안전성**: TypeScript 제네릭으로 타입 보장
- **캡슐화**: 관련 로직이 Hook 내부에 응집

## 🔄 다음 단계 계획

### 4단계: useCoupons Hook (예정)

- 쿠폰 상태 관리 및 검증 로직 분리

### 5단계: useProducts Hook (예정)

- 상품 CRUD 작업 및 재고 관리 로직 분리

### 6단계: useCart Hook (예정)

- 장바구니 상태 관리 및 복잡한 비즈니스 로직 분리

## 💡 학습 포인트

1. **Custom Hook의 힘**: 로직 재사용과 코드 구조화
2. **React 함수형 업데이트**: `prevValue`를 통한 안전한 상태 관리
3. **디바운스 패턴**: 성능 최적화의 핵심 기법
4. **점진적 리팩토링**: 작은 단위로 안전하게 개선

# Step 2: Custom Hook 분리 (완료)

## 🎯 목표

App.tsx의 상태 관리 로직을 재사용 가능한 Hook으로 분리하여 단일 책임 원칙 적용

## 📋 완료된 Hook들

### 1. useLocalStorage Hook ⭐

**역할**: localStorage 관리 로직 통합 및 중복 제거

**Before (문제점)**:

```typescript
// 3번 반복되는 패턴 (products, cart, coupons)
const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem('products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
});

// 별도 useEffect로 저장
useEffect(() => {
  localStorage.setItem('products', JSON.stringify(products));
}, [products]);
```

**After (해결)**:

```typescript
// 간단하고 재사용 가능
const [products, setProducts] = useLocalStorage('products', initialProducts);
```

**핵심 기능**:

- React 함수형 상태 업데이트 적용 (`prevValue` 사용)
- 에러 처리 및 타입 안정성 확보
- 자동 JSON 직렬화/역직렬화

### 2. useNotifications Hook ⭐⭐

**역할**: 알림 시스템 캡슐화 및 독립적 관리

**주요 기능**:

```typescript
const { notifications, addNotification, removeNotification } =
  useNotifications();

// 자동 3초 후 제거
addNotification('쿠폰이 적용되었습니다', 'success');
// 수동 제거
removeNotification(notificationId);
```

**개선점**:

- 알림 로직이 독립적으로 분리됨
- 타입별 알림 처리 (`error`, `success`, `warning`)
- 자동 제거 타이머 관리

### 3. useDebounce Hook ⭐⭐⭐

**역할**: 검색 성능 최적화 (입력 지연 처리)

**성능 개선**:

```typescript
// Before: 매 입력마다 검색 실행
onChange={e => setSearchTerm(e.target.value)}  // 5회 검색

// After: 500ms 지연 후 1회만 실행
const debouncedSearchTerm = useDebounce(searchTerm, 500);  // 1회 검색
```

**실제 효과**:

- **연산량 80% 감소**: "상품1" 입력 시 5회 → 1회로 감소
- **UX 개선**: 불필요한 깜빡임 제거
- **서버 부하 감소**: API 호출 횟수 최소화

### 4. useCoupon Hook ⭐⭐⭐⭐ (도메인 서비스 패턴)

**역할**: 쿠폰 상태 관리 + 비즈니스 로직 조합

**아키텍처**:

```typescript
// Hook: React 상태 + 비즈니스 로직 조합
const { coupons, selectedCoupon, applyCoupon, addCoupon, deleteCoupon } =
  useCoupon({ cart, calculateCartTotal, addNotification });

// Service: 순수 비즈니스 로직
couponService.validateCouponApplication(coupon, cartTotal);
couponService.checkDuplicateCoupon(newCoupon, existingCoupons);
```

**주요 기능**:

- **쿠폰 적용 검증**: 10,000원 이상, percentage 타입 제한
- **중복 코드 검증**: 동일한 쿠폰 코드 방지
- **상태 동기화**: 쿠폰 삭제 시 선택된 쿠폰 자동 해제
- **의존성 주입**: 외부 함수들을 매개변수로 받아 결합도 감소

## 🏗️ 전체 아키텍처 구조

```
┌─────────────────────────────────────────┐
│             App.tsx (UI Layer)          │
│  ┌─────────────────────────────────────┐ │
│  │        React Component              │ │
│  │     (렌더링 + 이벤트 처리)            │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ 의존성 주입
┌─────────────────▼───────────────────────┐
│          Hook Layer (상태 관리)          │
│  ┌─────────────────────────────────────┐ │
│  │   useCoupon, useNotifications,      │ │
│  │   useLocalStorage, useDebounce      │ │
│  │   (React 상태 + 비즈니스 로직 조합)  │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ 비즈니스 로직 호출
┌─────────────────▼───────────────────────┐
│        Service Layer (비즈니스 로직)     │
│  ┌─────────────────────────────────────┐ │
│  │      couponService                  │ │
│  │   (순수한 도메인 로직 + 검증)        │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ 유틸리티 호출
┌─────────────────▼───────────────────────┐
│         Utils Layer (순수 함수)         │
│  ┌─────────────────────────────────────┐ │
│  │   calculators, formatters, etc      │ │
│  │   (계산, 포맷팅, 필터링 등)           │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🔄 데이터 흐름

UI 이벤트 (쿠폰 선택)
↓
App.tsx: applyCoupon(coupon) 호출
↓
useCoupon Hook:

1. calculateCartTotal로 현재 총액 계산
2. couponService.validateCouponApplication 호출
3. 검증 결과에 따라 상태 업데이트
   ↓
   couponService: 순수한 비즈니스 로직 실행

- 10,000원 이상 검증
- percentage 타입 제한 확인
  ↓
  Hook: 검증 결과 기반 상태 업데이트
- setSelectedCoupon(coupon)
- addNotification(message)
  ↓
  App.tsx: 새로운 상태로 UI 리렌더링

---

## 🔧 핵심 설계 원칙

### 1. **의존성 역전 (Dependency Inversion)**

```typescript
// Hook이 외부 의존성을 주입받아 결합도 감소
useCoupon({ cart, calculateCartTotal, addNotification });
```

### 2. **관심사 분리 (Separation of Concerns)**

- **App.tsx**: UI 렌더링 + 이벤트 처리만 담당
- **Hook**: 상태 관리 + 외부 서비스 조합
- **Service**: 순수한 도메인 비즈니스 로직
- **Utils**: 계산, 포맷팅 등 순수 함수

### 3. **단일 책임 원칙 (Single Responsibility)**

- 각 Hook이 하나의 도메인 영역만 담당
- 쿠폰 관련 모든 로직이 `useCoupon` + `couponService`에 집중
- localStorage 관리는 `useLocalStorage`만 담당

### 4. **테스트 용이성**

```typescript
// Service: 완전히 독립적 테스트 가능
expect(couponService.validateCouponApplication(coupon, 5000)).toEqual({
  isValid: false,
  message: '...',
});

// Hook: 모킹된 의존성으로 테스트
const mockProps = { cart: [], calculateCartTotal: jest.fn() };
```

## 🕐 5단계: useProducts Hook 분리 (도메인 서비스 패턴)

### 목적

상품 CRUD 로직과 상태 관리 분리

### 도메인 서비스 패턴 적용

**productService (순수 비즈니스 로직)**

```typescript
export const productService = {
  validatePrice: (value: string): ValidationResult => {
    if (value === '') return { isValid: true, message: '', correctedValue: 0 };
    const price = parseInt(value);
    if (isNaN(price)) {
      return {
        isValid: false,
        message: '숫자만 입력해주세요.',
        correctedValue: 0,
      };
    }
    if (price <= 0) {
      return {
        isValid: false,
        message: '가격은 0보다 커야 합니다.',
        correctedValue: 0,
      };
    }
    return { isValid: true, message: '', correctedValue: price };
  },
  validateStock: (value: string): ValidationResult => {
    /* ... */
  },
  generateProductId: (): string => `p${Date.now()}`,
  createProduct: (product: ProductForm): ProductWithUI => {
    return { ...product, id: productService.generateProductId() };
  },
  updateProductList: (products, productId, updates) => {
    return products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );
  },
  removeProduct: (products, productId) => {
    return products.filter(product => product.id !== productId);
  },
};
```

**useProducts Hook (상태 관리 + 서비스 조합)**

```typescript
export const useProducts = ({ addNotification, initialProducts }) => {
  const [products, setProducts] = useLocalStorage('products', initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    /* ... */
  });
  const [showProductForm, setShowProductForm] = useState(false);

  const addProduct = useCallback(
    (product: ProductForm) => {
      const newProduct = productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates) => {
      setProducts(prev => {
        return productService.updateProductList(prev, productId, updates);
      });
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => productService.removeProduct(prev, productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );

  return {
    products,
    editingProduct,
    productForm,
    showProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
    resetProductForm,
    setProductForm,
    setEditingProduct,
    setShowProductForm,
  };
};
```

### 🚨 주요 트러블슈팅

**문제**: "상품의 가격 입력 시 숫자만 허용된다" 테스트 실패

**증상**: `TestingLibraryElementError: Unable to find an element with the placeholder text of: 숫자만 입력`

**트러블슈팅 과정**:

1. **데이터 문제 의심** → useProducts Hook에서 initialProducts 전달 확인
2. **localStorage 문제 의심** → useLocalStorage Hook 초기화 로직 확인
3. **렌더링 문제 발견** → 조건부 렌더링 구조 분석

**근본 원인**: **"수정" 버튼의 onClick 핸들러가 잘못 설정됨**

```typescript
// ❌ 문제가 있던 코드
<button onClick={() => updateProduct(product.id, product)}>
  수정
</button>

// ✅ 수정된 코드
<button onClick={() => startEditProduct(product)}>
  수정
</button>
```

**해결**: `updateProduct` → `startEditProduct`로 변경하여 상품 수정 폼이 열리도록 수정

### 핵심 성과

- **도메인 로직 분리**: 순수한 비즈니스 로직을 productService로 분리
- **상태 관리 캡슐화**: 상품 관련 모든 상태를 useProducts Hook에서 관리
- **테스트 용이성**: 도메인 로직과 React 상태 분리로 독립적 테스트 가능
- **재사용성**: 다른 컴포넌트에서도 동일한 상품 관리 로직 활용 가능

### 아키텍처 개선

App.tsx (UI)
↓ 의존성 주입
useProducts Hook (상태 관리)
↓ 비즈니스 로직 호출
productService (도메인 로직)

## �� 학습 포인트: 의존성 주입과 인터페이스

### 1. 의존성 주입 (Dependency Injection)

**정의**: 외부에서 필요한 의존성(객체, 함수 등)을 주입받아 사용하는 패턴

**비유**: 피자 가게가 밀가루, 치즈, 소스를 외부에서 받아와서 사용하는 것

```typescript
// ❌ 강한 결합 (직접 생성)
const useCart = () => {
  const addNotification = () => {
    /* 알림 로직 */
  }; // Hook 내부에서 직접 구현
};

// ✅ 느슨한 결합 (의존성 주입)
interface UseCartProps {
  addNotification: (message: string, type: string) => void; // 외부에서 주입받음
}
const useCart = ({ addNotification }: UseCartProps) => {
  // 외부에서 주입받은 함수 사용
};
```

**장점**:

- 결합도 감소
- 테스트 용이성 (모킹 가능)
- 재사용성 향상

### 2. 인터페이스의 필요성

**정의**: TypeScript에게 "이 함수는 이런 타입의 파라미터가 필요해"라고 알려주는 계약서

**비유**: 계약서 없이는 어떤 재료가 필요한지 모르는 것

```typescript
// ❌ 인터페이스 없이
const useCart = ({ products, addNotification }) => {
  // TypeScript가 타입을 모름 → 컴파일 에러, 자동완성 불가
};

// ✅ 인터페이스 있이
interface UseCartProps {
  products: ProductWithUI[];
  addNotification: (message: string, type: string) => void;
}
const useCart = ({ products, addNotification }: UseCartProps) => {
  // TypeScript가 정확한 타입을 앎 → 타입 안전성, 자동완성 가능
};
```

**장점**:

- 타입 안전성 (잘못된 타입 사용 시 컴파일 에러)
- IDE 자동완성
- 코드 문서화 효과

### 6단계: useCart Hook 분리 (도메인 서비스 패턴)

#### 목적

장바구니 상태 관리 로직과 비즈니스 로직 분리

#### 도메인 서비스 패턴 적용

**cartService (순수 비즈니스 로직)**

```typescript
export const cartService = {
  addItemToCart: (product, cart) => {
    /* 장바구니 추가 로직 */
  },
  removeItemFromCart: (productId, cart) => {
    /* 장바구니 제거 로직 */
  },
  updateItemQuantity: (productId, newQuantity, cart) => {
    /* 수량 업데이트 로직 */
  },
  calculateTotalItemCount: cart => {
    /* 총 개수 계산 */
  },
};
```

**validators (순수 검증 로직)**

```typescript
export const validateCartOperation = {
  validateStockAvailability: (product, cart) => {
    /* 재고 검증 */
  },
  validateQuantityIncrease: (product, currentQuantity) => {
    /* 수량 증가 검증 */
  },
  validateQuantityChange: (product, newQuantity) => {
    /* 수량 변경 검증 */
  },
};
```

**useCart Hook (상태 관리 + 서비스 조합)**

```typescript
export const useCart = ({ products, addNotification }) => {
  const [cart, setCart] = useLocalStorage('cart', []);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const addToCart = useCallback(
    product => {
      // 1. 검증
      const stockValidation = validateCartOperation.validateStockAvailability(
        product,
        cart
      );
      if (!stockValidation.isValid) {
        addNotification(stockValidation.message, 'error');
        return;
      }

      // 2. 비즈니스 로직
      const newCart = cartService.addItemToCart(product, cart);
      setCart(newCart);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification]
  );

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
  };
};
```

### 7단계: UI 상태 관리 Hook 분리

#### 목적

App.tsx의 UI 관련 상태들을 Hook으로 분리하여 관심사 분리 완성

#### 분리된 Hook들

**useUIState Hook (hooks/useUIState.ts)**

```typescript
export const useUIState = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showCouponForm, setShowCouponForm] = useState(false);

  return {
    isAdmin,
    activeTab,
    showCouponForm,
    setIsAdmin,
    setActiveTab,
    setShowCouponForm,
  };
};
```

**useCouponForm Hook (hooks/useCouponForm.ts)**

```typescript
export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState<CouponForm>({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const resetCouponForm = useCallback(() => {
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  }, []);

  return {
    couponForm,
    setCouponForm,
    resetCouponForm,
  };
};
```

#### 핵심 성과

- **완전한 관심사 분리**: UI 상태와 도메인 상태 완전 분리
- **재사용성**: UI 상태 Hook들을 다른 컴포넌트에서도 활용 가능
- **테스트 용이성**: UI 상태만 독립적으로 테스트 가능
- **가독성**: App.tsx가 순수한 UI 컴포넌트로 변환

#### 아키텍처 개선

App.tsx (UI 렌더링 + 이벤트 핸들러)
↓ 의존성 주입
useUIState + useCouponForm (UI 상태 관리)
↓ 도메인 Hook들과 조합
useProducts + useCart + useCoupon (도메인 로직)

### �� 트러블슈팅: Hook 간 상태 충돌

#### 문제점

```typescript
// useProducts에서
const [showProductForm, setShowProductForm] = useState(false);

// useUIState에서도
const [showProductForm, setShowProductForm] = useState(false);

// 결과: 변수명 충돌 에러
```

#### 해결 방법: 데이터 소유권 원칙 적용

**원칙**: 도메인 관련 상태는 해당 도메인 Hook에서 관리

```typescript
// ✅ useProducts에서 관리 (상품 도메인)
const useProducts = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  // 상품 관련 모든 상태를 한 곳에서 관리
};

// ✅ useUIState에서는 전역 UI 상태만 관리
const useUIState = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showCouponForm, setShowCouponForm] = useState(false); // 쿠폰 폼은 UI 상태
};
```

#### 학습 포인트

- **도메인 경계 명확화**: 상품 관련 상태는 useProducts, 쿠폰 관련 상태는 useCoupon
- **UI 상태 분리**: 전역 UI 상태만 useUIState에서 관리
- **응집성 원칙**: 관련된 상태들은 같은 Hook에서 관리

### 🎯 최종 완성도

#### 완료된 Hook 목록 (9개)

1. **useLocalStorage**: localStorage 관리
2. **useNotifications**: 알림 시스템
3. **useDebounce**: 검색 성능 최적화
4. **useSearch**: 검색 상태 관리
5. **useCoupon**: 쿠폰 도메인 로직 + 상태 관리
6. **useProducts**: 상품 CRUD 로직 + 상태 관리
7. **useCart**: 장바구니 비즈니스 로직 + 상태 관리
8. **useUIState**: UI 상태 관리
9. **useCouponForm**: 쿠폰 폼 상태 관리

#### App.tsx 최종 구조

```typescript
const App = () => {
  // 모든 상태와 로직이 Hook으로 분리됨
  const { notifications, addNotification, removeNotification } = useNotifications();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();
  const { isAdmin, activeTab, showCouponForm, setIsAdmin, setActiveTab, setShowCouponForm } = useUIState();
  const { couponForm, setCouponForm, resetCouponForm } = useCouponForm();
  const { products, filteredProducts, ... } = useProducts({ ... });
  const { cart, totals, ... } = useCart({ ... });
  const { coupons, selectedCoupon, ... } = useCoupon({ ... });

  // 이벤트 핸들러들 (App.tsx에 유지 - 단순한 로직이므로 분리 불필요)
  const handleProductSubmit = (e: React.FormEvent) => { /* ... */ };
  const handleCouponSubmit = (e: React.FormEvent) => { /* ... */ };

  // 순수한 JSX 렌더링
  return (
    <div className="min-h-screen bg-gray-50">
      {/* UI 렌더링 */}
    </div>
  );
};
```

### �� 9단계: 폼 상태 분리 구조 검토

#### 검토 배경

useProducts와 useCouponForm의 폼 관련 상태들이 적절히 분리되어 있는지 검토

#### 현재 구조 분석

**useProducts의 폼 관련 상태들**:

```typescript
// 상품 도메인 내부의 복잡한 폼 상태
const [productForm, setProductForm] = useState<ProductForm>({...});
const [editingProduct, setEditingProduct] = useState<string | null>(null);
const [showProductForm, setShowProductForm] = useState(false);

// 복잡한 편집 로직
const startEditProduct = (product: ProductWithUI) => {
  setEditingProduct(product.id);           // 편집 모드 설정
  setProductForm({...product});           // 폼 데이터 설정
  setShowProductForm(true);               // 폼 표시
};
```

**useCouponForm의 폼 관련 상태들**:

```typescript
// 쿠폰 도메인의 단순한 폼 상태
const [couponForm, setCouponForm] = useState<CouponForm>({...});

// 단순한 초기화 함수
const resetCouponForm = useCallback(() => {
  setCouponForm({...});  // 단순 초기화만
}, []);
```

#### 검토 결과: 현재 구조가 올바름

**이유**:

1. **도메인 경계의 차이**
   - useProducts: 상품 **도메인**의 복잡한 편집 로직 포함
   - useCouponForm: 쿠폰 **도메인**의 단순한 폼 상태만 관리

2. **복잡성의 차이**
   - useProducts: `editingProduct`, `startEditProduct` 등 복잡한 편집 상태
   - useCouponForm: 단순한 폼 초기화만 담당

3. **의존성의 차이**
   - useProducts: `editingProduct`가 `updateProduct`와 강하게 연결
   - useCouponForm: 다른 도메인과 독립적

4. **단일 책임 원칙 준수**
   - 각 Hook이 자신의 도메인만 담당
   - 응집성: 상품 관련 모든 상태가 `useProducts`에 집중

#### 만약 분리한다면 발생할 문제점

```typescript
// ❌ 문제가 될 수 있는 구조
const useProductForm = () => {
  const [productForm, setProductForm] = useState({...});
  const [editingProduct, setEditingProduct] = useState(null);
  // updateProduct 함수와의 의존성 문제 발생
};

const useProducts = () => {
  const { productForm, editingProduct } = useProductForm();
  const updateProduct = (id, updates) => {
    // editingProduct 상태에 의존하는데 다른 Hook에 있음
  };
};
```

#### 학습 포인트

- **도메인 경계 명확화**: 복잡한 도메인 로직은 해당 도메인 Hook에 포함
- **응집성 원칙**: 관련된 상태들은 같은 Hook에서 관리
- **과도한 분리 방지**: 단순한 분리보다는 의미있는 분리 우선

### 🎯 최종 완성도

#### 완료된 Hook 목록 (9개) - 주석 완료

1. **useLocalStorage**: localStorage 관리 ✅
2. **useNotifications**: 알림 시스템 ✅
3. **useDebounce**: 검색 성능 최적화 ✅
4. **useSearch**: 검색 상태 관리 ✅
5. **useCoupon**: 쿠폰 도메인 로직 + 상태 관리 ✅
6. **useProducts**: 상품 CRUD 로직 + 상태 관리 ✅
7. **useCart**: 장바구니 비즈니스 로직 + 상태 관리 ✅
8. **useUIState**: UI 상태 관리 ✅
9. **useCouponForm**: 쿠폰 폼 상태 관리 ✅

#### 코드 품질 개선

- **가독성**: 모든 Hook에 명확한 주석 추가
- **유지보수성**: 코드 구조와 의도가 명확히 문서화
- **협업성**: 다른 개발자가 코드를 쉽게 이해 가능
- **확장성**: 새로운 Hook 추가 시 일관된 주석 패턴 적용

#### 핵심 성과

- **완전한 관심사 분리**: App.tsx가 순수한 UI 컴포넌트로 변환
- **도메인 서비스 패턴**: 각 도메인별로 Hook과 Service 분리
- **재사용성**: 모든 Hook이 독립적으로 재사용 가능
- **테스트 용이성**: 각 Hook과 Service를 독립적으로 테스트 가능
- **유지보수성**: 코드 구조가 명확하고 확장 가능
- **문서화**: 모든 Hook의 목적과 기능이 명확히 문서화
