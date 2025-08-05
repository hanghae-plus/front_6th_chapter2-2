# 📋 개요

이 문서는 React 쇼핑몰 프로젝트의 리팩토링 과정을 단계별로 기록합니다.
목표는 코드의 가독성, 유지보수성, 확장성을 향상시키고 Clean Code 원칙을 준수하는 것입니다.

# 과제 목표

## 기본과제: 거대 단일 컴포넌트 리팩토링

- **컴포넌트 계층 분리**
  - 코드의 계층과 경계를 이해하고 코드를 어떻게 잘 분리를 해두는게 좋은가?
  - 계층을 이해하고 분리하여 정리정돈을 하는 기준이나 방법 등을 습득
- **엔티티 중심 설계**
  - 엔티티를 다루는 상태와 그렇지 않은 상태 구분
  - 엔티티를 다루는 컴포넌트/훅과 그렇지 않은 컴포넌트/훅 분리
  - 엔티티를 다루는 함수와 유틸리티 함수 분리
- **계층의 분리 과정에서 순수함수의 개념과 디자인 패턴의 이해**
- **비즈니스 로직을 커스텀 훅과 유틸 함수로 적절하게 분리**
- **테스트 코드 통과**

## 심화과제: Props drilling 제거

- **Context나 Jotai를 사용한 전역 상태 관리**
- **UI 컴포넌트와 엔티티 컴포넌트의 props 설계 원칙**
- **Container-Presenter 패턴에서 전역 상태 관리로 전환**

# 과제 원칙

## 기본과제 원칙

- **엔티티 중심 설계**: 엔티티(cart, product, coupon)를 기준으로 계층 분리
- **단일 책임 원칙**: 각 컴포넌트/훅/함수는 하나의 명확한 책임만 가짐
- **계층 분리**: Component, Hook, Function 계층을 명확히 구분
- **테스트 코드 통과**: 모든 기능이 테스트를 통과해야 함

## 심화과제 원칙

- **UI 컴포넌트**: 재사용과 독립성을 위해 상태를 최소화
- **엔티티 컴포넌트**: 엔티티를 중심으로 props 설계
- **전역 상태 관리**: Context 또는 Jotai를 사용하여 props drilling 제거

# 🎯 리팩토링 목표

- **가독성**: 코드를 쉽게 이해할 수 있도록 개선
- **유지보수성**: 변경과 확장이 용이한 구조로 개선
- **재사용성**: 공통 로직을 분리하여 재사용 가능하게 구성
- **테스트 가능성**: 단위 테스트가 용이한 구조로 개선
- **성능**: 불필요한 렌더링과 연산 최소화

# 📈 진행 상황

## ✅ Phase 1: 개발 환경 설정 (완료)

### 1.1 Clean Code 분석 ✅

- **목적**: 현재 코드의 문제점 파악 및 리팩토링 우선순위 결정
- **완료 일시**: 2024년 진행
- **작업 내용**:
  - `src/basic/App.tsx` (1,502줄) 전체 분석
  - 7개 주요 클린 코드 원칙 위반 사항 발견
  - **심각한 문제점**:
    - Single Responsibility 위반 (7개 도메인 혼재)
    - 함수 길이 위반 (최대 1,030줄 JSX)
    - DRY 원칙 위반 (10개 이상 중복 패턴)
    - 매직 넘버 남용 (8개 이상)
    - 높은 결합도 및 낮은 응집도
  - **분석 결과**: `docs/clean-code-analysis.md` 문서화
- **검증**: 구체적인 개선 방안 및 우선순위 수립
- **다음 작업**: Phase 1.3 매직 넘버 상수화부터 시작

### 1.2 Prettier 설정 ✅

- **목적**: 일관된 코드 포맷팅 적용
- **완료 일시**: 2024년 진행
- **작업 내용**:
  - `prettier` 패키지 설치 (v3.6.2)
  - `.prettierrc` 설정 파일 생성
    - 세미콜론 사용 (`semi: true`)
    - 더블쿼트 사용 (`singleQuote: false`)
    - 80자 줄바꿈 (`printWidth: 80`)
    - 2칸 탭 (`tabWidth: 2`)
    - ES5 트레일링 콤마 (`trailingComma: "es5"`)
  - `.prettierignore` 파일 생성
  - `package.json`에 스크립트 추가:
    - `"format": "prettier --write ."`
    - `"format:check": "prettier --check ."`
  - VSCode 자동 포맷팅 설정 (`.vscode/settings.json`)
