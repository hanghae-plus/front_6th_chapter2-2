# Chapter 2-1. 디자인패턴과 함수형프로그래밍

## 기본과제: 거대 단일 컴포넌트 리팩토링

이번 과제는 단일책임원칙을 위반한 거대한 컴포넌트를 리팩토링 하는 것입니다. React의 컴포넌트는 단일 책임 원칙(Single Responsibility Principle, SRP)을 따르는 것이 좋습니다. 즉, 각 컴포넌트는 하나의 책임만을 가져야 합니다. 하지만 실제로는 여러 가지 기능을 가진 거대한 컴포넌트를 작성하는 경우가 많습니다.

[목표]

## 1. 취지

- React의 추구미(!)를 이해해보아요!
- 단일 책임 원칙(SRP)을 위반한 거대한 컴포넌트가 얼마나 안 좋은지 경험해보아요!
- 단일 책임이라는 개념을 이해하기 상태, 순수함수, 컴포넌트, 훅 등 다양한 계층을 이해해합니다.
- 엔티티와 UI를 구분하고 데이터, 상태, 비즈니스 로직 등의 특징이 다르다는 것을 이해해보세요.
- 이를 통해 적절한 Custom Hook과 유틸리티 함수를 분리하고, 컴포넌트 계층 구조를 정리하는 능력을 갖춥니다!

## 2. 리팩토링 순서

### Phase 1: 비즈니스 로직 분리 (순수 함수)

1. **모델 함수 구현** (`src/refactoring(hint)/models/`)

   - `cart.ts`: 장바구니 관련 계산 함수들
   - `product.ts`: 상품 관련 계산 함수들
   - `discount.ts`: 할인 관련 계산 함수들
   - `coupon.ts`: 쿠폰 관련 계산 함수들

2. **유틸리티 함수 구현** (`src/refactoring(hint)/utils/`)
   - `formatters.ts`: 가격 포맷팅 등 UI 관련 유틸리티
   - `validators.ts`: 입력 검증 함수들

### Phase 2: 상태 관리 Hook 분리

1. **엔티티 관련 Hook** (`src/refactoring(hint)/hooks/`)

   - `useCart.ts`: 장바구니 상태 관리
   - `useProducts.ts`: 상품 목록 관리
   - `useCoupons.ts`: 쿠폰 관리

2. **유틸리티 Hook**
   - `useLocalStorage.ts`: localStorage 연동
   - `useDebounce.ts`: 검색 디바운싱
   - `useValidate.ts`: 폼 검증

### Phase 3: 컴포넌트 계층 구조 분리

1. **엔티티 컴포넌트** (`src/refactoring(hint)/components/`)

   - `CartPage.tsx`: 장바구니 페이지
   - `AdminPage.tsx`: 관리자 페이지
   - `ProductCard.tsx`: 상품 카드
   - `Cart.tsx`: 장바구니 표시

2. **UI 컴포넌트** (`src/refactoring(hint)/components/ui/`)
   - `Button.tsx`: 재사용 가능한 버튼
   - `Input.tsx`: 입력 필드
   - `Modal.tsx`: 모달 창

### Phase 4: 메인 App 컴포넌트 구현

- 라우팅 및 모드 전환 로직
- 전체 상태 관리 구조 정리

### Phase 5: 테스트 코드 통과 확인

- 각 단계별로 테스트 실행하여 기능 검증

## 3. 목표

모든 소프트웨어에는 적절한 책임과 계층이 존재합니다. 하나의 계층(Component)만으로 소프트웨어를 구성하게 되면 나중에는 정리정돈이 되지 않은 코드를 만나게 됩니다. 예전에는 이러한 BestPractice에 대해서 혼돈의 시대였지만 FE가 진화를 거듭하는 과정에서 적절한 계측에 대한 합의가 이루어지고 있는 상태입니다.

React의 주요 책임 계층은 Component, hook, function 등이 있습니다. 그리고 주요 분류 기준은 **엔티티**가 되어 줍니다.

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

이번 과제의 목표는 이러한 계층을 이해하고 분리하여 정리정돈을 하는 기준이나 방법등을 습득하는데 있습니다.

