# 프로젝트 분석 보고서 - React 리팩토링 교육과제

## 🏗️ 프로젝트 개요

**프로젝트명**: React 디자인 패턴과 함수형 프로그래밍  
**주제**: 거대 단일 컴포넌트 리팩토링 실습  
**기술스택**: React 19, TypeScript, Vite, Vitest  
**목적**: SRP 위반 코드를 계층별 책임 분리로 리팩토링

## 📊 현재 상태 분석

### 프로젝트 구조

```
src/
├── origin/          # 1,123줄 거대 단일 컴포넌트 (리팩토링 전)
├── basic/           # 1,123줄 동일 구조 (컴포넌트 분리 과제용)
├── advanced/        # 1,123줄 동일 구조 (상태관리 추가 과제용)
└── refactoring(hint)/ # 18개 힌트 파일로 구성된 목표 아키텍처
```

### 핵심 도메인 엔티티

```typescript
// 주요 타입 정의 (src/types.ts)
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
```

## ⚠️ 현재 문제점

### 거대 단일 컴포넌트 (1,123줄)

- **단일책임원칙(SRP) 위반**: 상품관리 + 장바구니 + 쿠폰 + 관리자 기능 혼재
- **계층 혼재**: UI 상태 + 비즈니스 로직 + 데이터 처리 통합
- **직접 의존성**: localStorage 직접 조작, 복잡한 계산 로직 내장
- **테스트 불가능**: 모든 것이 하나의 컴포넌트에 결합
- **재사용성 부족**: 기능별 분리 불가

## 🎯 목표 아키텍처 (힌트 기반)

### 계층별 책임 분리

```
models/              # 🧮 순수 비즈니스 로직 계층
├── cart.ts         → 장바구니 계산 함수들 (순수함수)
├── product.ts      → 상품 관련 로직
├── coupon.ts       → 쿠폰 적용 로직
└── discount.ts     → 할인 계산 로직

hooks/              # 🔄 상태 관리 & 부작용 계층
├── useCart.ts      → 장바구니 상태관리 (localStorage 연동)
├── useProducts.ts  → 상품 상태관리
├── useCoupons.ts   → 쿠폰 상태관리
└── utils/          → 범용 유틸리티 훅
    ├── useDebounce.ts
    ├── useLocalStorage.ts
    └── useValidate.ts

components/         # 🎨 UI 컴포넌트 계층
├── CartPage.tsx    → 쇼핑몰 메인 페이지
├── AdminPage.tsx   → 관리자 페이지
├── ui/            → 재사용 UI 컴포넌트
└── icons/         → 아이콘 컴포넌트

utils/             # 🛠️ 순수 유틸리티 계층
├── formatters.ts   → 데이터 포맷팅
└── validators.ts   → 유효성 검증

constants/         # 📋 상수 정의
└── index.ts       → 초기 데이터, 설정값
```

## 💡 핵심 설계 원칙

### 1️⃣ 엔티티 기반 분리

- **엔티티 관련**: Cart, Product, Coupon 도메인 로직
- **UI 전용**: Button, Toast, Modal 등 재사용 컴포넌트
- **유틸리티**: formatters, validators 등 순수 함수

### 2️⃣ 순수 함수 우선 (models/)

```typescript
// ✅ 부작용 없는 순수 함수들
calculateItemTotal(item: CartItem): number
getMaxApplicableDiscount(item: CartItem): number
calculateCartTotal(cart: CartItem[], coupon?: Coupon): CartTotal
updateCartItemQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[]
```

### 3️⃣ Container-Presenter 패턴

- **Container (hooks)**: 상태 관리 + 비즈니스 로직 처리
- **Presenter (components)**: UI 렌더링 + 이벤트 위임

### 4️⃣ Props 설계 차별화

- **UI 컴포넌트**: 재사용성을 위한 이벤트 핸들러 props
- **엔티티 컴포넌트**: 엔티티 중심의 데이터 props, 내부 상태관리