- **검증**: 전체 프로젝트에 prettier 적용 완료
- **명령어**: `pnpm format`, `pnpm format:check`

### 1.3 Vite 절대 경로 설정 ✅

- **목적**: 복잡한 상대 경로를 절대 경로로 대체하여 가독성 향상
- **완료 일시**: 2024년 진행
- **작업 내용**:
  - `vite.config.ts`에 alias 설정 추가:
    - `@`: `/src` (기본 src 폴더)
    - `@components`: `/src/components`
    - `@hooks`: `/src/hooks`
    - `@utils`: `/src/utils`
    - `@types`: `/src/types`
    - `@constants`: `/src/constants`
    - `@models`: `/src/models`
  - `tsconfig.app.json`에 path mapping 설정:
    - `baseUrl`: `.`
    - `paths` 객체에 모든 alias 매핑 추가
- **검증**: TypeScript 컴파일 오류 없음 확인 (`npx tsc --noEmit`)
- **사용 예시**:
  ```typescript
  // 기존: import { CartItem } from "../types";
  // 개선: import { CartItem } from "@/types";
  ```

## ⚡ Phase 2: 긴급 개선 사항 (진행중)

### 2.1 매직 넘버 상수화 ✅

- **목적**: 코드 가독성 향상 및 유지보수성 증대
- **작업 내용**:
  - [x] 도메인별 constants 파일 생성 및 분리
    - `coupon.constants.ts` - 쿠폰 도메인 상수
    - `cart.constants.ts` - 장바구니 도메인 상수
    - `discount.constants.ts` - 할인 도메인 상수
    - `product.constants.ts` - 상품/재고 도메인 상수
    - `calculation.constants.ts` - 수학 계산 상수
    - `notification.constants.ts` - 알림 시스템 상수
    - `search.constants.ts` - 검색 기능 상수
    - `validation.constants.ts` - 폼 검증 상수
    - `defaults.constants.ts` - 기본값 상수
  - [x] 발견된 8개 이상의 매직 넘버 상수화 완료
    - [x] `NOTIFICATION_TIMEOUT_MS = 3000`
    - [x] `SEARCH_DEBOUNCE_DELAY_MS = 500`
    - [x] `COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE = 10000`
    - [x] `DISCOUNT.BULK_PURCHASE_BONUS_RATE = 0.05`
    - [x] `DISCOUNT.MAX_DISCOUNT_RATE = 0.5`
    - [x] `STOCK.LOW_STOCK_THRESHOLD = 5`
    - [x] `PRODUCT_LIMITS.MAX_STOCK = 9999`
    - [x] `COUPON_LIMITS.MAX_DISCOUNT_AMOUNT = 100000`
    - [x] `MATH.PERCENTAGE_TO_DECIMAL = 100`
  - [x] App.tsx에서 모든 상수 import 및 적용 완료
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 테스트 코드 통과
  - [x] 모든 기능 정상 작동
- **개선 효과**: 매직넘버 제거로 코드 가독성 및 유지보수성 크게 향상

### 2.2 중복 코드 제거 (localStorage 패턴) ✅

- **목적**: DRY 원칙 준수 및 코드 재사용성 향상
- **완료 일시**: 2024년 진행
- **작업 내용**:
  - [x] `src/basic/hooks/useLocalStorage.ts` 커스텀 훅 생성
    - `[storedValue, setValue]` 형태로 단순화
    - 타입 안전성 보장 (`<T>` 제네릭 사용)
    - 에러 처리 및 로깅 포함
    - 다른 탭 동기화 지원 (`storage` 이벤트 리스너)
    - 함수형 업데이트 지원 (`(prev: T) => T`)
  - [x] localStorage 초기화 로직 공통화 (3개 패턴 통합)
    - `products`, `cart`, `coupons` 상태 모두 useLocalStorage 사용
    - 중복된 `useEffect` 로직 제거
    - 일관된 에러 처리 및 초기화 패턴
  - [x] 데이터 파일 분리 (`src/basic/data/`)
    - `product.data.ts` - 초기 상품 데이터
    - `coupon.data.ts` - 초기 쿠폰 데이터
    - `index.ts` - 데이터 export 통합
  - [x] App.tsx에서 중복 제거된 로직 적용
    - 119줄 코드 감소로 대폭 간소화
    - 상태 관리 로직 단순화
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 기능 정상 작동
  - [x] localStorage 동기화 정상 작동
