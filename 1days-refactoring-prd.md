# Day 1: Product 도메인 완전 분리 (컴포넌트 → 상수 → 순수함수 → 상태관리)

## 목표

- Product 도메인의 모든 요소를 단계별로 완전 분리
- 컴포넌트 → 상수 → 순수함수 → 상태관리 순서로 진행
- 테스트를 계속 통과시키며 점진적 리팩토링

## 작업 범위

### 1단계: Jotai 설치 및 기본 설정

```bash
npm install jotai
```

### 2단계: Product 관련 컴포넌트 분리

```typescript
// src/advanced/components/ProductList.tsx
export const ProductList: React.FC<{
  products: ProductWithUI[];
  onAddToCart: (product: ProductWithUI) => void;
  isAdmin: boolean;
  onEditProduct?: (product: ProductWithUI) => void;
}>;

// src/advanced/components/ProductCard.tsx
export const ProductCard: React.FC<ProductCardProps>;

// src/advanced/components/ProductForm.tsx (관리자용)
export const ProductForm: React.FC<ProductFormProps>;
```

### 3단계: Product 상수 분리

```typescript
// src/advanced/constants/product.ts
export const initialProducts: ProductWithUI[] = [...]
export const PRODUCT_FORM_INITIAL_STATE = {...}
```

### 4단계: Product 순수함수 분리

```typescript
// src/advanced/utils/productUtils.ts
export const filterProducts = (products: ProductWithUI[], searchTerm: string): ProductWithUI[]
export const generateProductId = (): string
export const validateProductData = (product: Partial<ProductWithUI>): boolean

// src/advanced/utils/formatters.ts
export const formatPrice = (price: number, isAdmin: boolean = false): string
```

### 5단계: Product 상태관리 (Atom + Hook)

```typescript
// src/advanced/models/productAtoms.ts
export const productsAtom = atom<ProductWithUI[]>(initialProducts);
export const searchTermAtom = atom<string>("");
export const debouncedSearchTermAtom = atom<string>("");

// src/advanced/hooks/useProducts.ts
export const useProducts = () => {
  // atom 기반 상태 관리
  // CRUD 함수들
};
```

### 6단계: App.tsx에서 Product 관련 코드 제거 및 연결

- useState들 제거
- 순수함수들 제거
- 컴포넌트 import로 교체

## 테스트 전략

- [ ] 각 단계 완료 후 즉시 테스트 실행
- [ ] 기존 Product 관련 테스트 통과 확인
- [ ] 새로운 유틸리티 함수 단위 테스트

## 성공 기준

1. Product 도메인이 완전히 분리됨
2. App 컴포넌트에서 Product 관련 코드가 모두 제거됨
3. 모든 기존 테스트가 통과함
4. 검색, 상품 관리 기능이 정상 동작함

## 다음 날 준비사항

- Cart 도메인 분석 준비