## 📈 과제 단계별 목표

### 📝 Basic 과제

**목표**: 컴포넌트 분리 + 커스텀 훅 + 유틸 함수 분리  
**제약**: 전역 상태관리 사용 금지 (props drilling 허용)  
**핵심 학습**: 계층별 책임 분리, 순수함수 설계

**구현할 주요 함수들**:

- `calculateItemTotal` - 개별 아이템 할인 적용 후 총액
- `getMaxApplicableDiscount` - 적용 가능한 최대 할인율
- `calculateCartTotal` - 장바구니 총액 (할인 전/후, 할인액)
- `updateCartItemQuantity` - 수량 변경

### 🚀 Advanced 과제

**목표**: Props Drilling 제거  
**선택지**: Context API 또는 Jotai 사용  
**핵심 학습**: 전역 상태관리, 엔티티 vs UI 컴포넌트 Props 차별화

**Props 설계 가이드**:

- **UI 컴포넌트**: 이벤트 핸들러를 props로 받아 재사용성 확보
- **엔티티 컴포넌트**: 전역 상태 활용으로 props 최소화

## 🧪 테스트 전략

### 테스트 환경

- **프레임워크**: Vitest + Testing Library
- **설정**: jsdom 환경, 각 단계별 독립 테스트

### 핵심 테스트 케이스

- ✅ 상품 추가/삭제/수량 변경
- ✅ 할인 계산 정확성 검증
- ✅ 쿠폰 적용 로직 검증
- ✅ 재고 관리 기능
- ✅ 관리자 상품/쿠폰 관리

### 테스트 명령어

```bash
npm run test:origin     # 원본 기능 테스트
npm run test:basic      # Basic 과제 테스트
npm run test:advanced   # Advanced 과제 테스트
```

## 🏆 기대 효과

### 🔧 리팩토링 전

- 1,123줄 단일 파일
- 테스트 불가능한 구조
- 높은 유지보수 비용
- 낮은 재사용성

### ✨ 리팩토링 후

- 18개 파일로 책임 분산
- 단위 테스트 가능한 순수 함수
- 명확한 계층별 책임 분리
- 높은 코드 재사용성

## 📋 개발 가이드라인

### 🎯 권장 학습 순서

1. **힌트 파일 분석** → 목표 아키텍처 이해
2. **origin 코드 분석** → 현재 문제점 파악
3. **basic 구현** → 계층별 분리 연습
4. **advanced 구현** → 상태관리 패턴 학습

### 🔍 주요 학습 포인트

- **SRP 적용**: 각 파일의 단일 책임 원칙
- **순수 함수**: 부작용 없는 비즈니스 로직 설계
- **커스텀 훅**: 상태와 부작용 캡슐화
- **엔티티 설계**: 도메인 중심 사고

### 🚀 개발 명령어

```bash
# 개발 서버 실행
npm run start:origin    # 원본 코드 실행
npm run start:basic     # Basic 과제 실행
npm run start:advanced  # Advanced 과제 실행

# 테스트 & 빌드
npm run test           # 전체 테스트
npm run test:ui        # UI 테스트
npm run build          # 프로덕션 빌드
npm run lint           # 코드 린팅
```

## 🎓 학습 목표 달성 지표

### ✅ Basic 과제 완료 기준

- [ ] 18개 힌트 파일 구조로 분리 완료
- [ ] 모든 테스트 케이스 통과
- [ ] 순수 함수로 비즈니스 로직 분리
- [ ] 커스텀 훅으로 상태 관리 캡슐화

### ✅ Advanced 과제 완료 기준

- [ ] Props drilling 완전 제거
- [ ] Context 또는 Jotai 적용
- [ ] 엔티티 vs UI 컴포넌트 Props 차별화
- [ ] 모든 테스트 케이스 통과

---

## ⚙️ 개인 맞춤 개발 룰

### 🎯 개발 철학 및 우선순위