- **개선 효과**:
  - 코드 중복 제거로 유지보수성 향상
  - 타입 안전성 강화
  - 상태 관리 로직 일관성 확보

#### 로컬스토리지 관련 로직 먼저 분리하는 이유

- 상태 관리의 기초가 되므로 컴포넌트 분리 전에 공통 로직이 정리되는 편이 컴포넌트 분리 시 용이할 듯
- 단순히 로컬 스토리지에서 데이터 가져오고 데이터 초기화하는 로직만 있고, 다른 로직과 의존성이 없기 때문에 바로 분리가 가능해보임

### 2.3 함수형 프로그래밍 원칙 적용 - getFormattedProductPrice 개선 ✅

- **목적**: 함수형 프로그래밍 원칙에 따른 순수 함수 변환 및 비즈니스 로직 분리
- **완료 일시**: 2024년 진행
- **작업 내용**:
  - [x] **함수형 프로그래밍 문제점 분석**:
    - 순수 함수가 아님 (외부 상태 의존: products, cart, isAdmin)
    - 명시적 의존성 부족 (함수 시그니처만으로 의존성 파악 불가)
    - 단일 책임 원칙 위반 (재고 확인 + 가격 포맷팅 + 권한 확인 혼재)
    - 불필요한 파라미터 (productId로 price 조회 가능한데 price 별도 전달)
  - [x] **순수 함수로 변환**:
    - `src/basic/models/product.model.ts` 파일 생성
    - 모든 외부 상태를 명시적 파라미터로 변경
    - 함수 시그니처 개선: `getFormattedProductPrice({ productId, products, cart, isAdmin })`
  - [x] **단일 책임 원칙 적용**:
    - `isProductSoldout`: 상품 품절 상태 확인 전용 함수
    - `formatProductPrice`: 사용자 권한별 가격 포맷팅 전용 함수
    - `getFormattedProductPrice`: 조합 함수로 리팩토링
  - [x] **불필요한 파라미터 제거**:
    - productId로 products에서 price를 조회하도록 개선
    - 중복된 데이터 전달 제거
  - [x] **App.tsx 적용**:
    - 함수형 접근법으로 호출 방식 변경
    - 객체 구조분해 할당으로 파라미터 전달
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 테스트 코드 통과
  - [x] 모든 기능 정상 작동
- **개선 효과**:
  - 순수 함수 변환으로 테스트 가능성 크게 향상
  - 명시적 의존성으로 함수 동작 예측 가능
  - 단일 책임 원칙으로 코드 가독성 및 유지보수성 향상
  - 재사용성 개선 (다른 컴포넌트에서도 쉽게 사용 가능)

### 2.4 계산 함수 분리

- **목적**: README 요구사항에 따른 계산 함수 분리
- **작업 예정**:
  - [ ] `calculateItemTotal` - 개별 상품 총액 계산
  - [ ] `getMaxApplicableDiscount` - 최대 적용 가능 할인율 계산
  - [ ] `calculateCartTotal` - 장바구니 전체 총액 계산
  - [ ] `updateCartItemQuantity` - 장바구니 상품 수량 업데이트
- **작업 내용**:
  - [ ] `src/basic/utils/calculations.ts` 파일 생성
  - [ ] App.tsx에서 계산 함수들을 유틸리티로 분리
  - [ ] 함수 시그니처 개선 (cart 파라미터 추가 등)
  - [ ] App.tsx에서 분리된 함수들 import하여 사용
- **검증 예정**:
  - [ ] TypeScript 컴파일 오류 없음
  - [ ] 테스트 코드 통과
  - [ ] 모든 계산 로직 정상 작동
