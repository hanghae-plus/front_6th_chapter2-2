# Advanced 과제 작업 계획서 (Props Drilling 제거)

## �� 목표

Basic에서 분리한 컴포넌트들을 기반으로 **Jotai**를 사용하여 Props Drilling을 완전히 제거하고 전역 상태 관리를 구현

## 📊 현재 문제점 분석

### **Props Drilling 심각성**

```typescript
// ❌ 현재 App.tsx의 Props Drilling 문제
<AdminPage
  activeTab={activeTab}           // 1
  products={products}             // 2
  productForm={productForm}       // 3
  editingProduct={editingProduct} // 4
  showProductForm={showProductForm} // 5
  cart={cart}                     // 6
  isAdmin={isAdmin}               // 7
  coupons={coupons}               // 8
  couponForm={couponForm}         // 9
  showCouponForm={showCouponForm} // 10
  onSetActiveTab={onSetActiveTab} // 11
  onAddProduct={onAddProduct}     // 12
  onUpdateProduct={onUpdateProduct} // 13
  onDeleteProduct={onDeleteProduct} // 14
  onStartEditProduct={onStartEditProduct} // 15
  setProductForm={setProductForm} // 16
  setEditingProduct={setEditingProduct} // 17
  setShowProductForm={setShowProductForm} // 18
  onRemoveCoupon={onRemoveCoupon} // 19
  onAddCoupon={onAddCoupon}       // 20
  setCouponForm={setCouponForm}   // 21
  setShowCouponForm={setShowCouponForm} // 22
  addNotification={addNotification} // 23
/>
```

**총 23개의 props**가 전달되고 있음 → **심각한 Props Drilling**

## ��️ 단계별 작업 계획

### **1단계: Jotai 설치 및 기본 설정** ⭐

**목표**: Jotai 라이브러리 설치 및 기본 구조 설정

**작업 내용**:

- [ ] Jotai 설치: `pnpm add jotai`
- [ ] `src/advanced/atoms/` 디렉토리 생성
- [ ] 기본 atoms 구조 설계

**예상 결과**:

```typescript
// atoms/index.ts
import { atom } from 'jotai';

// 기본 상태 atoms
export const productsAtom = atom([]);
export const cartAtom = atom([]);
export const couponsAtom = atom([]);
export const isAdminAtom = atom(false);
export const searchTermAtom = atom('');
```

### **2단계: 기본 상태 Atoms 생성** ⭐⭐

**목표**: 모든 상태를 Jotai atoms로 전환

**작업 내용**:

- [ ] **상품 관련 atoms**: `productsAtom`, `productFormAtom`, `editingProductAtom`
- [ ] **장바구니 관련 atoms**: `cartAtom`, `totalItemCountAtom`
- [ ] **쿠폰 관련 atoms**: `couponsAtom`, `selectedCouponAtom`, `couponFormAtom`
- [ ] **UI 상태 atoms**: `isAdminAtom`, `activeTabAtom`, `showProductFormAtom`, `showCouponFormAtom`
- [ ] **알림 atoms**: `notificationsAtom`
- [ ] **검색 atoms**: `searchTermAtom`, `debouncedSearchTermAtom`

**파일 구조**:

```
src/advanced/atoms/
├── index.ts              # 모든 atoms export
├── productAtoms.ts       # 상품 관련 atoms
├── cartAtoms.ts          # 장바구니 관련 atoms
├── couponAtoms.ts        # 쿠폰 관련 atoms
├── uiAtoms.ts            # UI 상태 atoms
└── notificationAtoms.ts  # 알림 atoms
```

### **3단계: 파생 상태 Atoms 생성** ⭐⭐⭐

**목표**: 계산된 상태들을 파생 atoms로 구현

**작업 내용**:

- [ ] **필터링 atoms**: `filteredProductsAtom` (검색어 기반)
- [ ] **계산 atoms**: `cartTotalsAtom` (장바구니 총액 계산)
- [ ] **재고 atoms**: `remainingStockAtom` (상품별 남은 재고)

**예상 결과**:

```typescript
// 파생 atoms
export const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const searchTerm = get(debouncedSearchTermAtom);
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

export const cartTotalsAtom = atom(get => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});
```

### **4단계: 액션 Atoms 생성** ⭐⭐⭐⭐

**목표**: 상태 변경 로직을 atoms로 캡슐화

**작업 내용**:

- [ ] **상품 액션 atoms**: `addProductAtom`, `updateProductAtom`, `deleteProductAtom`
- [ ] **장바구니 액션 atoms**: `addToCartAtom`, `updateQuantityAtom`, `removeFromCartAtom`
- [ ] **쿠폰 액션 atoms**: `addCouponAtom`, `removeCouponAtom`, `applyCouponAtom`
- [ ] **UI 액션 atoms**: `toggleAdminAtom`, `setActiveTabAtom`

**예상 결과**:

```typescript
// 액션 atoms
export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const cart = get(cartAtom);
  const newCart = cartService.addItemToCart(product, cart);
  set(cartAtom, newCart);

  // 알림 추가
  const notifications = get(notificationsAtom);
  set(notificationsAtom, [
    ...notifications,
    { id: Date.now(), message: '장바구니에 담았습니다', type: 'success' },
  ]);
});
```

### **5단계: Custom Hooks 전환** ⭐⭐⭐⭐⭐

**목표**: 기존 Custom Hooks를 Jotai atoms 기반으로 전환

**작업 내용**:

- [ ] **useProducts → useProductAtoms**: atoms 기반 상품 관리
- [ ] **useCart → useCartAtoms**: atoms 기반 장바구니 관리
- [ ] **useCoupon → useCouponAtoms**: atoms 기반 쿠폰 관리
- [ ] **useUIState → useUIAtoms**: atoms 기반 UI 상태 관리
- [ ] **useNotifications → useNotificationAtoms**: atoms 기반 알림 관리

**예상 결과**:

```typescript
// hooks/useProductAtoms.ts
export const useProductAtoms = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);

  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);
  const deleteProduct = useSetAtom(deleteProductAtom);

  return {
    products,
    productForm,
    editingProduct,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProductForm,
    setEditingProduct,
  };
};
```

### **6단계: App.tsx 리팩토링** ⭐⭐⭐⭐⭐⭐

**목표**: App.tsx에서 모든 상태 관리 로직 제거

**작업 내용**:

- [ ] **상태 선언 제거**: 모든 useState, useEffect 제거
- [ ] **Props 전달 최소화**: 이벤트 핸들러만 전달
- [ ] **Provider 설정**: Jotai Provider로 감싸기

**예상 결과**:

```typescript
// Before: 23개 props
<AdminPage
  activeTab={activeTab}
  products={products}
  // ... 20개 더
/>

// After: 0개 props (내부에서 atoms 사용)
<AdminPage />
```

### **7단계: 컴포넌트 전환** ⭐⭐⭐⭐⭐⭐⭐

**목표**: 모든 컴포넌트에서 atoms 직접 사용

**작업 내용**:

- [ ] **AdminPage**: atoms 직접 구독
- [ ] **ShoppingPage**: atoms 직접 구독
- [ ] **ProductCard**: 필요한 atoms만 구독
- [ ] **CartItem**: 필요한 atoms만 구독
- [ ] **Header**: 필요한 atoms만 구독

**예상 결과**:

```typescript
// components/pages/admin/AdminPage.tsx
export const AdminPage = () => {
  const [activeTab] = useAtom(activeTabAtom);
  const [products] = useAtom(productsAtom);
  const [isAdmin] = useAtom(isAdminAtom);

  // 필요한 atoms만 구독하여 불필요한 리렌더링 방지
  return (
    <div>
      <AdminHeader />
      {activeTab === 'products' ? <ProductManagement /> : <CouponManagement />}
    </div>
  );
};
```

### **8단계: 성능 최적화** ⭐⭐⭐⭐⭐⭐⭐⭐

**목표**: 불필요한 리렌더링 방지 및 메모이제이션 적용

**작업 내용**:

- [ ] **useAtomValue 사용**: 읽기 전용 상태에 대해
- [ ] **useSetAtom 사용**: 쓰기 전용 액션에 대해
- [ ] **React.memo 적용**: 컴포넌트 메모이제이션
- [ ] **useMemo 적용**: 복잡한 계산 결과 메모이제이션

**예상 결과**:

```typescript
// 성능 최적화된 컴포넌트
export const ProductCard = React.memo(({ productId }: { productId: string }) => {
  const product = useAtomValue(productsAtom).find(p => p.id === productId);
  const addToCart = useSetAtom(addToCartAtom);

  if (!product) return null;

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>장바구니 담기</button>
    </div>
  );
});
```

### **9단계: 테스트 및 검증** ⭐⭐⭐⭐⭐⭐⭐⭐⭐

**목표**: 모든 기능이 정상 작동하는지 확인

**작업 내용**:

- [ ] **기능 테스트**: 모든 기존 기능 동작 확인
- [ ] **성능 테스트**: 리렌더링 최적화 확인
- [ ] **테스트 코드 통과**: 기존 테스트 케이스 통과 확인
- [ ] **Props Drilling 제거 확인**: 불필요한 props 전달 완전 제거

## �� 예상 성과

### **Props Drilling 제거**

- **Before**: 23개 props 전달
- **After**: 0개 props 전달 (내부에서 atoms 사용)

### **코드 품질 개선**

- **가독성**: 컴포넌트가 필요한 상태만 명확히 표시
- **유지보수성**: 상태 변경 로직이 중앙화됨
- **재사용성**: 컴포넌트가 독립적으로 동작

### **성능 최적화**

- **리렌더링 최소화**: 필요한 atoms만 구독
- **메모리 효율성**: 불필요한 상태 전달 제거
