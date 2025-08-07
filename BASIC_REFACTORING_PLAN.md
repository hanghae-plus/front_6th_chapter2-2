# 📋 **Basic 과제 세분화된 실행 계획**

## 🎯 **전체 목적과 의도**

### **핵심 목적**
- **거대한 1,123줄 컴포넌트**를 **18개 파일로 체계적 분리**
- **SRP(단일책임원칙)** 체득 → 각 파일이 명확한 하나의 책임만
- **함수형 프로그래밍** 패러다임 적용 → 순수함수 기반 비즈니스 로직
- **테스트 가능한 구조** 구축 → 각 계층별 독립적 테스트

### **학습 의도**
1. **아키텍처 설계 감각** - 전체 구조를 보는 눈
2. **계층별 책임 분리** - models/hooks/components/utils 역할 이해
3. **엔티티 vs UI 구분** - 도메인 로직과 UI 로직의 분리
4. **커스텀 훅 활용** - 상태와 부작용 캡슐화

### **목표 아키텍처 (18개 파일)**

```
📁 models/           # 🧮 순수 비즈니스 로직 (4개)
├── cart.ts         → calculateItemTotal, updateCartItemQuantity
├── product.ts      → getRemainingStock, 상품 로직
├── coupon.ts       → 쿠폰 적용 로직
└── discount.ts     → getMaxApplicableDiscount

📁 hooks/            # 🔄 상태 관리 (3개)  
├── useCart.ts      → 장바구니 상태 + localStorage
├── useProducts.ts  → 상품 상태 + localStorage
└── useCoupons.ts   → 쿠폰 상태 + localStorage

📁 utils/            # 🛠️ 유틸리티 (4개)
├── formatters.ts   → formatPrice, 포맷 함수들
├── validators.ts   → 유효성 검증
└── hooks/          → useDebounce, useLocalStorage, useValidate

📁 components/       # 🎨 UI 계층 (4개)
├── CartPage.tsx    → 쇼핑몰 메인 페이지
├── AdminPage.tsx   → 관리자 페이지  
├── ui/Toast.tsx   → 알림 컴포넌트
└── icons/index.tsx → 아이콘 컴포넌트

📁 기타 (3개)
├── App.tsx         → 라우팅만 담당
├── constants/      → 초기 데이터
└── main.tsx        → 진입점
```

---

## 🧮 **Phase 1: Foundation - 순수 함수 분리**

**의도**: 테스트 가능한 비즈니스 로직부터 분리

### **1-1. models/cart.ts 생성**

#### **Step 1-1-1: 파일 생성 및 기본 구조**
```typescript
// src/basic/models/cart.ts 생성
// 필요한 타입 import
import { CartItem, Product } from '../types';
```

#### **Step 1-1-2: calculateItemTotal 함수 추출**
```typescript
// Original App.tsx의 161-167줄에서 추출
export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item); // 일단 임시로 0
  return Math.round(price * quantity * (1 - discount));
};
```

**참고**: `getMaxApplicableDiscount`는 아직 구현 전이므로 임시로 0 반환하도록 처리

#### **Step 1-1-3: updateCartItemQuantity 함수 추출**
```typescript
// Original App.tsx의 장바구니 수량 변경 로직에서 추출
export const updateCartItemQuantity = (
  cart: CartItem[], 
  productId: string, 
  quantity: number
): CartItem[] => {
  return cart.map(item => 
    item.product.id === productId 
      ? { ...item, quantity }
      : item
  ).filter(item => item.quantity > 0);
};
```

**완료 기준**: 
- [ ] TypeScript 컴파일 에러 없음
- [ ] 순수함수 원칙 준수 (부작용 없음)

### **1-2. models/discount.ts 생성**

#### **Step 1-2-1: 파일 생성 및 getMaxApplicableDiscount 추출**
```typescript
// src/basic/models/discount.ts 생성
// Original App.tsx의 143-159줄에서 추출
import { CartItem } from '../types';

export const getMaxApplicableDiscount = (
  item: CartItem, 
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 시 추가 5% 할인 (cart 매개변수 활용)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};
```

**완료 기준**:
- [ ] cart 매개변수를 통한 대량구매 판단 로직 포함
- [ ] 순수함수로 구현 (외부 상태 의존 없음)

