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

### 과제를 하면서 내가 제일 신경 쓴 부분은 무엇인가요?

1. **함수 분리와 책임 분담**

   - 기존 `formatPrice` 함수가 너무 많은 책임을 가지고 있었습니다. admin 여부 확인, 도메인 체크, 카트 데이터와의 결합, 개수 계산 등 여러 로직이 하나의 함수에 얽혀있었습니다.
   - 이를 논리적으로 분리하여 `getRefinedProduct`로 상품 데이터와 장바구니 데이터를 결합한 새로운 상품 객체를 정의하고, `displayPrice`로 순수하게 가격 표시 로직만 담당하도록 리팩토링했습니다.
   - `displayPrice`는 admin 도메인 여부와 관계없이 독립적으로 suffix, prefix를 받아 자유롭게 가격을 노출 시킬 수 있도록 리팩토링하였습니다.

2. **MVVM 패턴으로 계층 구조의 명확한 구분**

   - **View Layer (UI Components)**: 사용자 인터페이스 표시
   - **ViewModel Layer (Hooks)**: 상태 관리와 비즈니스 로직 조합
   - **Model Layer (Store)**: 데이터 저장과 상태 관리

3. **불필요한 상태, 계산 함수 제거**

불필요한 상태를 사용하고 있는 ProductAccordion 컴포넌트에서 하나의 상태만 사용하도록 리팩토링

```tsx
// Basic 버전 - 복잡한 상태 관리
const [showProductForm, setShowProductForm] = useState(false);
const [editingProduct, setEditingProduct] = useState<string | null>(null);
const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
  undefined
);

// Advanced 버전 - 단순화된 상태 관리
const [initProductFormData, setInitProductFormData] = useState<Product | null>(
  null
);
const showProductForm = initProductFormData !== null;
```

### 4. useSearchParams 활용한 URL 기반 상태 관리

기존의 상태 관리 방식을 URL 기반 상태 관리로 개선하여 더 나은 사용자 경험과 상태 동기화를 구현했습니다.

```ts
import { useState, useEffect, useCallback } from "react";

/**
 * useState와 useEffect를 활용한 간단한 useSearchParams 훅
 * URL의 search parameters를 구독하고 업데이트할 수 있습니다.
 */
export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void
] {
  const [searchParams, setSearchParamsState] = useState(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  });

  // URL 변경 감지
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    const handleSearchParamsChanged = (event: CustomEvent) => {
      setSearchParamsState(event.detail.searchParams);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener(
      "searchParamsChanged",
      handleSearchParamsChanged as EventListener
    );

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener(
        "searchParamsChanged",
        handleSearchParamsChanged as EventListener
      );
    };
  }, []);

  // searchParams 업데이트 함수
  const setSearchParams = useCallback(
    (params: URLSearchParams | Record<string, string>) => {
      if (typeof window === "undefined") return;

      const newSearchParams =
        params instanceof URLSearchParams
          ? params
          : new URLSearchParams(params);

      const newUrl = `${window.location.pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }${window.location.hash}`;

      history.replaceState(null, "", newUrl);

      // replaceState 후 상태 동기화를 위한 커스텀 이벤트 발생
      window.dispatchEvent(
        new CustomEvent("searchParamsChanged", {
          detail: { searchParams: newSearchParams },
        })
      );
    },
    []
  );

  return [searchParams, setSearchParams];
}
```

#### 4.1 Zod를 활용한 product query hook 구성

```tsx
// useFilterSearchParams.ts - URL 기반 상태 관리 전용 Hook
export default function useFilterSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 데이터 변환 로직
  const filterSearchParams: filterSearchParamsSchemaType = React.useMemo(() => {
    const paramsObject = Object.fromEntries(searchParams.entries());
    const validSearchParams = filterSearchParamsSchema.safeParse(paramsObject);

    if (!validSearchParams.success) {
      return { searchTerm: "" };
    }

    return { ...validSearchParams.data };
  }, [searchParams]);

  // 액션 함수
  const setFilterSearchParams = (
    value: Partial<filterSearchParamsSchemaType>
  ) => {
    const newSearchParams = { ...filterSearchParams, ...value };

    // 빈 값들은 제거하고 URL에 설정
    const filteredParams = Object.fromEntries(
      Object.entries(newSearchParams).filter(
        ([_, v]) => v !== "" && v !== undefined
      )
    );

    setSearchParams(filteredParams);
  };

  return { filterSearchParams, setFilterSearchParams };
}
```

#### 4.2 기존에 단순히 searchTerm으로만 쿼리하던 로직을 향후 다른 query를 반영할 수 있도록 확장성 있게 구성

```tsx
/**
 * 상품 검색 필터링
 */
export const filterProducts = (
  products: Product[],
  filterQuery: filterSearchParamsSchemaType
): Product[] => {
  return filterProductsBySearchTerm(products, filterQuery.searchTerm ?? "");
};

const filterProductsBySearchTerm = (
  products: Product[],
  searchTerm: string
) => {
  if (!searchTerm.trim()) {
    return products;
  }
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
```

### 과제를 다시 해보면 더 잘 할 수 있었겠다 아쉬운 점이 있다면 무엇인가요?

### 1. Hook에서 데이터와 액션의 분리가 안됨

현재 `useCart`와 같은 Hook에서 데이터(`cart`)와 액션 함수들(`addToCart`, `updateCartItemQuantity` 등)을 함께 제공하고 있는데, 이 부분이 함수형 프로그래밍 원칙에 완전히 부합하는지 의문이 들었습니다.

**고민했던 점:**

- 데이터와 액션을 완전히 분리하면 순수성은 높아지지만 DX(Developer Experience)가 나빠질 수 있음
- 분리하지 않으면 편리하지만 Hook의 책임이 모호해질 수 있음

### 2. Handle 함수에서 validation을 담당

현재 구현에서는 `handleUpdateQuantity` 같은 함수에서 매번 검증 코드를 작성하고 있어서 재사용성이 떨어지는 문제가 있었습니다. 아래 방법들중 하나를 채택해서 수정하는게 좋았을 것 같습니다.

1. **액션 함수 내부에서 에러 처리**

   - 장점: 재사용성 높음
   - 단점: Hook이 UI 의존성을 가질 수 있음

2. **전용 Handle Hook 분리**

   - 장점: 관심사 분리 명확
   - 단점: Hook이 너무 세분화될 수 있음

3. **에러 핸들러 패턴**

   - 장점: 유연한 에러 처리
   - 단점: 사용하는 쪽에서 매번 핸들러 전달 필요

## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문

1. 위에서 얘기한 아쉬운점에 대한 내용들에 대해서 의견을 받아보고 싶습니다.

2. MVVM패턴으로 분리가 되었다고 생각했는데, 지금 분리된 구조가 MVVM 패턴이 맞을까요?
   추가적으로 테오는 어떤 패턴을 가장 선호하시나요?

3. 전체적으로 제가 나눠놓은 함수들이 함수형패턴에 위배되지 않는지 피드백 받고싶습니다.
