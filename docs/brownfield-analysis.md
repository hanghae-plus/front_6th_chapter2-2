# Brownfield Architecture Analysis

## Brownfield란?

**Brownfield**는 기존에 운영 중인 레거시 시스템이나 코드베이스를 의미합니다. 새로운 프로젝트를 시작하는 **Greenfield**와 달리, Brownfield는 이미 존재하는 코드를 개선하고 리팩토링해야 하는 상황을 말합니다.

### Brownfield의 특징
- 기존 코드베이스가 존재
- 레거시 시스템과의 호환성 유지 필요
- 점진적인 개선이 요구됨
- 기존 비즈니스 로직 보존 필요

## 현재 App.tsx의 문제점 분석

### 1. 단일 책임 원칙(SRP) 위반

현재 `App.tsx`는 다음과 같은 **여러 책임**을 동시에 가지고 있습니다:

#### 🛒 장바구니 관리
- 장바구니 상태 관리
- 상품 추가/제거
- 수량 조절
- 장바구니 계산 로직

#### 🏪 상품 관리
- 상품 목록 표시
- 상품 검색
- 재고 관리
- 할인 정책 적용

#### 🎫 쿠폰 시스템
- 쿠폰 목록 관리
- 쿠폰 적용/해제
- 할인 계산

#### 👨‍💼 관리자 기능
- 상품 CRUD
- 쿠폰 CRUD
- 할인 정책 관리

#### 🔔 알림 시스템
- 성공/에러/경고 메시지
- 토스트 알림 관리

#### 💾 데이터 영속성
- localStorage 관리
- 상태 동기화

### 2. 코드 복잡도 문제

```typescript
// 현재 App.tsx의 복잡도 지표
- 총 라인 수: 1,124줄
- 함수 수: 20+ 개
- 상태 변수: 15+ 개
- useEffect: 6개
- 중첩된 조건문: 다수
```

### 3. 함수별 책임 분석

#### 🔴 문제가 있는 함수들

```typescript
// 1. 너무 많은 책임을 가진 함수
const calculateCartTotal = (): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  // 장바구니 계산 + 쿠폰 적용 + 할인 계산
  // 3가지 책임을 동시에 처리
};

// 2. 부수효과가 많은 함수
const addToCart = useCallback((product: ProductWithUI) => {
  // 재고 확인 + 장바구니 업데이트 + 알림 표시
  // 3가지 부수효과를 동시에 처리
}, [cart, addNotification, getRemainingStock]);

// 3. 너무 긴 함수
const handleProductSubmit = (e: React.FormEvent) => {
  // 폼 검증 + 상태 업데이트 + 알림 + UI 업데이트
  // 50줄이 넘는 함수
};
```

#### 🟡 개선이 필요한 함수들

```typescript
// 1. 중복된 로직
const formatPrice = (price: number, productId?: string): string => {
  // 가격 포맷팅 + 품절 체크 + 관리자 모드 체크
  // 3가지 로직이 혼재
};

// 2. 복잡한 조건문
const getMaxApplicableDiscount = (item: CartItem): number => {
  // 상품 할인 + 대량 구매 할인 + 최대 할인율 제한
  // 3가지 비즈니스 로직이 혼재
};
```

### 4. 상태 관리 문제

#### 🔴 상태 의존성 문제

```typescript
// 1. 너무 많은 상태
const [products, setProducts] = useState<ProductWithUI[]>(...);
const [cart, setCart] = useState<CartItem[]>(...);
const [coupons, setCoupons] = useState<Coupon[]>(...);
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
const [isAdmin, setIsAdmin] = useState(false);
const [notifications, setNotifications] = useState<Notification[]>([]);
const [showCouponForm, setShowCouponForm] = useState(false);
const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
const [showProductForm, setShowProductForm] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [editingProduct, setEditingProduct] = useState<string | null>(null);
const [productForm, setProductForm] = useState({...});
const [couponForm, setCouponForm] = useState({...});
const [totalItemCount, setTotalItemCount] = useState(0);

// 2. 상태 간 의존성
useEffect(() => {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  setTotalItemCount(count);
}, [cart]); // cart가 변경될 때마다 totalItemCount도 변경
```

#### 🟡 상태 정규화 필요

```typescript
// 현재: 중복된 데이터
const [totalItemCount, setTotalItemCount] = useState(0);

// 개선: 계산된 값으로 처리
const totalItemCount = useMemo(() => 
  cart.reduce((sum, item) => sum + item.quantity, 0), 
  [cart]
);
```

### 5. useEffect 복잡성

#### 🔴 문제가 있는 useEffect들