### **1-3. models/product.ts 생성**

#### **Step 1-3-1: getRemainingStock 함수 추출**
```typescript
// src/basic/models/product.ts 생성
// Original App.tsx의 198-203줄에서 추출
import { Product, CartItem } from '../types';

export const getRemainingStock = (
  product: Product, 
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
};
```

**완료 기준**:
- [ ] product와 cart를 모두 매개변수로 받음
- [ ] 재고 계산 로직이 정확함

### **1-4. utils/formatters.ts 생성**

#### **Step 1-4-1: formatPrice 함수 개선 후 추출**
```typescript
// src/basic/utils/formatters.ts 생성
// Original App.tsx의 128-141줄을 개선하여 추출
interface FormatPriceOptions {
  isAdmin?: boolean;
  isSoldOut?: boolean;
}

export const formatPrice = (
  price: number, 
  options: FormatPriceOptions = {}
): string => {
  const { isAdmin = false, isSoldOut = false } = options;
  
  if (isSoldOut) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
```

#### **Step 1-4-2: 추가 포맷터 함수들**
```typescript
export const formatCurrency = (amount: number): string => {
  return `₩${amount.toLocaleString()}`;
};

export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
```

**완료 기준**:
- [ ] isAdmin 조건을 매개변수로 받도록 개선
- [ ] 옵션 객체 패턴 적용
- [ ] 재사용 가능한 포맷터 함수들 구현

### **Phase 1 테스트**
- [ ] 각 models 함수들이 독립적으로 실행 가능
- [ ] TypeScript 컴파일 에러 없음
- [ ] 순수함수 원칙 준수 (같은 입력 → 같은 출력)
- [ ] models/cart.ts에서 getMaxApplicableDiscount 함수 import 후 정상 동작

---

## 🔄 **Phase 2: State Management - 상태 관리 분리**

**의도**: 상태와 부작용을 커스텀 훅으로 캡슐화

### **2-1. utils/hooks/useLocalStorage.ts 생성**

#### **Step 2-1-1: 기본 useLocalStorage 훅**
```typescript
// src/basic/utils/hooks/useLocalStorage.ts 생성
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  // 초기값 로딩 시 try-catch 에러 처리
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 변경 시 localStorage 자동 저장
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (value === null || value === undefined || 
          (Array.isArray(value) && value.length === 0)) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

**완료 기준**:
- [ ] 타입 안전성 보장 (`<T>` 제네릭)
- [ ] JSON.parse 에러 처리
- [ ] 빈 배열일 때 localStorage에서 제거
- [ ] 메모리 누수 방지

### **2-2. utils/hooks/useDebounce.ts 생성**

#### **Step 2-2-1: 기본 debounce 훅**
```typescript
// src/basic/utils/hooks/useDebounce.ts 생성
// Original App.tsx의 240-245줄 로직 활용
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수로 이전 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**완료 기준**:
- [ ] setTimeout을 사용한 지연 처리
- [ ] cleanup으로 메모리 누수 방지
- [ ] 제네릭 타입 지원

### **2-3. hooks/useCart.ts 생성 (가장 복잡)**

#### **Step 2-3-1: 기본 구조 및 상태**
```typescript
// src/basic/hooks/useCart.ts 생성
import { useCallback } from 'react';
import { CartItem, Product } from '../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { calculateItemTotal, updateCartItemQuantity } from '../models/cart';
import { getRemainingStock } from '../models/product';
import { getMaxApplicableDiscount } from '../models/discount';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  
  // 다음 단계에서 구현할 함수들의 기본 구조
  const addToCart = useCallback((product: Product) => {
    // 구현 예정
  }, [cart]);

  const removeFromCart = useCallback((productId: string) => {
    // 구현 예정
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    // 추가 함수들...
  };
}
```

#### **Step 2-3-2: addToCart 구현**
```typescript
const addToCart = useCallback((product: Product) => {
  const remainingStock = getRemainingStock(product, cart);
  
  if (remainingStock <= 0) {
    // 알림 로직은 나중에 추가
    console.warn('재고가 부족합니다.');
    return;
  }

  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // 기존 아이템 수량 증가
      return updateCartItemQuantity(prevCart, product.id, existingItem.quantity + 1);
    } else {
      // 새 아이템 추가
      return [...prevCart, { product, quantity: 1 }];
    }
  });
}, [cart]);
```

