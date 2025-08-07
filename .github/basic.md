# 2. 목표

## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제 체크리스트

- [ ] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [ ] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [ ] 계산함수는 순수함수로 작성이 되었나요?
- [ ] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [ ] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [ ] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

모든 소프트웨어에는 적절한 책임과 계층이 존재합니다. 하나의 계층(Component)만으로 소프트웨어를 구성하게 되면 나중에는 정리정돈이 되지 않은 코드를 만나게 됩니다. 예전에는 이러한 BestPractice에 대해서 혼돈의 시대였지만 FE가 진화를 거듭하는 과정에서 적절한 계측에 대한 합의가 이루어지고 있는 상태입니다.

React의 주요 책임 계층은 Component, hook, function 등이 있습니다. 그리고 주요 분류 기준은 **엔티티**가 되어 줍니다.

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

이번 과제의 목표는 이러한 계층을 이해하고 분리하여 정리정돈을 하는 기준이나 방법등을 습득하는데 있습니다.

제시된 코드는 각각의 컴포넌트에 모든 비즈니스 로직이 작성되어 있습니다. 여기에서 custom hook과 util 함수를 적절하게 분리하고, **테스트 코드를 통과할 수 있도록 해주세요.**

basic의 경우 상태관리를 쓰지 않고 작업을 해주세요.

## (1) 요구사항

### 1) 장바구니 페이지 요구사항

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

### 2) 관리자 페이지 요구사항

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

## (2) 코드 개선 요구사항

### 1) cart, product에 대한 계산 함수 분리

- calculateItemTotal
- getMaxApplicableDiscount
- calculateCartTotal
- updateCartItemQuantity

### 2) 상태를 다루는 hook, 유틸리티 hook 분리

- useCart
- useCoupon
- useProduct
- useLocalStorage

### 3) 엔티티 컴포넌트와 UI 컴포넌트 분리하여 계층구조 만들기

- ProductCard
- Cart
- …

## (3) 테스트 코드 통과하기