```typescript
// 1. 너무 많은 부수효과
useEffect(() => {
  localStorage.setItem('products', JSON.stringify(products));
}, [products]);

useEffect(() => {
  localStorage.setItem('coupons', JSON.stringify(coupons));
}, [coupons]);

useEffect(() => {
  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    localStorage.removeItem('cart');
  }
}, [cart]);

// 2. 복잡한 타이머 로직
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### 6. 컴포넌트 구조 문제

#### 🔴 JSX 복잡성

```tsx
// 1. 너무 긴 JSX (1,000줄 이상)
return (
  <div className="min-h-screen bg-gray-50">
    {/* 알림 시스템 */}
    {notifications.length > 0 && (...)}
    
    {/* 헤더 */}
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      {/* 검색 + 네비게이션 + 장바구니 아이콘 */}
    </header>
    
    {/* 메인 컨텐츠 */}
    <main className="max-w-7xl mx-auto px-4 py-8">
      {isAdmin ? (
        /* 관리자 페이지 */
        <div className="max-w-6xl mx-auto">
          {/* 상품 관리 + 쿠폰 관리 */}
        </div>
      ) : (
        /* 쇼핑몰 페이지 */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 상품 목록 + 장바구니 + 결제 정보 */}
        </div>
      )}
    </main>
  </div>
);
```

### 7. 타입 안전성 문제

#### 🔴 타입 정의 부족

```typescript
// 1. 인라인 타입 정의
interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 2. any 타입 사용
const [productForm, setProductForm] = useState({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [] as Array<{ quantity: number; rate: number }>
});
```

### 8. 성능 문제

#### 🔴 불필요한 리렌더링

```typescript
// 1. 매번 새로 생성되는 함수
const addToCart = useCallback((product: ProductWithUI) => {
  // ...
}, [cart, addNotification, getRemainingStock]);

// 2. 복잡한 계산이 매번 실행
const totals = calculateCartTotal(); // 매 렌더링마다 실행

// 3. 필터링이 매번 실행
const filteredProducts = debouncedSearchTerm
  ? products.filter(product => 
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    )
  : products;
```

### 9. 유지보수성 문제

#### 🔄 변경 영향도가 큼
- 하나의 기능을 수정하면 전체 컴포넌트에 영향
- 테스트가 어려움
- 버그 발생 시 원인 파악이 어려움

#### 📈 확장성 부족
- 새로운 기능 추가 시 코드가 더 복잡해짐
- 컴포넌트 재사용 불가
- 팀 협업 시 충돌 가능성 높음

### 10. 테스트 어려움

#### 🧪 단위 테스트 불가능
- 개별 기능을 독립적으로 테스트할 수 없음
- Mock 데이터 설정이 복잡
- 테스트 커버리지 측정 어려움

#### 🔍 통합 테스트의 복잡성
- 전체 플로우 테스트만 가능
- 특정 시나리오 테스트 어려움

## 리팩토링 전략

### 1. 계층 분리 (Layered Architecture)

```
┌─────────────────────────────────────┐
│           UI Layer                  │
│  (Components, Pages)               │
├─────────────────────────────────────┤
│         Business Layer              │
│      (Custom Hooks)                │
├─────────────────────────────────────┤
│         Data Layer                  │
│     (Services, Utils)              │
├─────────────────────────────────────┤
│         State Layer                 │
│    (Context, Store)                │
└─────────────────────────────────────┘
```

### 2. 엔티티 중심 분리

#### 🛒 Cart 엔티티
- `useCart` 훅
- `CartItem` 컴포넌트
- `calculateCartTotal` 유틸리티

#### 🏪 Product 엔티티
- `useProduct` 훅
- `ProductCard` 컴포넌트
- `getRemainingStock` 유틸리티

#### 🎫 Coupon 엔티티
- `useCoupon` 훅
- `CouponSelector` 컴포넌트
- `applyCoupon` 유틸리티

### 3. 관심사 분리 (Separation of Concerns)

#### 📊 상태 관리
- 전역 상태와 로컬 상태 분리
- Context API 또는 상태 관리 라이브러리 활용

#### 🎨 UI 컴포넌트
- 재사용 가능한 UI 컴포넌트
- 엔티티와 독립적인 컴포넌트

#### 🔧 비즈니스 로직
- 순수 함수로 분리
- 테스트 가능한 유틸리티 함수

## 예상 효과

### 📈 유지보수성 향상
- 코드 가독성 개선
- 버그 수정 용이성 증가
- 기능 추가 시 영향도 최소화

### 🚀 성능 개선
- 불필요한 리렌더링 감소
- 메모리 사용량 최적화
- 번들 크기 감소

### 🧪 테스트 용이성
- 단위 테스트 가능
- 테스트 커버리지 향상
- 버그 조기 발견

### 👥 팀 협업 개선
- 코드 리뷰 효율성 증가
- 병렬 개발 가능
- 지식 공유 용이성

이러한 분석을 바탕으로 체계적인 리팩토링을 진행하면 Brownfield 상황을 성공적으로 개선할 수 있습니다. 