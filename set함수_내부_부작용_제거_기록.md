# set 함수 내부 부작용 제거 과정 기록

## 개요
React의 set 함수 내부에서 다른 set 함수(notify)를 호출하는 것은 성능상 문제가 될 수 있어 이를 제거하는 과정을 기록합니다.

## 변경 전 코드 구조

### 1. useProducts.tsx (변경 전)
```typescript
addProduct: useCallback(
  (params) => {
    setProducts((prevProducts) => {
      const newProducts = productModel.addProduct({
        id: `p${Date.now()}`,
        newProduct: params.newProduct,
        products: prevProducts, // ✅ prevProducts 사용 가능
      });

      notify({ // ❌ set 함수 내부에서 다른 set 함수 호출
        message: '상품이 추가되었습니다.',
        type: 'success',
      });

      return newProducts;
    });
  },
  [setProducts, notify]
),
```

### 2. useCart.tsx (변경 전)
```typescript
addToCart: useCallback(
  ({ product }) => {
    setCart((prevCart) => {
      const remainingStock = productModel.getRemainingStock({
        cart: prevCart, // ✅ prevCart 사용 가능
        product,
      });
      const isSoldOut = productModel.isSoldOut({ remainingStock });

      const result = cartModel.addToCartWithStockCheck({
        cart: prevCart, // ✅ prevCart 사용 가능
        product,
        isSoldOut,
      });

      if (!result.success) {
        notify({ message: result.message, type: 'error' }); // ❌ set 함수 내부에서 호출
        return prevCart;
      }

      notify({ message: result.message, type: 'success' }); // ❌ set 함수 내부에서 호출
      return result.newCart;
    });
  },
  [setCart, notify]
),
```

## 변경 후 코드 구조

### 1. useProducts.tsx (변경 후)
```typescript
addProduct: useCallback(
  (params) => {
    const newProducts = productModel.addProduct({
      id: `p${Date.now()}`,
      newProduct: params.newProduct,
      products, // ❌ 현재 상태만 사용 가능
    });

    setProducts(newProducts);
    notify({ // ✅ set 함수 외부에서 호출
      message: '상품이 추가되었습니다.',
      type: 'success',
    });
  },
  [setProducts, notify, products] // ❌ products 의존성 추가
),
```

### 2. useCart.tsx (변경 후)
```typescript
addToCart: useCallback(
  ({ product }) => {
    const remainingStock = productModel.getRemainingStock({
      cart, // ❌ 현재 상태만 사용 가능
      product,
    });
    const isSoldOut = productModel.isSoldOut({ remainingStock });

    const result = cartModel.addToCartWithStockCheck({
      cart, // ❌ 현재 상태만 사용 가능
      product,
      isSoldOut,
    });

    if (!result.success) {
      notify({ message: result.message, type: 'error' }); // ✅ set 함수 외부에서 호출
      return;
    }

    setCart(result.newCart);
    notify({ message: result.message, type: 'success' }); // ✅ set 함수 외부에서 호출
  },
  [setCart, notify, cart] // ❌ cart 의존성 추가
),
```

## 발생한 문제점들

### 1. **prevState 접근 불가**
- **변경 전**: `prevProducts`, `prevCart` 등으로 이전 상태에 접근 가능
- **변경 후**: 현재 상태(`products`, `cart`)만 사용 가능
- **영향**: 동시성 문제 발생 가능성

### 2. **의존성 배열 증가**
- **변경 전**: `[setProducts, notify]`
- **변경 후**: `[setProducts, notify, products]`
- **영향**: 불필요한 리렌더링 발생 가능성 증가

### 3. **동시성 문제**
```typescript
// 문제가 될 수 있는 시나리오
const addToCart = useCallback(({ product }) => {
  // 이 시점의 cart 상태가 최신이 아닐 수 있음
  const result = cartModel.addToCartWithStockCheck({
    cart, // stale closure 문제 가능성
    product,
    isSoldOut,
  });
  // ...
}, [setCart, notify, cart]);
```

## 해결 방안 고려사항

### 1. **useRef 사용**
```typescript
const cartRef = useRef(cart);
cartRef.current = cart;

const addToCart = useCallback(({ product }) => {
  const result = cartModel.addToCartWithStockCheck({
    cart: cartRef.current, // 최신 상태 보장
    product,
    isSoldOut,
  });
  // ...
}, [setCart, notify]); // cart 의존성 제거
```

### 2. **함수형 업데이트 유지 + 부작용 분리**
```typescript
const addToCart = useCallback(({ product }) => {
  setCart((prevCart) => {
    const result = cartModel.addToCartWithStockCheck({
      cart: prevCart, // 최신 상태 보장
      product,
      isSoldOut,
    });
    return result.success ? result.newCart : prevCart;
  });
  
  // 부작용은 set 함수 외부에서 처리
  if (!result.success) {
    notify({ message: result.message, type: 'error' });
  } else {
    notify({ message: result.message, type: 'success' });
  }
}, [setCart, notify]);
```

### 3. **useEffect 활용**
```typescript
const [pendingNotification, setPendingNotification] = useState(null);

const addToCart = useCallback(({ product }) => {
  setCart((prevCart) => {
    const result = cartModel.addToCartWithStockCheck({
      cart: prevCart,
      product,
      isSoldOut,
    });
    
    // 알림 정보를 상태로 저장
    setPendingNotification(result);
    return result.success ? result.newCart : prevCart;
  });
}, [setCart]);

useEffect(() => {
  if (pendingNotification) {
    notify({ 
      message: pendingNotification.message, 
      type: pendingNotification.success ? 'success' : 'error' 
    });
    setPendingNotification(null);
  }
}, [pendingNotification, notify]);
```

## 현재 선택한 방식의 장단점

### 장점
1. **성능 향상**: set 함수 내부에서 부작용 제거
2. **코드 단순성**: 복잡한 상태 관리 없이 구현
3. **예측 가능성**: 상태 업데이트와 부작용이 명확히 분리

### 단점
1. **동시성 문제**: stale closure로 인한 상태 불일치 가능성
2. **의존성 증가**: 불필요한 리렌더링 발생 가능
3. **복잡성 증가**: 동시성 문제 해결을 위한 추가 로직 필요

## 향후 개선 방향

### 1. **useRef 패턴 도입**
- 최신 상태 보장하면서 의존성 배열 최소화
- 동시성 문제 해결

### 2. **상태 관리 라이브러리 고려**
- Zustand, Jotai 등으로 전역 상태 관리
- 동시성 문제 자동 해결

### 3. **함수형 업데이트 + 부작용 분리 패턴**
- 함수형 업데이트의 장점 유지
- 부작용은 별도 처리

## 결론

set 함수 내부에서 부작용을 제거하는 것은 성능상 좋지만, 이 과정에서 발생하는 동시성 문제와 의존성 증가 문제를 해결해야 합니다. 현재는 단순성을 위해 현재 상태를 사용하는 방식을 선택했지만, 향후 useRef 패턴이나 상태 관리 라이브러리를 도입하여 개선할 예정입니다.

## 참고 자료
- React 공식 문서: [State Updates](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
- React 공식 문서: [useCallback](https://react.dev/reference/react/useCallback)
- React 공식 문서: [useRef](https://react.dev/reference/react/useRef)