**핵심 가치 (중요도 순)**:

1. **아키텍처 설계 감각** - 전체적인 구조와 흐름 이해
2. **단일책임원칙(SRP)** - 각 요소가 하나의 명확한 역할
3. **순수함수 설계** - 예측 가능하고 테스트 가능한 로직
4. **상태관리 패턴** - 효율적인 데이터 흐름 설계
5. **커스텀훅 활용** - 로직 재사용과 캡슐화

**개발 시 우선순위 (시간 부족 시)**:

1. **깔끔한 코드 구조** - 가독성과 유지보수성
2. **타입 안전성** - 컴파일 타임 에러 방지
3. **상세한 문서화** - 코드 의도와 사용법 명시
4. **포괄적인 테스트** - 기능 동작 보장
5. **성능 최적화** - 사용자 경험 개선

### 🔧 코딩 스타일 가이드

#### **함수형 프로그래밍 우선**

```typescript
// ✅ 선호: 함수형 접근
const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

// ❌ 지양: 명령형 접근
let total = 0;
for (const item of items) {
  total += calculateItemTotal(item);
}
```

#### **화살표 함수 선호**

```typescript
// ✅ 선호
const handleAddToCart = (productId: string) => {
  // 구현
};

// ❌ 지양
function handleAddToCart(productId: string) {
  // 구현
}
```

#### **ES6+ 최신 문법 적극 활용**

**구조 분해 할당 (Destructuring)**

```typescript
// ✅ 객체 구조 분해
const { name, price, stock } = product;
const { cart, addToCart, updateQuantity } = useCart();

// ✅ 배열 구조 분해
const [isLoading, setIsLoading] = useState(false);
const [first, ...rest] = products;

// ❌ 직접 접근
const name = product.name;
const price = product.price;
const isLoading = cartState[0];
```

**전개 연산자 (Spread Operator)**

```typescript
// ✅ 배열/객체 복사 및 병합
const newCart = [...cart, newItem];
const updatedProduct = { ...product, stock: product.stock - 1 };
const allItems = [...cartItems, ...wishlistItems];

// ✅ 함수 매개변수 전개
const calculateTotal = (...prices: number[]) => 
  prices.reduce((sum, price) => sum + price, 0);

// ❌ 기존 방식
const newCart = cart.concat([newItem]);
const updatedProduct = Object.assign({}, product, { stock: product.stock - 1 });
```

**템플릿 리터럴 (Template Literals)**

```typescript
// ✅ 템플릿 리터럴 활용
const priceDisplay = `₩${price.toLocaleString()}`;
const itemSummary = `${product.name} (₩${price}) x ${quantity}`;
const multilineTemplate = `
  주문 내역:
  - 상품: ${product.name}
  - 수량: ${quantity}개
  - 총액: ₩${total.toLocaleString()}
`;

// ❌ 문자열 연결
const priceDisplay = '₩' + price.toLocaleString();
const itemSummary = product.name + ' (₩' + price + ') x ' + quantity;
```

**옵셔널 체이닝 & Nullish 병합**

```typescript
// ✅ 안전한 프로퍼티 접근
const discountRate = product?.discounts?.[0]?.rate ?? 0;
const userName = user?.profile?.name ?? '게스트';
const cartCount = cart?.length ?? 0;

// ✅ 조건부 메서드 호출
product?.onSale?.() && showSaleBadge();

// ❌ 기존 방식 (장황함)
const discountRate = product && product.discounts && product.discounts[0] 
  ? product.discounts[0].rate : 0;
```

**배열 메서드 체이닝**

```typescript
// ✅ 함수형 배열 처리
const validItems = cart
  .filter(item => item.product.stock > 0)
  .map(item => ({ ...item, total: calculateItemTotal(item) }))
  .sort((a, b) => b.total - a.total);

const totalPrice = cart
  .filter(item => item.quantity > 0)
  .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

// ✅ 최신 배열 메서드 활용
const hasOutOfStock = cart.some(item => item.product.stock === 0);
const allInStock = cart.every(item => item.product.stock > 0);
const expensiveItem = cart.find(item => item.product.price > 100000);
```

