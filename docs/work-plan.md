# Basic 과제 단계별 리팩토링 계획 (2024-08-04)

## 개요

단일책임원칙을 위반한 거대한 컴포넌트(`src/basic/App.tsx`)를 요구사항에 맞춰 단계별로 리팩토링하는 계획입니다.

## 핵심 요구사항

- **상태관리**: useState, useEffect만 사용 (라이브러리 사용 금지)
- **분리 대상**: 계산 함수, Hook, 컴포넌트 계층구조
- **테스트**: 모든 테스트 케이스 통과 필수
- **원칙**: 단일 책임 원칙(SRP) 준수

## 현재 문제점 분석

현재 App.tsx는 다음과 같은 책임들을 모두 가지고 있습니다:

- 상품 관리 (CRUD)
- 장바구니 관리
- 쿠폰 관리
- UI 렌더링
- 계산 로직
- 상태 관리
- 이벤트 처리

## 단계별 리팩토링 계획 (난이도 낮은 순)

### 1단계: 계산 함수 분리 (가장 쉬움) ⭐

**목표**: 순수 함수들을 분리하여 테스트 가능성 향상

**파일**: `utils/calculators.ts`

```typescript
export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return Math.round(price * quantity * (1 - discount));
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  return baseDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
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

### 2단계: 유틸리티 함수 분리 ⭐⭐

**목표**: 포맷팅, 검증 등 유틸리티 함수 분리

**파일**: `utils/formatters.ts`, `utils/validators.ts`

```typescript
// utils/formatters.ts
export const formatPrice = (
  price: number,
  isAdmin: boolean = false
): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  return `₩${price.toLocaleString()}`;
};

// utils/validators.ts
export const validateProductForm = (form: ProductForm): string[] => {
  const errors: string[] = [];
  if (!form.name.trim()) errors.push('상품명은 필수입니다');
  if (form.price <= 0) errors.push('가격은 0보다 커야 합니다');
  if (form.stock < 0) errors.push('재고는 0 이상이어야 합니다');
  return errors;
};
```

### 3단계: useLocalStorage Hook 분리 ⭐⭐⭐

**목표**: 로컬 스토리지 관리 로직 분리

**파일**: `hooks/useLocalStorage.ts`

```typescript
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

### 4단계: 엔티티별 Hook 분리 ⭐⭐⭐⭐

**목표**: 각 엔티티의 상태 관리 로직 분리

**파일들**: `hooks/useCart.ts`, `hooks/useProducts.ts`, `hooks/useCoupons.ts`

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

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  return { cart, addToCart, removeFromCart, updateQuantity };
};

// hooks/useProducts.ts
export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>(
    'products',
    initialProducts
  );

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct };
};

// hooks/useCoupons.ts
export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons(prev => [...prev, newCoupon]);
  }, []);

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon]
  );

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
  };
};
```

### 5단계: UI 컴포넌트 분리 ⭐⭐⭐⭐⭐

**목표**: 재사용 가능한 UI 컴포넌트 분리

**파일들**: `components/ui/Button.tsx`, `components/ui/Notification.tsx`

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// components/ui/Notification.tsx
interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: () => void;
}

export const Notification = ({ message, type, onClose }: NotificationProps) => {
  const bgColor = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600'
  }[type];

  return (
    <div className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${bgColor}`}>
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
```

### 6단계: 엔티티 컴포넌트 분리 ⭐⭐⭐⭐⭐⭐

**목표**: 비즈니스 로직을 가진 엔티티 컴포넌트 분리

**파일들**: `components/ProductCard.tsx`, `components/CartItem.tsx`

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
}

export const ProductCard = ({ product, onAddToCart, getRemainingStock, formatPrice }: ProductCardProps) => {
  const remainingStock = getRemainingStock(product);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price, product.id)}</p>

        <button
          onClick={() => onAddToCart(product)}
          disabled={remainingStock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            remainingStock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
};

// components/CartItem.tsx
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  calculateItemTotal: (item: CartItem) => number;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove, calculateItemTotal }: CartItemProps) => {
  const itemTotal = calculateItemTotal(item);

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button onClick={() => onRemove(item.product.id)} className="text-gray-400 hover:text-red-500 ml-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {itemTotal.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};
```

### 7단계: 페이지 컴포넌트 분리 (가장 어려움) ⭐⭐⭐⭐⭐⭐⭐

**목표**: 큰 단위의 페이지 컴포넌트 분리

**파일들**: `components/pages/ShoppingPage.tsx`, `components/pages/AdminPage.tsx`

