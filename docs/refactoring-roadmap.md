# 단순한 폴더 구조 기반 리팩토링 로드맵

## 🎯 목표

현재 1,124줄의 거대한 `App.tsx`를 단순하고 실용적인 폴더 구조로 리팩토링합니다.

### Before (현재 상태)
```
App.tsx (1,124줄)
├── 15+ 개의 상태
├── 20+ 개의 함수
├── 6개의 useEffect
└── 모든 비즈니스 로직이 혼재
```

### After (단순한 구조 적용 후)
```
src/
├── models/           # 엔티티 (비즈니스 로직)
│   ├── cart.ts
│   ├── product.ts
│   ├── coupon.ts
│   └── discount.ts
├── components/       # 페이지 + UI 컴포넌트
│   ├── CartPage.tsx
│   ├── AdminPage.tsx
│   └── ui/          # 재사용 가능한 UI 컴포넌트
├── hooks/           # 상태 관리
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useCoupons.ts
├── utils/           # 유틸리티
│   ├── formatters.ts
│   └── validators.ts
└── App.tsx
```

## 📋 Phase 1: 모델 분리 (1일)

### 1.1 models/ 레이어 생성

#### 📁 `src/models/cart.ts`
```typescript
// 순수 함수로 구현된 장바구니 비즈니스 로직
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartTotal {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product
  const { quantity } = item
  const discount = getMaxApplicableDiscount(item)
  
  return Math.round(price * quantity * (1 - discount))
}

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null): CartTotal => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity
    totalBeforeDiscount += itemPrice
    totalAfterDiscount += calculateItemTotal(item)
  })

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100))
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: totalBeforeDiscount - totalAfterDiscount
  }
}

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product
  const { quantity } = item
  
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount 
      ? discount.rate 
      : maxDiscount
  }, 0)
}

export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id)
  const remaining = product.stock - (cartItem?.quantity || 0)
  
  return remaining
}

export const updateCartItemQuantity = (cart: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return cart.filter(item => item.product.id !== productId)
  }
  
  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  )
}

export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id)
  
  if (existingItem) {
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  }
  
  return [...cart, { product, quantity: 1 }]
}

export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId)
}
```

#### 📁 `src/models/product.ts`
```typescript
export interface Product {
  id: string
  name: string
  price: number
  stock: number
  discounts: Discount[]
  description?: string
  isRecommended?: boolean
}

export interface Discount {
  quantity: number
  rate: number
}

export const validateProduct = (product: Omit<Product, 'id'>): string[] => {
  const errors: string[] = []
  
  if (!product.name.trim()) errors.push('상품명을 입력해주세요')
  if (product.price <= 0) errors.push('가격은 0보다 커야 합니다')
  if (product.stock < 0) errors.push('재고는 0 이상이어야 합니다')
  if (product.stock > 9999) errors.push('재고는 9999개를 초과할 수 없습니다')
  
  return errors
}

export const createProduct = (data: Omit<Product, 'id'>): Product => {
  return {
    ...data,
    id: `p${Date.now()}`
  }
}
```

#### 📁 `src/models/coupon.ts`
```typescript
export interface Coupon {
  id: string
  name: string
  code: string
  discountType: 'amount' | 'percentage'
  discountValue: number
  minPurchaseAmount?: number
}

export const validateCoupon = (coupon: Omit<Coupon, 'id'>): string[] => {
  const errors: string[] = []
  
  if (!coupon.name.trim()) errors.push('쿠폰명을 입력해주세요')
  if (!coupon.code.trim()) errors.push('쿠폰 코드를 입력해주세요')
  if (coupon.discountValue <= 0) errors.push('할인 값은 0보다 커야 합니다')
  
  if (coupon.discountType === 'percentage' && coupon.discountValue > 100) {
    errors.push('할인율은 100%를 초과할 수 없습니다')
  }
  
  return errors
}

export const createCoupon = (data: Omit<Coupon, 'id'>): Coupon => {
  return {
    ...data,
    id: `c${Date.now()}`
  }
}
```

#### 📁 `src/models/discount.ts`
```typescript
export interface Discount {
  quantity: number
  rate: number
}

export const validateDiscount = (discount: Discount): string[] => {
  const errors: string[] = []
  
  if (discount.quantity <= 0) errors.push('수량은 0보다 커야 합니다')
  if (discount.rate < 0 || discount.rate > 1) errors.push('할인율은 0~1 사이여야 합니다')
  
  return errors
}
```

## 📋 Phase 2: 유틸리티 분리 (1일)