- **개선 효과**: 계산 로직 분리로 재사용성 및 테스트 가능성 향상

### 2.5 긴 함수 분할

- **목적**: 함수 길이 20줄 이하 준수
- **작업 예정**:
  - [ ] `addToCart` 함수 분할 (38줄 → 4개 함수로 분할)
  - [ ] `handleProductSubmit` 함수 분할 (21줄 → 3개 함수로 분할)
  - [ ] 거대한 JSX return문 컴포넌트 분리 준비

## 🔄 Phase 3: 구조적 코드 개선 (예정)

### 3.1 엔티티 컴포넌트와 UI 컴포넌트 분리 (README 요구사항)

- **목적**: README 요구사항에 따른 계층구조 만들기
- **작업 예정**:
  - [ ] **ProductCard** - 상품 카드 컴포넌트
  - [ ] **Cart** - 장바구니 컴포넌트
  - [ ] **AdminPage** - 관리자 페이지 컴포넌트
  - [ ] **ProductList** - 상품 목록 컴포넌트
  - [ ] **NotificationSystem** - 알림 시스템 컴포넌트
  - [ ] **SearchBar** - 검색 기능 컴포넌트

### 3.2 커스텀 훅 분리 (README 요구사항)

- **목적**: README 요구사항에 따른 상태 관리 훅 분리
- **작업 예정**:
  - [ ] **useCart** - 장바구니 관련 모든 로직
  - [ ] **useCoupon** - 쿠폰 관련 모든 로직
  - [ ] **useProduct** - 상품 관리 관련 모든 로직
  - [x] **useLocalStorage** - 로컬스토리지 관리 (완료)
  - [ ] **useNotifications** - 알림 시스템 로직
  - [ ] **useSearch** - 검색 및 필터링 로직
  - [ ] **useDebounce** - 디바운스 로직 (재사용 가능)

### 3.3 타입 시스템 강화

- **목적**: 타입 안정성 향상 및 명확한 인터페이스
- **작업 예정**:
  - [ ] `ProductWithDisplayInfo` 인터페이스 명확화
  - [ ] 각 도메인별 타입 정의 파일 분리
  - [ ] Generic 타입 적용 (useLocalStorage 등)
  - [ ] 타입 가드 함수 구현

### 3.4 유틸리티 및 서비스 레이어 분리

- **목적**: 공통 로직 재사용성 향상
- **작업 예정**:
  - [ ] `formatters.ts` - 가격 포맷팅 등
  - [ ] `validators.ts` - 유효성 검증 로직
  - [ ] `cartCalculators.ts` - 장바구니 계산 로직
  - [ ] `stockManager.ts` - 재고 관리 로직

## 🧪 Phase 4: 테스트 및 검증 (예정)

### 4.1 테스트 코드 통과 (README 요구사항)

- **목적**: README 요구사항에 따른 테스트 코드 통과
- **작업 예정**:
  - [x] 기존 테스트 코드 통과 확인
  - [ ] 리팩토링 후 테스트 코드 통과 보장
  - [ ] 새로운 기능에 대한 테스트 추가

### 4.2 단위 테스트 작성

- **목적**: 코드 품질 보장
- **작업 예정**:
  - [ ] 유틸리티 함수 테스트
  - [ ] 커스텀 훅 테스트
  - [ ] 컴포넌트 테스트
  - [ ] 비즈니스 로직 테스트

### 4.3 통합 테스트 작성

- **목적**: 전체 시스템 동작 검증
- **작업 예정**:
  - [ ] 사용자 시나리오 테스트
  - [ ] API 통신 테스트
  - [ ] 상태 변화 테스트

## 🚀 Phase 5: 성능 최적화 (예정)

### 5.1 렌더링 최적화

- **작업 예정**:
  - [ ] React.memo 적용
  - [ ] useMemo, useCallback 최적화
  - [ ] 컴포넌트 분할
  - [ ] 지연 로딩 적용

### 5.2 번들 최적화

- **작업 예정**:
  - [ ] 코드 스플리팅
  - [ ] Tree shaking 최적화
  - [ ] 이미지 최적화

