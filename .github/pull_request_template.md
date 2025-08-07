## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제

- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- entities -> features -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제

- 재사용 가능한 Custom UI 컴포넌트를 만들어 보기
- 재사용 가능한 Custom 라이브러리 Hook을 만들어 보기
- 재사용 가능한 Custom 유틸 함수를 만들어 보기
- 그래서 엔티티와는 어떤 다른 계층적 특징을 가지는지 이해하기

- [x] UI 컴포넌트 계층과 엔티티 컴포넌트의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 Hook과 라이브러리 훅과의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 순수함수와 유틸리티 함수의 계층의 성격이 다르다는 것을 이해하고 적용했는가?

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

### 과제를 하면서 내가 제일 신경 쓴 부분은 무엇인가요?

#### 비즈니스 로직 분리

처음엔 모든 로직이 한곳에 뒤엉켜 있어서,, 어디서부터 손을 대야 할지 막막했습니다. 그래서 일단 비즈니스 로직을 순수 함수로 뽑아내는 거에 먼저 집중했습니다.

예를 하나 들면 장바구니 총액 계산 로직이 원래는 컴포넌트 내부에서 직접 state를 참조하며 계산하고 있었는데,

```typescript
// 이전 - 컴포넌트 내부에서 직접 계산
const calculateTotal = () => {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    // ... 복잡한 할인 로직 ...
  });
  // 쿠폰 적용, 보너스 할인 등등...
};
```

이걸 `models/cart.ts`로 분리해서 테스트 가능한 순수 함수로 만들었습니다.

```typescript
// 이후 - 순수 함수로 분리
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 파라미터로 받은 값만 사용, 외부 의존성 없음
  const totalBeforeDiscount = cart.reduce(/*...*/);
  // ...
  return { totalBeforeDiscount, totalDiscount, finalTotal };
};
```

이렇게 하니까 로직 수정할 때도 사이드 이펙트 걱정 없이 안심하고 건드릴 수 있었습니다.

#### Jotai

Props Drilling은 다른 건 모르겠는데 Toast 메시지가 제일 심했던 것 ㅏㄱㅌ습니다. 장바구니에서 "재고 부족" 알림 띄우려면 Toast 상태를 App.tsx에서 만들고, 그걸 Cart로 내리고, CartItem으로 또 내리고... ㄹㅇ Props Drilling 그 자체였어요

일단 Jotai를 선택한 건

- Context API는 Provider value 바뀔 때마다 전체 리렌더링되는 게 걱정되었고
- **Jotai는 useState랑 똑같이 쓸 수 있어서** 러닝 커브가 거의 없었습니다

```typescript
// 이전 - Props Drilling
<App products={products} cart={cart} addToCart={addToCart} ... />
  <ProductList products={products} addToCart={addToCart} />
    <ProductCard product={product} addToCart={addToCart} />

// 이후 - Jotai atom 직접 사용
const [products] = useAtom(productsAtom); // 필요한 곳에서 바로 꺼내 씀
```

#### 컴포넌트 쪼개기

처음엔 Cart 컴포넌트 하나가 장바구니 아이템 렌더링, 쿠폰 선택, 결제 요약 등 모든 걸 다 하고 있었습니다. 이걸 `CartItemCard`, `CartSummary`로 쪼개니까 각각의 역할이 명확해지고, 나중에 디자인 수정할 때도 해당 컴포넌트만 건드리면 도ㅐ서 편했습니다.

### 과제를 다시 해보면 더 잘 할 수 있었겠다 아쉬운 점이 있다면 무엇인가요?

#### 이벤트 핸들러

폼 컴포넌트들에서 여러 input의 onChange를 하나로 통합하려고 제네릭 핸들러를 만들었는데,

```typescript
// ProductForm.tsx
const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setProductForm(prev => ({ ...prev, [name]: value }));
};

// name과 description은 이 핸들러 사용
<input name="name" onChange={handleTextChange} />
<input name="description" onChange={handleTextChange} />

// 하지만 price와 stock은 숫자 검증 때문에 별도 핸들러
<input onChange={handlePriceChange} />
<input onChange={handleStockChange} />
```

코드는 줄었는데 타입스크립트 추론이 약해지고 나중에 특정 필드만 다른 로직 적용하려면 또 분리해야 하는... 이게 정말 좋은 선택이었나 싶긴 합니다. 차라리 각각 명시적인 핸들러를 두는 게 나았을지도 몰랐겠단 생각도 듭니다.

#### 과제 폴더 구조 실수 😅

이건 좀 어이없는데 심화 때는 advanced 폴더에 구현해야 할 걸 까먹고 그냥 basic 폴더에 계속 작업해버렸습니다. 기본과제 완료 후 advanced 폴더로 복사해서 심화과제를 시작했어야 했는데 몰입하다 보니 그냥 basic에서 Jotai까지 해버버려러버린...

결국 basic 폴더에 기본과제 + 심화과제가 섞여있는 상태가 되어서 과제 의도와는 다르게 되었습니다. 죄송합니다 😇

#### useLocalStorage

초반에 만든 useLocalStorage 훅이 나중에 방해가 됐습니다. localStorage는 동기적인데 React 상태는 비동기적이라 새로고침할 때 가끔 데이터가 꼬였느데 이게 테스트할 때 문제됐습니다.