### 2.1 utils/ 레이어 생성

#### 📁 `src/utils/formatters.ts`
```typescript
export const formatPrice = (price: number, isAdmin?: boolean): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`
  }
  return `₩${price.toLocaleString()}`
}

export const formatDiscount = (rate: number): string => {
  return `${Math.round(rate * 100)}%`
}

export const formatStockStatus = (stock: number): string => {
  if (stock <= 0) return '품절'
  if (stock <= 5) return `품절임박! ${stock}개 남음`
  return `재고 ${stock}개`
}

export const formatQuantity = (quantity: number): string => {
  return `${quantity}개`
}
```

#### 📁 `src/utils/validators.ts`
```typescript
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateProductForm = (form: ProductForm): ValidationResult => {
  const errors: string[] = []
  
  if (!form.name.trim()) errors.push('상품명을 입력해주세요')
  if (form.price <= 0) errors.push('가격은 0보다 커야 합니다')
  if (form.stock < 0) errors.push('재고는 0 이상이어야 합니다')
  if (form.stock > 9999) errors.push('재고는 9999개를 초과할 수 없습니다')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCouponForm = (form: CouponForm): ValidationResult => {
  const errors: string[] = []
  
  if (!form.name.trim()) errors.push('쿠폰명을 입력해주세요')
  if (!form.code.trim()) errors.push('쿠폰 코드를 입력해주세요')
  if (form.discountValue <= 0) errors.push('할인 값은 0보다 커야 합니다')
  
  if (form.discountType === 'percentage' && form.discountValue > 100) {
    errors.push('할인율은 100%를 초과할 수 없습니다')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateStock = (quantity: number, stock: number): boolean => {
  return quantity > 0 && quantity <= stock
}
```

## 📋 Phase 3: 훅 분리 (1일)

### 3.1 hooks/ 레이어 생성

#### 📁 `src/hooks/useCart.ts`
```typescript
import { useState, useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { calculateCartTotal, addItemToCart, removeItemFromCart, updateCartItemQuantity } from '../models/cart'
import { CartItem, CartTotal } from '../models/cart'
import { Product } from '../models/product'
import { Coupon } from '../models/coupon'

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', [])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  
  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => addItemToCart(prevCart, product))
  }, [setCart])
  
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => removeItemFromCart(prevCart, productId))
  }, [setCart])
  
  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity))
  }, [setCart])
  
  const clearCart = useCallback(() => {
    setCart([])
    setSelectedCoupon(null)
  }, [setCart])
  
  const total = useMemo(() => 
    calculateCartTotal(cart, selectedCoupon), 
    [cart, selectedCoupon]
  )
  
  return { 
    cart, 
    selectedCoupon,
    total,
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    setSelectedCoupon
  }
}
```

#### 📁 `src/hooks/useProducts.ts`
```typescript
import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Product, createProduct, validateProduct } from '../models/product'

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ],
    description: '최고급 품질의 프리미엄 상품입니다.'
  },
  // ... 기타 초기 상품들
]

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const errors = validateProduct(productData)
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    const newProduct = createProduct(productData)
    setProducts(prev => [...prev, newProduct])
  }, [setProducts])
  
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ))
  }, [setProducts])
  
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }, [setProducts])
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return { 
    products: filteredProducts, 
    searchTerm,
    setSearchTerm,
    addProduct, 
    updateProduct, 
    deleteProduct 
  }
}
```

#### 📁 `src/hooks/useCoupons.ts`
```typescript
import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Coupon, createCoupon, validateCoupon } from '../models/coupon'

const initialCoupons: Coupon[] = [
  {
    id: 'c1',
    name: '신규 고객 할인',
    code: 'NEW10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 10000
  },
  // ... 기타 초기 쿠폰들
]

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons)
  
  const addCoupon = useCallback((couponData: Omit<Coupon, 'id'>) => {
    const errors = validateCoupon(couponData)
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    const newCoupon = createCoupon(couponData)
    setCoupons(prev => [...prev, newCoupon])
  }, [setCoupons])
  
  const updateCoupon = useCallback((id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === id ? { ...coupon, ...updates } : coupon
    ))
  }, [setCoupons])
  
  const deleteCoupon = useCallback((id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id))
  }, [setCoupons])
  
  return { 
    coupons, 
    addCoupon, 
    updateCoupon, 
    deleteCoupon 
  }
}
```

## 📋 Phase 4: 컴포넌트 분리 (1일)

### 4.1 components/ 레이어 생성

#### 📁 `src/components/CartPage.tsx`
```typescript
import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { useCoupons } from '../hooks/useCoupons'
import { getRemainingStock } from '../models/cart'
import { formatPrice, formatStockStatus } from '../utils/formatters'
import { Button } from './ui/Button'
import { SearchBar } from './ui/SearchBar'
import { ProductList } from './ui/ProductList'
import { Cart } from './ui/Cart'