```typescript
// components/pages/ShoppingPage.tsx
export const ShoppingPage = () => {
  const { products } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { selectedCoupon, setSelectedCoupon, coupons } = useCoupons();
  const { addNotification } = useNotifications();

  const getRemainingStock = useCallback((product: Product) => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }, [cart]);

  const formatPrice = useCallback((price: number, productId?: string) => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return `₩${price.toLocaleString()}`;
  }, [products, getRemainingStock]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          onAddToCart={addToCart}
          getRemainingStock={getRemainingStock}
          formatPrice={formatPrice}
        />
      </div>
      <div className="lg:col-span-1">
        <CartSidebar
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          selectedCoupon={selectedCoupon}
          onApplyCoupon={setSelectedCoupon}
          coupons={coupons}
        />
      </div>
    </div>
  );
};
```

## 최종 파일 구조 (예상)

```
src/basic/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Notification.tsx
│   ├── ProductCard.tsx
│   ├── CartItem.tsx
│   ├── ProductList.tsx
│   ├── CartSidebar.tsx
│   └── pages/
│       ├── ShoppingPage.tsx
│       └── AdminPage.tsx
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useCoupons.ts
│   ├── useLocalStorage.ts
│   └── useNotifications.ts
├── utils/
│   ├── calculators.ts
│   ├── formatters.ts
│   └── validators.ts
└── App.tsx
```

## 최종 파일 구조 (실제)

```
src/basic/
├── App.tsx                           # 메인 앱 컴포넌트 (182줄)
├── main.tsx                          # 앱 진입점
├── types.ts                          # 타입 정의
├── __tests__/                        # 테스트 파일들
├── components/                       # 컴포넌트 계층
│   ├── ui/                          # UI 컴포넌트 (재사용 가능)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Notification.tsx
│   │   └── index.ts
│   ├── layout/                      # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Navigation.tsx
│   │   ├── CartIcon.tsx
│   │   └── index.ts
│   └── pages/                       # 페이지 컴포넌트
│       ├── index.ts
│       ├── shopping/                # 쇼핑 페이지 도메인
│       │   ├── ShoppingPage.tsx
│       │   ├── index.ts
│       │   ├── product/             # 쇼핑용 상품 컴포넌트
│       │   │   ├── ProductCard.tsx
│       │   │   ├── ProductList.tsx
│       │   │   └── index.ts
│       │   └── cart/                # 쇼핑용 장바구니 컴포넌트
│       │       ├── CartItem.tsx
│       │       ├── CartSidebar.tsx
│       │       └── index.ts
│       └── admin/                   # 관리자 페이지 도메인
│           ├── AdminPage.tsx
│           ├── AdminHeader.tsx
│           ├── ProductManagement.tsx
│           ├── CouponManagement.tsx
│           ├── index.ts
│           ├── product/             # 관리자용 상품 컴포넌트
│           │   ├── ProductForm.tsx
│           │   ├── ProductTable.tsx
│           │   ├── AddProductButton.tsx
│           │   └── index.ts
│           └── coupon/              # 관리자용 쿠폰 컴포넌트
│               ├── CouponCard.tsx
│               ├── CouponForm.tsx
│               ├── AddCouponButton.tsx
│               └── index.ts
├── hooks/                           # Custom Hooks (9개)
│   ├── useLocalStorage.ts
│   ├── useNotifications.ts
│   ├── useDebounce.ts
│   ├── useSearch.ts
│   ├── useCoupon.ts
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useUIStates.ts
│   └── useCouponForm.ts
├── services/                        # 도메인 서비스 (3개)
│   ├── productService.ts
│   ├── cartService.ts
│   └── couponService.ts
└── utils/                          # 유틸리티 함수들
    ├── calculators.ts
    ├── formatters.ts
    ├── validators.ts
    ├── filters.ts
    └── generators.ts
```

## 요구사항 체크리스트

- ✅ **계산 함수 분리**: `calculateItemTotal`, `getMaxApplicableDiscount`, `calculateCartTotal`
- ✅ **Hook 분리**: `useCart`, `useCoupon`, `useProduct`, `useLocalStorage`
- ✅ **컴포넌트 분리**: `ProductCard`, `Cart` 등 엔티티/UI 컴포넌트 분리
- ✅ **상태관리 제약**: useState, useEffect만 사용
- ✅ **단일 책임 원칙**: 각 컴포넌트/함수는 하나의 책임만

## 개발 가이드

1. **1-3단계 먼저**: 유틸리티 함수와 Hook 분리 (기능 영향 없음)
2. **4-6단계**: 컴포넌트 분리 (점진적 리팩토링)
3. **7단계**: 페이지 분리 (최종 구조화)
4. **각 단계마다 테스트**: 기능이 정상 작동하는지 확인

이렇게 단계별로 진행하면 요구사항에 맞는 안전한 리팩토링이 가능합니다.