#### **Step 2-3-3: removeFromCart 구현**
```typescript
const removeFromCart = useCallback((productId: string) => {
  setCart(prevCart => 
    prevCart.filter(item => item.product.id !== productId)
  );
}, []);
```

#### **Step 2-3-4: updateQuantity 구현**
```typescript
const updateQuantity = useCallback((productId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  setCart(prevCart => updateCartItemQuantity(prevCart, productId, quantity));
}, [removeFromCart]);
```

#### **Step 2-3-5: calculateTotal 구현**
```typescript
const calculateTotal = useCallback(() => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
  });

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
}, [cart]);
```

**참고**: 쿠폰 적용 로직은 useCoupons와 연계 후 구현

#### **Step 2-3-6: 반환값 정리**
```typescript
return {
  cart,
  addToCart,
  removeFromCart, 
  updateQuantity,
  calculateTotal,
  clearCart: () => setCart([]),
  getTotalItemCount: () => cart.reduce((sum, item) => sum + item.quantity, 0)
};
```

**완료 기준**:
- [ ] useLocalStorage 활용하여 상태 영속화
- [ ] models 함수들을 조합하여 비즈니스 로직 구현
- [ ] 불변성을 지키는 상태 업데이트
- [ ] useCallback으로 성능 최적화

### **2-4. hooks/useProducts.ts 생성**

#### **Step 2-4-1: 기본 상품 상태 관리**
```typescript
// src/basic/hooks/useProducts.ts 생성
import { useCallback, useState, useMemo } from 'react';
import { Product } from '../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { useDebounce } from '../utils/hooks/useDebounce';

// constants에서 가져올 예정
const initialProducts: Product[] = [
  // 초기 상품 데이터
];

export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`, // 간단한 ID 생성
    };
    setProducts(prev => [...prev, newProduct]);
  }, [setProducts]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, [setProducts]);

  return { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    searchTerm,
    setSearchTerm
  };
}
```

#### **Step 2-4-2: 검색 기능 통합**
```typescript
// useProducts 함수 내부에 추가
const filteredProducts = useMemo(() => {
  if (!debouncedSearchTerm) return products;
  
  return products.filter(product =>
    product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (product.description && 
     product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );
}, [products, debouncedSearchTerm]);

return { 
  // ... 기존 반환값
  filteredProducts 
};
```

**완료 기준**:
- [ ] CRUD 기능 완전 구현
- [ ] 검색 기능과 debounce 적용
- [ ] 불변성 지키는 상태 업데이트

### **2-5. hooks/useCoupons.ts 생성**

#### **Step 2-5-1: 기본 쿠폰 상태 관리**
```typescript
// src/basic/hooks/useCoupons.ts 생성
import { useCallback, useState } from 'react';
import { Coupon } from '../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

// constants에서 가져올 예정
const initialCoupons: Coupon[] = [
  // 초기 쿠폰 데이터
];

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const addCoupon = useCallback((couponData: Coupon) => {
    setCoupons(prev => [...prev, couponData]);
  }, [setCoupons]);

  const deleteCoupon = useCallback((code: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.code !== code));
    // 삭제된 쿠폰이 선택되어 있다면 해제
    if (selectedCoupon?.code === code) {
      setSelectedCoupon(null);
    }
  }, [setCoupons, selectedCoupon]);

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  const calculateCouponDiscount = useCallback((totalAmount: number) => {
    if (!selectedCoupon) return 0;

    if (selectedCoupon.discountType === 'amount') {
      return Math.min(selectedCoupon.discountValue, totalAmount);
    } else {
      return Math.round(totalAmount * (selectedCoupon.discountValue / 100));
    }
  }, [selectedCoupon]);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    calculateCouponDiscount
  };
}
```

**완료 기준**:
- [ ] 쿠폰 CRUD 기능
- [ ] 쿠폰 선택/해제 기능
- [ ] 쿠폰 할인 계산 기능
- [ ] 삭제된 쿠폰 자동 해제

### **Phase 2 테스트**
- [ ] 각 훅이 독립적으로 동작
- [ ] localStorage 자동 저장/로딩
- [ ] 상태 변경이 예측 가능
- [ ] 메모리 누수 없음
- [ ] useCart와 useCoupons 연동 테스트

---

## 🎨 **Phase 3: UI Separation - 컴포넌트 분리**

**의도**: 거대한 JSX를 책임별로 분리

### **3-1. constants/index.ts 생성 (사전 작업)**

#### **Step 3-1-1: 초기 데이터 분리**
```typescript
// src/basic/constants/index.ts 생성
import { Product, Coupon } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  // ... 나머지 상품들
];