**단축 프로퍼티 & 메서드**

```typescript
// ✅ 단축 프로퍼티 문법
const createCartItem = (product: Product, quantity: number) => ({
  product,    // product: product 대신
  quantity,   // quantity: quantity 대신
  id: generateId(),
  total: product.price * quantity
});

// ✅ 계산된 프로퍼티 이름
const createFilteredProducts = (products: Product[], filterType: string) => ({
  [`${filterType}Products`]: products.filter(/* 조건 */)
});
```

**동적 Import & 모듈**

```typescript
// ✅ 동적 import (코드 스플리팅)
const LazyAdminPage = lazy(() => import('@/components/AdminPage'));

// ✅ Named exports 활용
export const useCart = () => { /* ... */ };
export const useProducts = () => { /* ... */ };
export { calculateTotal, getMaxDiscount };

// ✅ Re-exports 패턴
export { useCart } from './hooks/useCart';
export { ProductCard } from './components/ProductCard';
```

**Promise & Async/Await**

```typescript
// ✅ Async/Await 패턴
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw error;
  }
};

// ✅ Promise 병렬 처리
const loadInitialData = async () => {
  const [products, coupons, user] = await Promise.all([
    fetchProducts(),
    fetchCoupons(),
    fetchUserProfile()
  ]);
  return { products, coupons, user };
};
```

#### **타이핑 전략: 상황별 혼합**

```typescript
// ✅ 매개변수와 복잡한 반환값은 명시적
const processCart = (items: CartItem[]): CartSummary => {
  const total = calculateTotal(items); // number 추론
  const discount = getDiscount(total); // number 추론
  return { total, discount, finalAmount: total - discount };
};

// ✅ 간단한 변수는 추론 활용
const [isLoading, setIsLoading] = useState(false); // boolean 추론
const products = await fetchProducts(); // Product[] 추론
```

### 🏗️ 컴포넌트 설계 원칙

#### **단일 책임 기반 작은 컴포넌트**

```typescript
// ✅ 좋은 예: 각각 명확한 책임
const ProductCard = ({ product, onAddToCart }) => {
  /* 상품 표시만 */
};
const AddToCartButton = ({ onAdd, disabled }) => {
  /* 버튼 동작만 */
};
const PriceDisplay = ({ price, discount }) => {
  /* 가격 표시만 */
};

// ❌ 나쁜 예: 여러 책임 혼재
const ProductSection = () => {
  // 상품 표시 + 장바구니 추가 + 가격 계산 + 상태 관리...
};
```

#### **Props 설계: 맥락에 따른 선택**

```typescript
// 엔티티 컴포넌트: 구체적 설계
interface CartItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

// UI 컴포넌트: 유연한 설계
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: MouseEvent) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}
```

#### **재사용성 vs 가독성**

- **원칙**: 가독성 우선, 3회 이상 반복 시 재사용 고려
- **판단 기준**: 추상화로 인한 복잡성 < 중복 제거의 이익

### 📁 아키텍처 선택사항

#### **폴더 구조**

```
src/
├── components/     # 타입별 폴더 구조 (기능별 X)
├── hooks/
├── models/
├── utils/
└── constants/
```

#### **Import 전략**

```typescript
// ✅ 절대 경로 선호
import { calculateTotal } from '@/models/cart';
import { ProductCard } from '@/components/ProductCard';

// ❌ 상대 경로 지양
import { calculateTotal } from '../../../models/cart';
```

#### **Barrel Exports 사용 안함**

- **이유**: 번들링 성능 이슈, 개발 시 추적 어려움
- **대신**: 직접 import로 명확한 의존성 표현

#### **상태관리: Jotai 선호**