## 🔄 Phase 6: 심화과제 - Props drilling 제거 (예정)

### 6.1 전역 상태 관리 도입

- **목적**: README 심화과제 요구사항 - Context 또는 Jotai 사용
- **작업 예정**:
  - [ ] **Context API** 또는 **Jotai** 선택 및 설정
  - [ ] 전역 상태 구조 설계
  - [ ] 기존 props drilling 제거
  - [ ] UI 컴포넌트와 엔티티 컴포넌트 props 설계

### 6.2 Container-Presenter 패턴에서 전역 상태 관리로 전환

- **목적**: props drilling 문제 해결
- **작업 예정**:
  - [ ] 불필요한 props 제거
  - [ ] 필요한 props만 전달하도록 개선
  - [ ] 엔티티 컴포넌트 내부 상태 관리
  - [ ] UI 컴포넌트 재사용성 향상

### 6.3 테스트 코드 통과

- **목적**: 심화과제 테스트 코드 통과
- **작업 예정**:
  - [ ] 전역 상태 관리 후 테스트 코드 수정
  - [ ] 모든 기능 정상 작동 확인
  - [ ] 성능 최적화 검증

# 📊 체크리스트

## 개발 환경 설정

- [x] Clean Code 분석 및 문서화
- [x] Prettier 설정 및 적용
- [x] Vite 절대 경로 설정
- [ ] ESLint 규칙 정비
- [ ] 허스키(Husky) pre-commit 훅 설정

## 코드 품질

- [x] 매직 넘버 상수화
- [x] 중복 코드 제거 (localStorage 패턴)
- [ ] 함수 단일 책임 원칙 적용
- [ ] 네이밍 컨벤션 통일

## 아키텍처

- [ ] 폴더 구조 개선
- [ ] 계층별 책임 분리
- [ ] 의존성 역전 원칙 적용

## 테스트

- [ ] 단위 테스트 커버리지 80% 이상
- [ ] 통합 테스트 작성
- [ ] E2E 테스트 작성

# 🏗️ 아키텍처 설계 가이드

## 폴더 구조 및 역할

### **hooks/ 폴더**

**목적**: 상태 관리 및 비즈니스 로직을 React 훅으로 캡슐화

**특징:**

- ✅ **React 훅**: `use` 접두사 사용
- ✅ **상태 관리**: 컴포넌트의 상태를 관리
- ✅ **부작용 포함**: localStorage, 이벤트 리스너 등
- ✅ **UI와 연동**: 컴포넌트에서 직접 사용

**예시:**

```typescript
// useCart.ts - 장바구니 상태 관리
export function useCart() {
  // 장바구니 상태, 추가/삭제/수량 변경 로직
  // localStorage 연동, 쿠폰 적용 등
}

// useProducts.ts - 상품 관리
// useCoupons.ts - 쿠폰 관리
```

### **models/ 폴더**

**목적**: 순수한 비즈니스 로직 (Pure Functions)

**특징:**

- ✅ **순수 함수**: 같은 입력 → 항상 같은 출력
- ✅ **부작용 없음**: 외부 상태 변경 없음
- ✅ **UI 독립적**: React와 무관한 로직
- ✅ **테스트 용이**: 모든 데이터를 파라미터로 받음

**예시:**

```typescript
// cart.ts - 장바구니 계산 로직
export const calculateCartTotal = (cart: CartItem[], coupon: Coupon) => {
  // 순수한 계산 로직만
};

// product.ts - 상품 관련 로직
// discount.ts - 할인 계산 로직
```

### **utils/ 폴더**

**목적**: 재사용 가능한 유틸리티 함수들

**특징:**

- ✅ **범용성**: 여러 곳에서 재사용 가능
- ✅ **도메인 독립적**: 특정 비즈니스와 무관
- ✅ **단순한 변환**: 포맷팅, 검증, 변환 등

**예시:**

```typescript
// formatters.ts - 포맷팅 함수들
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

// validators.ts - 검증 함수들
// utils/hooks/ - 범용 훅들 (useLocalStorage, useDebounce 등)
```

## 아키텍처 계층 구조