export const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  // ... 나머지 쿠폰들
];
```

### **3-2. components/ui/Toast.tsx 생성**

#### **Step 3-2-1: 알림 시스템 컴포넌트**
```typescript
// src/basic/components/ui/Toast.tsx 생성
interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface ToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const Toast = ({ notifications, onRemove }: ToastProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
            notif.type === 'error'
              ? 'bg-red-600'
              : notif.type === 'warning'
                ? 'bg-yellow-600'
                : 'bg-green-600'
          }`}
        >
          <span className="mr-2">{notif.message}</span>
          <button
            onClick={() => onRemove(notif.id)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
```

### **3-3. components/icons/index.tsx 생성**

#### **Step 3-3-1: 아이콘 컴포넌트들**
```typescript
// src/basic/components/icons/index.tsx 생성
export const CartIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
```

### **3-4. components/CartPage.tsx 생성**

#### **Step 3-4-1: 기본 구조 및 훅 연결**
```typescript
// src/basic/components/CartPage.tsx 생성
import React, { useState, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import { Toast } from './ui/Toast';
import { CartIcon } from './icons';
import { formatPrice } from '../utils/formatters';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const CartPage = () => {
  const cart = useCart();
  const products = useProducts();
  const coupons = useCoupons();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  const handleAddToCart = (product: Product) => {
    cart.addToCart(product);
    addNotification(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  // 기본 JSX 구조
  return (
    <div>
      <Toast 
        notifications={notifications} 
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />
      {/* 검색창 */}
      {/* 상품 목록 */}
      {/* 장바구니 */}
      {/* 쿠폰 섹션 */}
    </div>
  );
};
```

#### **Step 3-4-2: 검색창 섹션**
```typescript
// CartPage 컴포넌트 내부에 추가
const renderSearchSection = () => (
  <div className="mb-8">
    <input
      type="text"
      value={products.searchTerm}
      onChange={(e) => products.setSearchTerm(e.target.value)}
      placeholder="상품 검색..."
      className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  </div>
);
```

#### **Step 3-4-3: 상품 목록 섹션**
```typescript
// CartPage 컴포넌트 내부에 추가
const renderProductList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {products.filteredProducts.map((product) => {
      const remainingStock = getRemainingStock(product, cart.cart);
      const isOutOfStock = remainingStock <= 0;
      
      return (
        <div key={product.id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-xl font-bold mb-2">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            재고: {remainingStock}개
          </p>
          <button
            onClick={() => handleAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 rounded ${
              isOutOfStock 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isOutOfStock ? '품절' : '장바구니에 추가'}
          </button>
        </div>
      );
    })}
  </div>
);
```