```typescript
// ✅ Jotai: 간단하고 효율적
const cartAtom = atom<CartItem[]>([]);
const useCart = () => useAtom(cartAtom);

// ❌ Context API: Provider 지옥과 불필요한 리렌더링
```

### 🔍 코드 리뷰 체크리스트

**우선순위별 검토 항목**:

#### **1순위: 네이밍 (가장 중요)**

```typescript
// ✅ 명확하고 의도가 드러나는 이름
const calculateDiscountedPrice = (price: number, discountRate: number) =>
  price * (1 - discountRate);

const handleAddToCart = (product: Product) => {
  /* 장바구니 추가 */
};

// ❌ 모호하거나 축약된 이름
const calc = (p: number, d: number) => p * (1 - d);
const handle = (data: any) => {
  /* 무엇을 하는지 불명확 */
};
```

#### **2순위: 함수 길이 및 복잡성**

```typescript
// ✅ 단일 책임으로 분리
const validateProduct = (product: Product) => {
  /* 5줄 */
};
const calculateDiscount = (cart: CartItem[]) => {
  /* 8줄 */
};
const processOrder = (cart: CartItem[], coupon?: Coupon) => {
  const validProducts = validateProduct(cart);
  const discount = calculateDiscount(validProducts);
  return createOrder(validProducts, discount, coupon);
};

// ❌ 복잡하고 긴 로직 (가장 피하고 싶은 패턴)
const processEverything = () => {
  // 50줄의 검증 + 계산 + 처리 로직...
};
```

#### **3순위: 중복 코드 제거**

```typescript
// ✅ 공통 함수 추출
const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

// ❌ 동일 로직 반복
const formatPrice1 = (price) => `₩${price.toLocaleString()}`;
const formatPrice2 = (amount) => `₩${amount.toLocaleString()}`;
```

#### **4순위: 에러 처리**

```typescript
// ✅ 방어적 프로그래밍
const getProductPrice = (product: Product | null): number => {
  if (!product || typeof product.price !== 'number') {
    throw new Error('Invalid product data');
  }
  return product.price;
};

// ❌ 위험한 접근
const getProductPrice = (product) => product.price; // null/undefined 위험
```

#### **5순위: 성능 최적화**

```typescript
// ✅ 필요 시 메모이제이션
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => heavyCalculation(data), [data]);
  return <div>{processedData}</div>;
};
```

### 📏 코드 품질 기준

#### **품질 지표: 정량적 기준보다 정성적 원칙**

- **함수 길이**: 줄 수보다 **단일 책임 준수** 여부
- **Props 개수**: 개수보다 **관심사 분리** 정도
- **파일 길이**: 줄 수보다 **응집도와 결합도** 균형

#### **ESLint 설정: 엄격한 룰 적용**

```json
{
  "extends": ["@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### **주석 스타일: 인라인 우선**

```typescript
// ✅ 간결한 인라인 주석
const total = price * quantity; // 할인 전 총액
const discountRate = getMaxDiscount(item.discounts); // 최대 할인율 적용

// ❌ 과도한 JSDoc (라이브러리가 아닌 이상 지양)
/**
 * 할인 전 총액을 계산합니다
 * @param price 상품 가격
 * @param quantity 수량
 * @returns 총액
 */
const total = price * quantity;
```

### 🎯 학습 목표 우선순위

이 프로젝트를 통해 다음 순서로 학습 역량을 키워나가세요:

1. **전체적인 아키텍처 설계 감각** - 숲을 보는 능력
2. **단일책임원칙(SRP) 체득** - 나무를 보는 능력
3. **순수함수 설계 패턴** - 예측 가능한 코드 작성
4. **상태관리 패턴** - 효율적인 데이터 흐름
5. **커스텀훅 활용법** - 로직 캡슐화와 재사용

**이 프로젝트를 통해 React의 추구미, 단일 책임 원칙, 함수형 프로그래밍, 상태 관리 패턴을 체계적으로 학습할 수 있습니다.**