```
┌─────────────────┐
│   Components    │ ← UI 레이어
├─────────────────┤
│     Hooks       │ ← 상태 관리 레이어
├─────────────────┤
│     Models      │ ← 비즈니스 로직 레이어
├─────────────────┤
│     Utils       │ ← 유틸리티 레이어
└─────────────────┘
```

## 의존성 방향 및 사용 패턴

```typescript
// 1. Components에서 Hooks 사용
function CartComponent() {
  const { cart, addToCart } = useCart(); // hooks/
  return <div>...</div>;
}

// 2. Hooks에서 Models 사용
function useCart() {
  const cart = useLocalStorage('cart', []); // utils/hooks/
  const total = calculateCartTotal(cart, coupon); // models/
  return { cart, total };
}

// 3. Models에서 Utils 사용
function calculateCartTotal(cart, coupon) {
  const formattedPrice = formatPrice(total); // utils/
  return formattedPrice;
}
```

## 코드 분리 원칙

1. **단일 책임**: 각 파일/함수는 하나의 명확한 책임만 가짐
2. **의존성 역전**: 상위 계층이 하위 계층에 의존하지 않음
3. **재사용성**: 공통 로직은 utils로, 도메인 로직은 models로 분리
4. **테스트 가능성**: 순수 함수는 models에, 부작용은 hooks에 배치

# 📝 작업 규칙

## 절대 원칙

- 코드의 동작이나 구현이 바뀌면 안되고 반드시 구조 변경(리팩토링)만 진행
- 공통으로 쓰이는 파일만 공통 폴더에 배치
- 비즈니스 로직이 담긴 경우, 관심사끼리 묶어 폴더로 관리
- 모든 테스트 코드가 통과해야 함 (`npx vitest run`)
- 결과 파일은 `main.basic.js`를 기준으로 적용

## Clean Code 원칙

- **DRY**: 중복 코드 제거
- **KISS**: 단순하고 명확한 코드 작성
- **YAGNI**: 불필요한 코드 작성 금지
- **Single Responsibility**: 함수는 20줄 이하, 단일 책임

## 네이밍 규칙

- **예측 가능**: 이름으로 값, 타입, 반환값 예측 가능
- **맥락적**: 설명적 형용사나 명사 추가
- **명확**: 불필요한 단어 제거하되 명확한 의미 유지
- **간결**: 간단하지만 역할과 목적을 명확히 전달
- **일관성**: 동일한 의도에는 동일한 용어 사용

## 🔄 다음 작업 (우선순위 순)

### 기본과제 (현재 진행중)

1. **Phase 2.4: 계산 함수 분리** - README 요구사항 (다음 우선순위)
2. **Phase 2.5: 긴 함수 분할** - 20줄 이하 함수 규칙 준수
3. **Phase 3.1: 엔티티 컴포넌트와 UI 컴포넌트 분리** - README 요구사항
4. **Phase 3.2: 커스텀 훅 분리** - useCart, useCoupon, useProduct
5. **Phase 3.3: 타입 시스템 강화** - 더 강력한 타입 안정성 확보
6. **Phase 4: 테스트 코드 통과** - README 요구사항

### 심화과제 (기본과제 완료 후)

6. **Phase 6: Props drilling 제거** - Context 또는 Jotai 사용
7. **Phase 5: 성능 최적화** - 렌더링 및 번들 최적화

### 📋 체크리스트 업데이트

현재 진행 상황을 반영하여 체크리스트가 업데이트되었습니다:

- **완료**: ✅ 매직 넘버 상수화 (Phase 2.1), ✅ 중복 코드 제거 (Phase 2.2), ✅ 함수형 프로그래밍 원칙 적용 (Phase 2.3)
- **다음 우선순위**: 계산 함수 분리 (Phase 2.4)
- **기본과제**: 엔티티 컴포넌트 분리, 커스텀 훅 분리, 테스트 코드 통과
- **심화과제**: Props drilling 제거 (Context/Jotai), 성능 최적화

---

**마지막 업데이트**: 2024년 (Clean Code 분석, Prettier, 절대 경로 설정, 매직넘버 상수화, 함수형 프로그래밍 원칙 적용 완료)