export function CartPage() {
  const { products, searchTerm, setSearchTerm } = useProducts()
  const { cart, total, addToCart, removeFromCart, updateQuantity } = useCart()
  const { coupons } = useCoupons()
  const [isAdmin, setIsAdmin] = useState(false)

  const handleAddToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product, cart)
    if (remainingStock <= 0) {
      alert('재고가 부족합니다!')
      return
    }
    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">쇼핑몰</h1>
            <Button
              onClick={() => setIsAdmin(!isAdmin)}
              variant={isAdmin ? 'primary' : 'secondary'}
            >
              {isAdmin ? '쇼핑몰 모드' : '관리자 모드'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <ProductList 
              products={products}
              onAddToCart={handleAddToCart}
              cart={cart}
            />
          </div>
          <div className="lg:col-span-1">
            <Cart 
              cart={cart}
              total={total}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              coupons={coupons}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
```

#### 📁 `src/components/AdminPage.tsx`
```typescript
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCoupons } from '../hooks/useCoupons'
import { formatPrice } from '../utils/formatters'
import { Button } from './ui/Button'
import { ProductForm } from './ui/ProductForm'
import { CouponForm } from './ui/CouponForm'

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCoupons()
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
            <Button variant="secondary" onClick={() => window.history.back()}>
              쇼핑몰으로 돌아가기
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                상품 관리
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coupons'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                쿠폰 관리
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">상품 관리</h2>
                <ProductForm onSubmit={addProduct} />
                <div className="mt-6 space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(product.price, true)}</p>
                          <p className="text-sm text-gray-600">재고: {product.stock}개</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => {}}>수정</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteProduct(product.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'coupons' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">쿠폰 관리</h2>
                <CouponForm onSubmit={addCoupon} />
                <div className="mt-6 space-y-4">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{coupon.name}</h3>
                          <p className="text-sm text-gray-600">코드: {coupon.code}</p>
                          <p className="text-sm text-gray-600">
                            할인: {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => {}}>수정</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteCoupon(coupon.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
```

#### 📁 `src/components/ui/Button.tsx`
```typescript
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

## 📋 Phase 5: 앱 통합 (1일)

### 5.1 App.tsx 간소화

#### 📁 `src/App.tsx`
```typescript
import { useState } from 'react'
import { CartPage } from './components/CartPage'
import { AdminPage } from './components/AdminPage'

export function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="App">
      {isAdmin ? <AdminPage /> : <CartPage />}
    </div>
  )
}

export default App
```

## 📊 예상 결과

### 코드 품질 개선
- **라인 수**: 1,124줄 → 50줄 (App.tsx)
- **파일 수**: 1개 → 20+ 개
- **복잡도**: 높음 → 낮음
- **재사용성**: 없음 → 높음

### 아키텍처 개선
- **명확한 분리**: 모델, 훅, 컴포넌트 분리
- **비즈니스 지향**: 모델 중심 설계
- **확장성**: 새로운 기능 추가 용이
- **테스트 용이성**: 각 레이어별 독립적 테스트

### 성능 개선
- **리렌더링 최적화**: 컴포넌트 분리로 인한 최적화
- **메모리 사용량**: 효율적인 상태 관리
- **코드 분할**: 기능별 코드 분리

## 🚀 실행 계획

### Day 1: 모델 분리
- [ ] models/cart.ts 생성
- [ ] models/product.ts 생성
- [ ] models/coupon.ts 생성
- [ ] models/discount.ts 생성

### Day 2: 유틸리티 분리
- [ ] utils/formatters.ts 생성
- [ ] utils/validators.ts 생성

### Day 3: 훅 분리
- [ ] hooks/useCart.ts 생성
- [ ] hooks/useProducts.ts 생성
- [ ] hooks/useCoupons.ts 생성

### Day 4: 컴포넌트 분리
- [ ] components/CartPage.tsx 생성
- [ ] components/AdminPage.tsx 생성
- [ ] components/ui/Button.tsx 생성

### Day 5: 앱 통합
- [ ] App.tsx 간소화
- [ ] 최종 통합 및 테스트

이 단순한 구조로 리팩토링을 통해 Brownfield 상황을 성공적으로 개선할 수 있습니다. 