```typescript
// 이런 식으로 데이터 검증 로직까지 넣어야 했음
const validateAndHydrate = (key: string, data: any) => {
  if (key === 'products' && Array.isArray(data)) {
    return data.map((item: Partial<Product>) => ({
      ...item,
      discounts: item.discounts || [], // 필드 누락 방어
    }));
  }
  // ...
};
```

물론 Jotai로 도입하면서 그런거긴한데,, 저 순간에는 그냥 처음부터 Jotai의 atomWithStorage를 쓸 걸 그랬나 싶기도 했스빈다.

#### 기존 테스트 코드와의 호환성

심화과제에서 Jotai 도입 후 테스트가 실패하기 시작했습니다. 특히 수량 감소 테스트가 계속 실패해서 한참을 헤맸는데, 알고 보니 Jotai 상태 업데이트가 비동기라서 `waitFor`를 써야 했던 거였습니다.

```typescript
// 처음엔 이렇게 했다가 실패
fireEvent.click(decreaseButton);
expect(getByText('9')).toBeInTheDocument(); // 실패!

// waitFor 추가하니까 성공
fireEvent.click(decreaseButton);
await waitFor(() => {
  expect(within(cartSection).getByText('9')).toBeInTheDocument();
});
```

그리고 상품 목록과 장바구니에 같은 상품명이 나와서 테스트가 헷갈려하는 것도 `within`으로 해결했습니다. 또 Jotai Provider로 테스트를 감싸는 `renderWithProviders` 헬퍼도 만들었습니다.

```typescript
// __tests__/origin.test.tsx에 추가
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider>{ui}</Provider>);
};
```

결국 다 통과하도록 만들긴했는데,, 리팩토링할 때 기존 테스트랑 호환성을 지키는게 쉬운게 아니라는걸 또 깨닫고 갑니다.

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)

#### 1. 엔티티 Hook vs 라이브러리 Hook 분리

`useCart` 같은 **엔티티 Hook**과 `useLocalStorage` 같은 **라이브러리 Hook**을 분리했는데, useCart가 지금 꽤 많은 일을 하고 있습니다.

- 장바구니 상태 관리 (cartAtom)
- 상품 재고 확인 (productsAtom 의존)
- Toast 메시지 표시 (toastMessageAtom 업데이트)
- 쿠폰 적용
- 총액 계산 (models/cart.ts 함수 호출)

```typescript
// useCart의 현재 구조
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [products] = useAtom(productsAtom); // 다른 엔티티 의존
  const setToastMessage = useSetAtom(toastMessageAtom);

  const addToCart = (product: Product) => {
    // 재고 확인 + 장바구니 추가 + 토스트 표시
  };

  const cartTotal = calculateCartTotal(cart, selectedCoupon); // 모델 함수 호출

  return { cart, addToCart, cartTotal /* ... */ };
};
```

이게 엔티티를 다루는 Hook의 적절한 책임 범위일지 아니면 더 세분화해야 할지 의문입니다.

#### 2. 엔티티 순수함수 vs 유틸리티 함수의 경계

`models/cart.ts`에는 **엔티티 순수함수**들을 넣었고, `utils/`에는 **유틸리티 함수**들을 넣었는데,

```typescript
// models/cart.ts - 장바구니 엔티티 관련
export const calculateCartTotal = (cart: CartItem[], coupon: Coupon | null) => {
  // 복잡한 비즈니스 로직
};

export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  // 장바구니 엔티티 조작
};

// utils/formatters.ts - 범용 유틸리티
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};
```

이 분류가 맞는지 잘 모르겠습니다. `calculateItemTotal` 같은 단순한 함수도 models에 넣었는데,

```typescript
export const calculateItemTotal = (item: CartItem): number => {
  return item.price * item.quantity;
};
```

이런 건 utils에 넣는 게 맞을까요? 조금 의미없는 질문일 수도 있지만 나름의 엔티티 순수함수와 유틸리티 함수의 구분 기준이 있으실지 궁금합니다.

#### 3. 최종 아키텍처의 데이터 흐름

결과적으로 다음과 같은 아키텍처가 완성되었는데,

```
[atoms] → [hooks] → [components]
   ↓         ↓          ↓
전역상태   비즈니스로직   UI렌더링
```

CartItemCard 같은 경우 완전한 Presenter는 아니고 약간의 로직을 가지고 있습니다.

```typescript
// CartItemCard - 순수 Presenter는 아님
const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newQuantity = parseInt(e.target.value) || 0;
  onUpdateQuantity(item.id, newQuantity); // 부모에서 받은 함수 호출
};
```

이런 간단한 변환 로직까지 부모로 올려야 하나 싶어서 그냥 뒀는데,, 엄밀히 말하면 엔티티 컴포넌트와 UI 컴포넌트 분리 원칙에 어긋나는 거라 생각하지만 굳이,, 이기도 하다고 생각합니다. 이럴 때는 적당한 타협을 해도 괜찮다 생각하는데 어떨까요?

그리고 현재 `atoms → hooks → components` 흐름에서 의존성 방향이 올바른지, 더 개선할 부분이 있는지도 피드백 받고 싶습니다.