제시된 코드는 각각의 컴포넌트에 모든 비즈니스 로직이 작성되어 있습니다. 여기에서 custom hook과 util 함수를 적절하게 분리하고, **테스트 코드를 통과할 수 있도록 해주세요.**

basic의 경우 상태관리를 쓰지 않고 작업을 해주세요.

### (1) 요구사항

#### 1) 장바구니 페이지 요구사항

- 상품 목록
  - 상품명, 가격, 재고 수량 등을 표시
  - 각 상품의 할인 정보 표시
  - 재고가 없는 경우 품절 표시가 되며 장바구니 추가가 불가능
- 장바구니
  - 장바구니 내 상품 수량 조절 가능
  - 각 상품의 이름, 가격, 수량과 적용된 할인율을 표시
    - 적용된 할인율 표시 (예: "10% 할인 적용")
  - 장바구니 내 모든 상품의 총액을 계산해야
- 쿠폰 할인
  - 할인 쿠폰을 선택하면 적용하면 최종 결제 금액에 할인정보가 반영
- 주문요약
  - 할인 전 총 금액
  - 총 할인 금액
  - 최종 결제 금액

#### 2) 관리자 페이지 요구사항

- 상품 관리
  - 상품 정보 (상품명, 가격, 재고, 할인율) 수정 가능
  - 새로운 상품 추가 가능
  - 상품 제거 가능
- 할인 관리
  - 상품별 할인 정보 추가/수정/삭제 가능
  - 할인 조건 설정 (구매 수량에 따른 할인율)
- 쿠폰 관리
  - 전체 상품에 적용 가능한 쿠폰 생성
  - 쿠폰 정보 입력 (이름, 코드, 할인 유형, 할인 값)
  - 할인 유형은 금액 또는 비율로 설정 가능

### (2) 코드 개선 요구사항

#### 1) cart, product에 대한 계산 함수 분리

- calculateItemTotal
- getMaxApplicableDiscount
- calculateCartTotal
- updateCartItemQuantity

#### 2) 상태를 다루는 hook, 유틸리티 hook 분리

- useCart
- useCoupon
- useProduct
- useLocalStorage

#### 3) 엔티티 컴포넌트와 UI 컴포넌트 분리하여 계층구조 만들기

- ProductCard
- Cart
- …

### (3) 테스트 코드 통과하기

## 심화과제: Props drilling

- 이번 심화과제는 Context나 Jotai를 사용해서 Props drilling을 없애는 것입니다.
- 어떤 props는 남겨야 하는지, 어떤 props는 제거해야 하는지에 대한 기준을 세워보세요.
- Context나 Jotai를 사용하여 상태를 관리하는 방법을 익히고, 이를 통해 컴포넌트 간의 데이터 전달을 효율적으로 처리할 수 있습니다.

# 2. 목표

**이번 심화과제는 Context나 Jotai를 사용해서 Props drilling을 없애기 입니다.**

- basic에서 열심히 컴포넌트를 분리해주었겠죠?
- 아마 그 과정에서 container - presenter 패턴으로 만들어졌기에 props drilling이 상당히 불편했을거에요.
- 그래서 심화과제에서는 props drilling을 제거하는 작업을 할거에요.
  - 전역상태관리가 아직 낯설다 - jotai를 선택해주세요 (참고자료 참고)
  - 나는 깊이를 공부해보고 싶아. - context를 선택해서 상태관리를 해보세요.

### (1) 요구사항

- 불필요한 props를 제거하고, 필요한 props만을 전달하도록 개선합니다.
- Context나 Jotai를 사용하여 상태를 관리합니다.
- 테스트 코드를 통과합니다.

### (2) 힌트

- UI 컴포넌트와 엔티티 컴포넌트는 각각 props를 다르게 받는게 좋습니다.
  - UI 컴포넌트는 재사용과 독립성을 위해 상태를 최소화하고,
  - 엔티티 컴포넌트는 가급적 엔티티를 중심으로 전달받는 것이 좋습니다.
- 특히 콜백의 경우,
  - UI 컴포넌트는 이벤트 핸들러를 props로 받아서 처리하도록 해서 재사용성을 높이지만,
  - 엔티티 컴포넌트는 props가 아닌 컴포넌트 내부에서 상태를 관리하는 것이 좋습니다.