#### **Step 3-4-4: 장바구니 섹션**
```typescript
// CartPage 컴포넌트 내부에 추가
const renderCartSection = () => {
  const totals = cart.calculateTotal();
  const finalTotal = totals.totalAfterDiscount - coupons.calculateCouponDiscount(totals.totalAfterDiscount);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">장바구니</h2>
      
      {cart.cart.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어있습니다.</p>
      ) : (
        <>
          {cart.cart.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.product.price)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => cart.removeFromCart(item.product.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>할인 전 총액:</span>
              <span>{formatPrice(totals.totalBeforeDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span>할인 후 총액:</span>
              <span>{formatPrice(totals.totalAfterDiscount)}</span>
            </div>
            {coupons.selectedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>쿠폰 할인:</span>
                <span>-{formatPrice(coupons.calculateCouponDiscount(totals.totalAfterDiscount))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>최종 결제 금액:</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

#### **Step 3-4-5: 쿠폰 섹션**
```typescript
// CartPage 컴포넌트 내부에 추가
const renderCouponSection = () => (
  <div className="bg-white p-6 rounded-lg shadow mt-6">
    <h2 className="text-xl font-semibold mb-4">쿠폰</h2>
    
    <div className="space-y-2">
      {coupons.coupons.map((coupon) => (
        <div key={coupon.code} className="flex items-center justify-between p-3 border rounded">
          <div>
            <h4 className="font-medium">{coupon.name}</h4>
            <p className="text-sm text-gray-500">
              {coupon.discountType === 'amount' 
                ? `${coupon.discountValue}원 할인` 
                : `${coupon.discountValue}% 할인`}
            </p>
          </div>
          <button
            onClick={() => 
              coupons.selectedCoupon?.code === coupon.code 
                ? coupons.applyCoupon(null)
                : coupons.applyCoupon(coupon)
            }
            className={`px-4 py-2 rounded ${
              coupons.selectedCoupon?.code === coupon.code
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {coupons.selectedCoupon?.code === coupon.code ? '적용됨' : '적용'}
          </button>
        </div>
      ))}
    </div>
  </div>
);
```

#### **Step 3-4-6: 최종 JSX 구성**
```typescript
// CartPage 컴포넌트의 return 문
return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <Toast 
      notifications={notifications} 
      onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
    />
    
    <h1 className="text-3xl font-bold mb-8">쇼핑몰</h1>
    
    {renderSearchSection()}
    {renderProductList()}
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {renderCartSection()}
      {renderCouponSection()}
    </div>
  </div>
);
```

**완료 기준**:
- [ ] 모든 커스텀 훅들과 연동
- [ ] 검색, 상품 목록, 장바구니, 쿠폰 기능 구현
- [ ] 알림 시스템 동작
- [ ] 반응형 디자인

### **3-5. components/AdminPage.tsx 생성**

#### **Step 3-5-1: 기본 구조 및 탭 시스템**
```typescript
// src/basic/components/AdminPage.tsx 생성
import React, { useState, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import { Product, Coupon } from '../types';
import { Toast } from './ui/Toast';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  
  const products = useProducts();
  const coupons = useCoupons();
  
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  // 탭 네비게이션 UI
  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'products'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          상품 관리
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'coupons'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          쿠폰 관리
        </button>
      </nav>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toast 
        notifications={notifications} 
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      
      {renderTabNavigation()}
      
      {activeTab === 'products' ? (
        <ProductManagement />
      ) : (
        <CouponManagement />
      )}
    </div>
  );
};
```

#### **Step 3-5-2: 상품 관리 컴포넌트**
```typescript
// AdminPage.tsx 내부에 추가 (또는 별도 파일로)
const ProductManagement = () => {
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct === 'new') {
      products.addProduct(productForm);
      addNotification('상품이 추가되었습니다.');
    } else if (editingProduct) {
      products.updateProduct(editingProduct, productForm);
      addNotification('상품이 수정되었습니다.');
    }
    
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct('new');
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
                discounts: [],
              });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      {/* 상품 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.price, { isAdmin: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => startEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      products.deleteProduct(product.id);
                      addNotification('상품이 삭제되었습니다.');
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상품 폼 모달 */}
      {showProductForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
            </h3>
            <form onSubmit={handleProductSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">상품명</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">가격</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">재고</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">설명</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  {editingProduct === 'new' ? '추가' : '수정'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
```

#### **Step 3-5-3: 쿠폰 관리 컴포넌트**
```typescript
// AdminPage.tsx 내부에 추가 (또는 별도 파일로)
const CouponManagement = () => {
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    coupons.addCoupon(couponForm);
    addNotification('쿠폰이 추가되었습니다.');
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">쿠폰 목록</h2>
          <button
            onClick={() => setShowCouponForm(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 쿠폰 추가
          </button>
        </div>
      </div>

      {/* 쿠폰 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                쿠폰명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                코드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                할인
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.coupons.map((coupon) => (
              <tr key={coupon.code}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {coupon.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coupon.discountType === 'amount'
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      coupons.deleteCoupon(coupon.code);
                      addNotification('쿠폰이 삭제되었습니다.');
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 쿠폰 폼 모달 */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">새 쿠폰 추가</h3>
            <form onSubmit={handleCouponSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">쿠폰명</label>
                <input
                  type="text"
                  value={couponForm.name}
                  onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">쿠폰 코드</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({...couponForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">할인 유형</label>
                <select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({...couponForm, discountType: e.target.value as 'amount' | 'percentage'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="amount">금액 할인</option>
                  <option value="percentage">비율 할인</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">할인 값</label>
                <input
                  type="number"
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({...couponForm, discountValue: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCouponForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
```

**완료 기준**:
- [ ] 탭 기반 네비게이션
- [ ] 상품/쿠폰 CRUD 기능
- [ ] 모달 폼 UI
- [ ] 알림 시스템 통합

### **3-6. App.tsx 리팩토링**

#### **Step 3-6-1: Header 컴포넌트 분리**
```typescript
// src/basic/components/Header.tsx 생성 (선택사항)
import React from 'react';
import { CartIcon } from './icons';

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  cartItemCount?: number;
}

export const Header = ({ isAdmin, onToggleAdmin, cartItemCount = 0 }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={onToggleAdmin}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>
            {!isAdmin && (
              <div className="relative">
                <CartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
```

#### **Step 3-6-2: 최종 App.tsx 단순화**
```typescript
// src/basic/App.tsx 수정
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CartPage } from './components/CartPage';
import { AdminPage } from './components/AdminPage';
import { useCart } from './hooks/useCart';

export const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { getTotalItemCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAdmin={isAdmin} 
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        cartItemCount={getTotalItemCount()}
      />
      <main>
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};
```

**완료 기준**:
- [ ] App.tsx가 50줄 이하로 단순화
- [ ] 라우팅 로직만 담당
- [ ] 헤더 컴포넌트 분리
- [ ] 장바구니 개수 표시

### **Phase 3 테스트**
- [ ] 각 페이지가 독립적으로 렌더링
- [ ] 라우팅 (isAdmin 토글) 정상 작동
- [ ] 모든 기존 기능 유지
- [ ] UI 반응성 정상
- [ ] 알림 시스템 동작
- [ ] 모달 폼 기능

---

## ✅ **Phase 4: Integration & Testing**

**의도**: 모든 것이 올바르게 통합되고 기존 기능 유지

### **4-1. 통합 테스트**

#### **Step 4-1-1: 기능별 수동 테스트**
- [ ] **상품 관리**: 추가/수정/삭제 정상 작동
- [ ] **장바구니**: 추가/삭제/수량변경 정상 작동
- [ ] **쿠폰**: 적용/해제 및 할인 계산 정상
- [ ] **검색**: 실시간 검색 및 debounce 동작
- [ ] **관리자 페이지**: 모든 CRUD 기능
- [ ] **localStorage**: 새로고침 후 데이터 유지
- [ ] **알림**: 각 액션 후 적절한 알림 표시

#### **Step 4-1-2: 자동 테스트 실행**
```bash
# Basic 과제 테스트 실행
npm run test:basic

# 모든 테스트가 통과해야 함
```

#### **Step 4-1-3: 타입 검사**
```bash
# TypeScript 컴파일 검사
npx tsc --noEmit

# 에러가 없어야 함
```

#### **Step 4-1-4: 엣지 케이스 테스트**
- [ ] **재고 부족**: 품절 상품 장바구니 추가 시도
- [ ] **중복 쿠폰**: 동일한 쿠폰 코드 추가 시도
- [ ] **잘못된 입력**: 음수 가격, 빈 상품명 등
- [ ] **localStorage 에러**: 용량 초과, 접근 불가 등

### **4-2. 코드 품질 검증**

#### **Step 4-2-1: ESLint 검사**
```bash
# 린팅 검사 및 자동 수정
npm run lint:fix

# 모든 규칙 통과해야 함
```

#### **Step 4-2-2: Prettier 포맷팅**
```bash
# 코드 포맷팅
npm run format:fix

# 일관된 코드 스타일 적용
```

#### **Step 4-2-3: 코드 리뷰 체크리스트**
- [ ] **네이밍**: 모든 함수/변수명이 명확하고 의도를 드러냄
- [ ] **순수함수**: models 폴더의 모든 함수가 부작용 없음
- [ ] **불변성**: 모든 상태 업데이트가 불변성을 지킴
- [ ] **타입 안전성**: any 타입 사용 없음, 모든 인터페이스 정의
- [ ] **중복 제거**: 반복되는 로직이 적절히 추상화됨

### **4-3. 성능 및 최적화**

#### **Step 4-3-1: React DevTools 프로파일링**
- [ ] **불필요한 리렌더링** 확인 및 최적화
- [ ] **useCallback/useMemo** 적절한 사용 확인
- [ ] **메모리 누수** 없음 확인

#### **Step 4-3-2: 번들 크기 확인**
```bash
# 프로덕션 빌드
npm run build

# 번들 크기가 적절한지 확인
```

#### **Step 4-3-3: 로딩 성능**
- [ ] **초기 로딩**: 3초 이내 첫 화면 표시
- [ ] **검색 응답**: debounce로 과도한 검색 방지
- [ ] **대용량 데이터**: 상품/쿠폰이 많아도 성능 유지

### **4-4. 최종 검수**

#### **Step 4-4-1: 요구사항 대조**
- [ ] **18개 파일 분리**: 정확히 18개 파일로 구성
- [ ] **SRP 준수**: 각 파일이 단일 책임만 가짐
- [ ] **순수함수**: 비즈니스 로직이 순수함수로 구현
- [ ] **커스텀 훅**: 상태 관리가 적절히 캡슐화
- [ ] **테스트 통과**: 모든 기존 테스트 케이스 통과

#### **Step 4-4-2: 최종 파일 구조 확인**
```
src/basic/
├── models/                    # 4개 파일
│   ├── cart.ts
│   ├── discount.ts  
│   ├── product.ts
│   └── coupon.ts
├── hooks/                     # 3개 파일
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useCoupons.ts
├── utils/                     # 4개 파일
│   ├── formatters.ts
│   ├── validators.ts
│   └── hooks/
│       ├── useLocalStorage.ts
│       └── useDebounce.ts
├── components/                # 4개 파일
│   ├── CartPage.tsx
│   ├── AdminPage.tsx
│   ├── ui/
│   │   └── Toast.tsx
│   └── icons/
│       └── index.tsx
├── constants/                 # 1개 파일
│   └── index.ts
├── App.tsx                    # 1개 파일
└── main.tsx                   # 1개 파일
```

#### **Step 4-4-3: 성과 측정**
- [ ] **코드 줄 수**: 1,123줄 → 18개 파일로 분산
- [ ] **테스트 가능성**: 각 함수를 독립적으로 테스트 가능
- [ ] **재사용성**: UI 컴포넌트와 훅의 재사용 가능
- [ ] **유지보수성**: 각 파일의 역할이 명확하고 수정 용이

---

## 📊 **체크리스트 요약**

### **Phase 1: Foundation** 
- [ ] models/cart.ts (calculateItemTotal, updateCartItemQuantity)
- [ ] models/discount.ts (getMaxApplicableDiscount)  
- [ ] models/product.ts (getRemainingStock)
- [ ] utils/formatters.ts (formatPrice, formatCurrency)

### **Phase 2: State Management**
- [ ] utils/hooks/useLocalStorage.ts
- [ ] utils/hooks/useDebounce.ts
- [ ] hooks/useCart.ts (완전한 장바구니 관리)
- [ ] hooks/useProducts.ts (상품 관리 + 검색)
- [ ] hooks/useCoupons.ts (쿠폰 관리 + 적용)

### **Phase 3: UI Separation**  
- [ ] constants/index.ts (초기 데이터)
- [ ] components/ui/Toast.tsx (알림 시스템)
- [ ] components/icons/index.tsx (아이콘들)
- [ ] components/CartPage.tsx (쇼핑몰 페이지)
- [ ] components/AdminPage.tsx (관리자 페이지)
- [ ] App.tsx 리팩토링 (라우팅만)

### **Phase 4: Integration & Testing**
- [ ] 모든 기존 기능 정상 작동
- [ ] `npm run test:basic` 통과
- [ ] ESLint/Prettier 규칙 통과  
- [ ] TypeScript 컴파일 에러 없음
- [ ] 성능 최적화 완료

---

## 🎯 **시작 가이드**

**첫 번째 작업**: `src/basic/models/cart.ts` 파일 생성부터 시작하세요!

각 단계 완료 후 코드를 보여주시면 검증해드리겠습니다. 

**성공의 핵심**: 한 번에 하나씩, 차근차근 진행하는 것입니다! 🚀