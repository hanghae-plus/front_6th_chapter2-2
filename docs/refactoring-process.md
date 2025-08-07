# 📋 개요

이 문서는 React 쇼핑몰 프로젝트의 리팩토링 과정을 단계별로 기록합니다.
목표는 코드의 가독성, 유지보수성, 확장성을 향상시키고 Clean Code 원칙을 준수하는 것입니다.

# 과제 목표

## 개인 목표

### 🤖 AI 활용 전략

- **AI를 코딩 자문으로 활용**: 모든 코딩을 AI에게 맡기지 않고 적절한 역할 분담
- **작업 분담 명확화**: 내가 할 일과 AI가 할 일을 구분하여 효율적으로 진행

### 📝 문서화 개선

- **과정 중심 글쓰기**: 결론 위주의 글쓰기 습관을 개선하여 과정이 드러나는 문서 작성
- **단계별 기록**: 각 단계의 고민과 결정 과정을 상세히 기록

### 🎯 학습 목표

- **실습을 통한 체득**: 과제를 통해 느껴야 하는 것들을 충분히 느끼고 이해하기
- **경험 축적**: 실제 리팩토링 과정에서 얻는 인사이트와 노하우 습득
- **과정 중심 학습**: 과제의 통과 여부의 결론보다는 과정을 통해 배우기
- 다른 항해러 코드 모두 읽기

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

## ⚡ Phase 2: 긴급 개선 사항 (완료)

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

### 2.4 계산 함수 분리 ✅

- **목적**: README 요구사항에 따른 계산 함수 분리 및 함수형 프로그래밍 원칙 적용
- **작업 내용**:
  - [x] **할인 계산 로직 유틸화**:
    - `src/basic/utils/calculation.util.ts` 파일 생성
    - 할인 계산 관련 순수 함수들 구현:
      - `calculateAmountDiscount`: 정액 할인 계산
      - `calculatePercentageDiscount`: 정률 할인 계산
      - `calculateDiscountedPrice`: 할인율 적용 계산
      - `calculateDiscountAmount`: 할인 금액 계산
      - `calculateDiscountPercentage`: 할인율(%) 계산
  - [x] **기존 모델 리팩토링**:
    - `src/basic/models/coupon.model.ts`: 유틸 함수 사용으로 변경
    - `src/basic/models/discount.model.ts`: 중복 함수 제거
    - 함수명 충돌 해결 및 의존성 정리
  - [x] **함수형 프로그래밍 원칙 적용**:
    - 모든 계산 함수를 순수 함수로 구현
    - 외부 상태 의존성 제거
    - 명시적 파라미터 전달로 의존성 명확화
    - 테스트 가능한 구조로 개선
  - [x] **이미 분리 완료된 함수들**:
    - `calculateItemTotal` - 개별 상품 총액 계산 (cart.model.ts)
    - `getMaxApplicableDiscountRate` - 최대 적용 가능 할인율 계산 (discount.model.ts)
    - `calculateCartTotal` - 장바구니 전체 총액 계산 (cart.model.ts)
    - `getRemainingStock` - 상품 재고 계산 (cart.model.ts)
  - [x] **계산 함수 추가 분리 완료**:
    - [x] `updateQuantity` - 장바구니 상품 수량 업데이트 (useCart.ts로 분리)
    - [x] `addToCart` - 장바구니에 상품 추가 (useCart.ts로 분리)
    - [x] `removeFromCart` - 장바구니에서 상품 제거 (useCart.ts로 분리)
    - [x] `calculateTotalItemCount` - 장바구니 총 상품 수 계산 (useCart.ts로 분리)
    - [x] `applyCoupon` - 쿠폰 적용 로직 (useCoupon.ts로 분리)
    - [x] `completeOrder` - 주문 완료 로직 (useCart.ts로 분리)
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 함수명 충돌 해결 완료
  - [x] 의존성 정리 완료
  - [x] 모든 테스트 코드 통과 (63개 테스트)
- **개선 효과**:
  - 할인 계산 로직의 재사용성 크게 향상
  - 함수형 프로그래밍 원칙 준수로 테스트 가능성 증대
  - 중복 코드 제거로 유지보수성 향상
  - 명확한 함수 시그니처로 코드 가독성 개선

### 2.5 Custom Hook 분리 ✅

- **목적**: README 요구사항에 따른 상태 관리 훅 분리 및 거대 컴포넌트 리팩토링
- **작업 내용**:
  - [x] **useCart 훅 분리** (`src/basic/hooks/useCart.ts`):
    - 장바구니 상태 관리 로직 통합
    - `addToCart`, `removeFromCart`, `updateQuantity` 함수 포함
    - `calculateTotalItemCount`, `completeOrder` 로직 포함
    - localStorage 연동 및 에러 처리
    - 154줄의 포괄적인 장바구니 관리 로직
  - [x] **useCoupon 훅 분리** (`src/basic/hooks/useCoupon.ts`):
    - 쿠폰 상태 관리 및 적용 로직
    - `applyCoupon`, `removeCoupon` 함수 포함
    - 쿠폰 유효성 검증 로직
    - 51줄의 쿠폰 관리 로직
  - [x] **useNotification 훅 분리** (`src/basic/hooks/useNotification.ts`):
    - 알림 시스템 상태 관리
    - 자동 사라짐 타이머 로직
    - 알림 타입별 처리 로직
    - 33줄의 알림 관리 로직
  - [x] **useProducts 훅 분리** (`src/basic/hooks/useProducts.ts`):
    - 상품 목록 상태 관리
    - 상품 추가/수정/삭제 로직
    - 재고 관리 로직
    - 50줄의 상품 관리 로직
  - [x] **App.tsx 대폭 간소화**:
    - 264줄 감소로 거대 컴포넌트 문제 해결
    - 단일 책임 원칙(SRP) 적용
    - 관심사별 로직 분리로 가독성 향상
    - 컴포넌트 간 결합도 감소
  - [x] **타입 시스템 개선** (`src/types.ts`):
    - 새로운 타입 정의 추가
    - 타입 안정성 강화
    - 15줄 추가로 더 명확한 인터페이스
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 테스트 코드 통과 (63개 테스트)
  - [x] 모든 기능 정상 작동 확인
  - [x] localStorage 동기화 정상 작동
- **개선 효과**:
  - **코드 재사용성**: 각 훅을 다른 컴포넌트에서도 사용 가능
  - **테스트 가능성**: 각 훅을 독립적으로 테스트 가능
  - **유지보수성**: 관심사별 분리로 수정이 용이
  - **가독성**: App.tsx가 264줄 감소로 이해하기 쉬워짐
  - **결합도 감소**: 컴포넌트 간 의존성 최소화

### 2.6 Constants 폴더 구조 정리 ✅

- **목적**: 상수 관리 체계화 및 import 경로 문제 해결
- **작업 내용**:
  - [x] **Constants index.ts 생성** (`src/basic/constants/index.ts`):
    - 모든 상수 파일들을 통합 export
    - import 경로 문제 해결
    - 9개 상수 파일 통합 관리
  - [x] **Import 경로 정리**:
    - `@/basic/constants` 경로로 통합 import 가능
    - 각 상수 파일별 개별 import도 지원
    - TypeScript 컴파일 오류 해결
- **검증**:
  - [x] TypeScript 컴파일 오류 해결
  - [x] 모든 테스트 코드 통과
  - [x] 상수 import 정상 작동
- **개선 효과**:
  - 상수 관리 체계화
  - Import 경로 단순화
  - 코드 일관성 향상

### 2.7 폴더 구조 체계화 및 Import 경로 정리 ✅

- **목적**: 전체 프로젝트의 폴더 구조 체계화 및 일관된 import 패턴 적용
- **작업 내용**:
  - [x] **Index 파일 추가**:
    - `src/basic/constants/index.ts` - 상수 통합 export
    - `src/basic/data/index.ts` - 데이터 통합 export
    - `src/basic/models/index.ts` - 모델 통합 export
  - [x] **Import 경로 정리**:
    - 21개 파일의 import 경로 일관성 개선
    - 통합 import 패턴 적용: `import { COUPON, PRODUCT_LIMITS } from "@/basic/constants"`
    - 개별 import 패턴 유지: `import { COUPON } from "@/basic/constants/coupon"`
  - [x] **코드 품질 개선**:
    - `src/basic/utils/discount.util.ts` 삭제 (0줄 중복 파일)
    - `src/basic/utils/format.util.ts` 함수 시그니처 개선 (locale 기본값 설정)
    - `src/types.ts` 타입 정의 개선
  - [x] **전체 파일 수정**:
    - constants/ 폴더: 6개 파일 수정 (calculation.ts, defaults.ts, notification.ts, product.ts, search.ts, validation.ts)
    - data/ 폴더: 2개 파일 수정 (coupon.data.ts, product.data.ts)
    - hooks/ 폴더: 4개 파일 수정 (useCart.ts, useCoupon.ts, useNotification.ts, useProducts.ts)
    - models/ 폴더: 4개 파일 수정 (cart.model.ts, coupon.model.ts, discount.model.ts, product.model.ts)
    - utils/ 폴더: 2개 파일 수정 (calculation.util.ts, index.ts)
    - App.tsx: 148줄 수정 (import 경로 정리 및 코드 개선)
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 테스트 코드 통과 (63개 테스트)
  - [x] 모든 기능 정상 작동 확인
  - [x] Import 경로 정상 작동
- **개선 효과**:
  - **개발 경험 향상**: 일관된 import 패턴으로 코드 작성 편의성 증대
  - **유지보수성 향상**: 통합 export로 의존성 관리 용이
  - **코드 중복 제거**: 불필요한 파일 삭제로 프로젝트 정리
  - **타입 안정성 강화**: 함수 시그니처 개선으로 더 안전한 코드
- **변경 통계**:
  - 21개 파일 변경: 213줄 추가, 157줄 삭제 (순증가: 56줄)
  - 3개 새 파일 생성 (index.ts 파일들)
  - 1개 파일 삭제 (discount.util.ts)

#### 📌 **설계 목표 및 고민사항**

**1. 직관적인 폴더 구조 설계**

- 폴더명과 파일명만 봐도 역할이 즉시 파악 가능하도록 설계
- 엔티티별로 효율적인 네임스페이스 관리 체계 구축

**2. Import 문 최적화**

- Import 문 개수를 줄이면서도 가독성 유지
- Import된 모듈의 출처와 역할이 명확하게 드러나도록 설계

**3. 네임스페이스 통합 관리**

- 기존: 각 상수를 개별 export (`export const COUPON_MIN_AMOUNT = 10000`)
- 개선: 엔티티별로 네임스페이스 객체로 통합 export (`export const COUPON = { MIN_AMOUNT: 10000 }`)

**4. 일관된 패턴 적용**

- 모든 도메인(constants, data, models)에 동일한 네임스페이스 패턴 적용
- 개발자가 예측 가능한 구조로 코드 작성 경험 향상

### 2.8 Header 컴포넌트 분리 및 리팩토링 ✅

- **목적**: 컴포지션 패턴을 통한 관심사 분리 및 단일 책임 원칙 적용
- **작업 내용**:
  - [x] **문제점 분석**:
    - Header 컴포넌트에 검색, 장바구니, 관리자 토글 로직이 직접 포함
    - 단일 책임 원칙 위반 (레이아웃 + 비즈니스 로직 혼재)
    - Props Drilling 문제 (상태들이 App에서 Header로 전달되어야 함)
    - 컴포넌트 결합도 증가 (검색, 장바구니, 관리자 기능에 직접 의존)
    - 상태 관리 혼재 (UI 상태와 비즈니스 상태가 섞여 있음)
  - [x] **관심사 분리 (Separation of Concerns)**:
    - **Header**: 순수한 레이아웃 컴포넌트로 분리
    - **SearchBar**: 검색 기능을 담당하는 별도 컴포넌트
    - **CartIcon**: 장바구니 아이콘과 카운트를 담당하는 컴포넌트
    - **AdminToggle**: 관리자 모드 전환을 담당하는 컴포넌트
  - [x] **Props를 통한 명시적 의존성**:
    - 각 컴포넌트가 필요한 데이터와 콜백을 props로 받도록 수정
    - 타입 안전성 강화 (TypeScript 인터페이스 정의)
  - [x] **컴포지션 패턴 적용**:
    - Header 내부에서 각 기능별 컴포넌트를 조합하여 사용
    - 재사용성과 테스트 가능성 향상
  - [x] **생성된 컴포넌트들**:
    - `src/basic/components/SearchBar.tsx` - 검색 입력 처리
    - `src/basic/components/CartIcon.tsx` - 장바구니 상태 표시
    - `src/basic/components/AdminToggle.tsx` - 관리자 모드 전환
  - [x] **App.tsx 업데이트**:
    - Header 컴포넌트에 필요한 props 전달
    - 명시적 의존성으로 데이터 흐름 명확화
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 기능 정상 작동
  - [x] 컴포넌트 간 결합도 감소
- **개선 효과**:
  - **재사용성**: 각 컴포넌트가 독립적으로 사용 가능
  - **테스트 용이성**: 각 컴포넌트를 독립적으로 테스트 가능
  - **유지보수성**: 변경 시 영향 범위가 명확하고 제한적
  - **가독성**: 각 컴포넌트의 역할이 명확함
  - **타입 안전성**: TypeScript를 통한 안전한 props 전달

#### 📌 **컴포지션 패턴 적용 시 고민사항**

**1. Props Drilling vs 컴포지션 패턴 선택**

- **고민**: Header에서 필요한 상태들을 어떻게 전달할 것인가?
  - 옵션 1: Props Drilling (App → Header → 각 컴포넌트)
  - 옵션 2: 각 컴포넌트가 자체적으로 상태 관리
  - 옵션 3: 컴포지션 패턴으로 필요한 것만 전달
- **결정**: 컴포지션 패턴 선택
  - 이유: 명시적 의존성, 재사용성, 테스트 용이성
  - 각 컴포넌트가 필요한 데이터만 받아서 사용

**2. 컴포넌트 분리 수준 결정**

- **고민**: 어느 정도까지 컴포넌트를 분리할 것인가?
  - 옵션 1: 최소한의 분리 (Header 내부에 일부 로직 유지)
  - 옵션 2: 완전한 분리 (모든 로직을 별도 컴포넌트로)
  - 옵션 3: 적절한 수준의 분리 (관심사별로 분리)
- **결정**: 적절한 수준의 분리 선택
  - 이유: 과도한 분리는 복잡성 증가, 부족한 분리는 개선 효과 미미
  - 검색, 장바구니, 관리자 토글은 각각 독립적인 관심사로 판단

**3. 타입 안전성 vs 간단함**

- **고민**: TypeScript를 얼마나 엄격하게 사용할 것인가?
  - 옵션 1: 최소한의 타입 정의 (any 사용)
  - 옵션 2: 완전한 타입 정의 (모든 props에 타입 지정)
  - 옵션 3: 적절한 타입 정의 (필수 props만 타입 지정)
- **결정**: 적절한 타입 정의 선택
  - 이유: 개발자 경험 향상, 런타임 오류 방지
  - 필수 props는 타입 지정, 선택적 props는 기본값 사용

### 2.9 Icon 시스템 설계 및 개선 🔄

- **목적**: 일관된 Icon 컴포넌트 시스템 구축 및 네임스페이스 패턴 적용
- **작업 내용**:
  - [x] **초기 설계 시도**:
    - 복잡한 레지스트리 시스템 (삭제됨)
    - 카테고리별 분리 (삭제됨)
    - 네임스페이스 패턴 (현재 상태)
  - [x] **현재 구현 상태**:
    - `src/basic/components/icons/Icon.tsx` - 기본 구조
    - `src/basic/components/icons/CartIcon.tsx` - 기본 아이콘
    - 네임스페이스 패턴 기반 설계
  - [x] **목표 사용법**:
    ```tsx
    <Icon.cart size={6} />
    <Icon.close size={4} />
    <Icon.plus size={5} />
    ```
- **검증**:
  - [x] 기본 Icon 컴포넌트 동작 확인
  - [ ] 네임스페이스 패턴 완전 구현
  - [ ] 타입 안전성 확보
- **개선 효과**:
  - **일관성**: 모든 아이콘이 동일한 인터페이스 사용
  - **타입 안전성**: TypeScript 자동완성 지원
  - **확장성**: 새로운 아이콘 추가가 용이
  - **사용 편의성**: 직관적인 네임스페이스 사용법

#### 📌 **Icon 시스템 설계 시 고민사항**

**1. 복잡한 시스템 vs 간단한 시스템**

- **고민**: Icon 관리를 얼마나 체계적으로 할 것인가?
  - 옵션 1: 복잡한 레지스트리 시스템 (동적 등록, 지연 로딩)
  - 옵션 2: 카테고리별 분리 (navigation/, actions/, status/ 등)
  - 옵션 3: 단순한 네임스페이스 패턴 (모든 아이콘을 하나의 객체에)
- **결정**: 단순한 네임스페이스 패턴 선택
  - 이유: 과도한 추상화는 복잡성만 증가
  - 현재 프로젝트 규모에서는 단순함이 더 효과적

**2. 파일 구조 vs 단일 파일**

- **고민**: 아이콘들을 어떻게 파일로 관리할 것인가?
  - 옵션 1: 각 아이콘별 개별 파일 (CartIcon.tsx, CloseIcon.tsx 등)
  - 옵션 2: 카테고리별 파일 (navigation.tsx, actions.tsx 등)
  - 옵션 3: 단일 파일에 모든 아이콘 정의 (Icon.tsx)
- **결정**: 단일 파일 접근법 선택
  - 이유: 파일 구조가 단순함, import/export가 간단함
  - 모든 아이콘이 한 곳에 있어 관리가 쉬움

**3. 네임스페이스 패턴 구현 방식**

- **고민**: 네임스페이스 패턴을 어떻게 구현할 것인가?
  - 옵션 1: Proxy 객체 사용 (동적 접근)
  - 옵션 2: 객체 리터럴 (정적 정의)
  - 옵션 3: 함수형 팩토리 (동적 생성)
- **결정**: 객체 리터럴 방식 선택
  - 이유: 단순하고 직관적, 타입 안전성 보장
  - TypeScript 자동완성 지원이 용이

**4. 확장성 vs 단순함**

- **고민**: 미래 확장을 고려해서 얼마나 유연하게 설계할 것인가?
  - 옵션 1: 완전한 확장성 (플러그인 시스템)
  - 옵션 2: 적절한 확장성 (새 아이콘 추가 용이)
  - 옵션 3: 최소한의 확장성 (현재 필요만 충족)
- **결정**: 적절한 확장성 선택
  - 이유: YAGNI 원칙 (You Aren't Gonna Need It)
  - 현재 필요를 충족하면서도 미래 확장 가능한 구조

#### 📌 **최종 추천: 단순한 네임스페이스 패턴**

**구조:**

```
src/basic/components/icons/
├── Icon.tsx          # 모든 아이콘 정의 + 네임스페이스
└── index.ts          # export만
```

**Icon.tsx 내용:**

```tsx
// 각 아이콘 컴포넌트 정의
const CartIcon = (props: IconProps) => {
  /* SVG */
};
const CloseIcon = (props: IconProps) => {
  /* SVG */
};
const PlusIcon = (props: IconProps) => {
  /* SVG */
};

// 네임스페이스 객체
const Icon = {
  cart: CartIcon,
  close: CloseIcon,
  plus: PlusIcon,
} as const;

export default Icon;
```

**사용법:**

```tsx
import Icon from '@/basic/components/icons/Icon';

// 간단하고 직관적
<Icon.cart size={6} />
<Icon.close size={4} />
<Icon.plus size={5} />
```

**장점:**

1. **단순함**: 파일 2개만으로 모든 아이콘 관리
2. **직관적**: `Icon.cart` 같은 명확한 사용법
3. **타입 안전**: TypeScript 자동G완성 지원
4. **성능**: 번들 크기 최적화
5. **유지보수**: 한 파일에서 모든 아이콘 관리
6. **확장성**: 새 아이콘 추가가 쉬움

### 2.10 컴포넌트 분리 및 레이아웃 시스템 구축 ✅

- **목적**: 거대한 App.tsx 컴포넌트를 더 작은 단위로 분리하고 레이아웃 시스템 구축
- **작업 내용**:
  - [x] **ProductList 컴포넌트 분리** (`src/basic/features/product/components/ProductList.tsx`):
    - 상품 목록 렌더링 로직을 별도 컴포넌트로 분리
    - 검색 기능과 상품 카드 렌더링 담당
    - 54줄의 간결한 컴포넌트로 분리
  - [x] **ProductCard 컴포넌트 분리** (`src/basic/features/product/components/ProductCard.tsx`):
    - 개별 상품 카드 렌더링 로직 분리
    - 상품 정보, 가격, 재고, 장바구니 버튼 포함
    - 137줄의 재사용 가능한 컴포넌트
  - [x] **페이지 컴포넌트 분리**:
    - `src/basic/pages/AdminPage.tsx` - 관리자 페이지 로직 (676줄)
    - `src/basic/pages/HomePage.tsx` - 홈 페이지 로직 (485줄)
    - 각 페이지별 관심사 분리
  - [x] **레이아웃 시스템 구축**:
    - `src/basic/shared/components/layout/PageLayout.tsx` - 전체 페이지 레이아웃
    - `src/basic/shared/components/layout/MainLayout.tsx` - 메인 콘텐츠 레이아웃
    - 일관된 레이아웃 구조 제공
  - [x] **Header 컴포넌트 개선**:
    - 컴포지션 패턴 적용으로 더 유연한 구조
    - `Header.Admin`과 `Header.Home` 서브컴포넌트로 분리
    - 조건부 렌더링 로직 제거로 단순화
  - [x] **검색 유틸리티 분리** (`src/basic/shared/utils/search.util.ts`):
    - 검색 관련 순수 함수들 분리
    - `normalizeSearchTerm`, `isTextMatchSearchTerm`, `filterArrayBySearchTerm` 등
    - 재사용 가능한 검색 로직 제공
  - [x] **타입 시스템 개선**:
    - `AddNotification`, `RemoveNotification` 타입 추가
    - 함수 시그니처 일관성 향상
    - 타입 안전성 강화
  - [x] **useLocalStorage 훅 개선**:
    - 탭 간 동기화 기능 강화
    - 이벤트 리스너 시스템 개선
    - 성능 최적화 적용
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 기능 정상 작동
  - [x] 컴포넌트 간 결합도 감소
  - [x] 재사용성 향상
- **개선 효과**:
  - **모듈화**: 각 컴포넌트가 명확한 책임을 가짐
  - **재사용성**: ProductCard, 레이아웃 컴포넌트 재사용 가능
  - **유지보수성**: 변경 시 영향 범위가 명확하고 제한적
  - **가독성**: App.tsx가 대폭 간소화되어 이해하기 쉬워짐
  - **테스트 용이성**: 각 컴포넌트를 독립적으로 테스트 가능

#### 📌 **컴포넌트 분리 시 고민사항**

**1. 분리 수준 결정**

- **고민**: 어느 정도까지 컴포넌트를 분리할 것인가?
  - 옵션 1: 최소한의 분리 (기능별로만 분리)
  - 옵션 2: 완전한 분리 (모든 UI 요소를 개별 컴포넌트로)
  - 옵션 3: 적절한 수준의 분리 (재사용 가능한 단위로)
- **결정**: 적절한 수준의 분리 선택
  - 이유: ProductCard는 재사용 가능, ProductList는 페이지별로 다를 수 있음
  - 레이아웃 컴포넌트는 일관성 유지를 위해 분리

**2. Props 설계**

- **고민**: 컴포넌트 간 데이터 전달을 어떻게 설계할 것인가?
  - 옵션 1: 최소한의 props (필수 데이터만)
  - 옵션 2: 모든 데이터를 props로 전달
  - 옵션 3: 적절한 수준의 props + 컨텍스트 활용
- **결정**: 적절한 수준의 props 선택
  - 이유: 명시적 의존성으로 데이터 흐름 명확화
  - 필요한 데이터만 전달하여 결합도 최소화

**3. 레이아웃 시스템 설계**

- **고민**: 레이아웃을 어떻게 체계적으로 관리할 것인가?
  - 옵션 1: 인라인 스타일링 (각 컴포넌트에서 직접)
  - 옵션 2: 공통 레이아웃 컴포넌트 (PageLayout, MainLayout)
  - 옵션 3: CSS-in-JS 또는 스타일 시스템
- **결정**: 공통 레이아웃 컴포넌트 선택
  - 이유: 일관성 유지, 중복 코드 제거
  - Tailwind CSS와 조합하여 유연성 확보

### 2.11 useLocalStorage 훅 고도화 ✅

- **목적**: 탭 간 동기화 및 성능 최적화를 통한 사용자 경험 향상
- **작업 내용**:
  - [x] **이벤트 리스너 시스템 구축**:
    - `storageEventListeners` Map을 통한 키별 리스너 관리
    - `subscribeToStorageChange` 함수로 구독 시스템 구현
    - `notifyStorageChange` 함수로 변경 알림 시스템 구현
  - [x] **탭 간 동기화 강화**:
    - 다른 탭에서 localStorage 변경 시 즉시 반영
    - 메모리 누수 방지를 위한 구독 해제 로직
    - 키별 독립적인 이벤트 처리
  - [x] **성능 최적화**:
    - 불필요한 리렌더링 방지
    - 이벤트 리스너 최적화
    - 메모리 효율적인 구독 관리
  - [x] **에러 처리 개선**:
    - JSON 파싱 실패 시 안전한 처리
    - 콘솔 로깅을 통한 디버깅 지원
- **검증**:
  - [x] 탭 간 동기화 정상 작동
  - [x] 메모리 누수 없음
  - [x] 성능 저하 없음
  - [x] 모든 기능 정상 작동
- **개선 효과**:
  - **사용자 경험**: 탭 간 데이터 동기화로 일관된 상태 유지
  - **안정성**: 메모리 누수 방지 및 에러 처리 강화
  - **성능**: 최적화된 이벤트 처리로 성능 향상
  - **확장성**: 새로운 기능 추가가 용이한 구조

### 2.12 App.tsx 대폭 리팩토링 ✅

- **목적**: 거대한 단일 컴포넌트를 간결한 라우팅 컴포넌트로 변환하여 관심사 분리
- **작업 내용**:
  - [x] **App.tsx 대폭 간소화**:
    - 95줄에서 19줄로 대폭 감소 (767줄 삭제)
    - 거대한 단일 컴포넌트를 간결한 라우팅 컴포넌트로 변환
    - 단순한 상태 관리와 페이지 전환 로직만 유지
  - [x] **페이지 컴포넌트 분리**:
    - `HomePage.tsx`: 쇼핑몰 홈 페이지 로직 분리 (482줄 삭제)
    - `AdminPage.tsx`: 관리자 페이지 로직 분리 (95줄 추가)
    - `pages/index.ts`: 페이지 컴포넌트 통합 export
  - [x] **레이아웃 컴포넌트 추가**:
    - `DashBoardLayout.tsx`: 관리자 대시보드 레이아웃
  - [x] **테스트 안정성 확보**:
    - `addNotification`을 AdminPage에 전달하여 테스트 실패 해결
    - 알림 시스템 연결 문제 해결
  - [x] **기타 컴포넌트 수정**:
    - Cart, Product, Coupon 관련 컴포넌트들의 import 경로 수정
    - useCart 훅의 import 경로 수정
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 기능 정상 작동
  - [x] 컴포넌트 간 결합도 감소
  - [x] 테스트 안정성 확보
- **개선 효과**:
  - **코드 구조 개선**: 단일 책임 원칙(SRP) 적용
  - **관심사 분리**: 각 페이지별 독립적 관리 가능
  - **유지보수성 향상**: 변경 시 영향 범위 최소화
  - **확장성 확보**: 새로운 페이지 추가 용이
  - **테스트 용이성**: 각 페이지를 독립적으로 테스트 가능

### 2.13 formatPrice 함수 수정 ✅

- **목적**: 테스트에서 요구하는 가격 표시 형식에 맞게 함수 수정
- **작업 내용**:
  - [x] **문제 분석**:
    - 테스트에서 찾는 텍스트: `"25,000원"`
    - 실제 표시되는 텍스트: `"25,000 대한민국 원"`
    - formatPrice 함수의 잘못된 옵션 사용
  - [x] **formatPrice 함수 수정**:
    - `formatPrice.unit()`: `"5,000원"` 형식 반환
    - `formatPrice.currency()`: `"₩5,000"` 형식 반환
    - Intl.NumberFormat API 올바르게 활용
  - [x] **테스트 호환성 확보**:
    - 테스트에서 요구하는 형식에 맞게 수정
    - 가격 표시 형식 통일
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 가격 표시 형식 정상 작동
  - [x] 테스트 호환성 확보
- **개선 효과**:
  - **테스트 안정성**: 가격 표시 형식 통일로 테스트 통과
  - **일관성**: 모든 가격 표시가 동일한 형식 사용
  - **유지보수성**: formatPrice 함수의 명확한 역할 분리

### 2.14 AdminPage 리팩토링 ✅

- **목적**: 거대한 관리자 페이지 컴포넌트를 기능별로 분리하여 관심사 분리 및 재사용성 향상
- **작업 내용**:
  - [x] **AdminPage.tsx 대폭 간소화**:
    - 676줄에서 44줄로 대폭 감소 (632줄 삭제)
    - 거대한 관리자 페이지 컴포넌트를 간결한 컨테이너로 변환
    - 단순한 레이아웃과 props 전달만 유지
  - [x] **Admin 컴포넌트 구조 생성**:
    - `AdminTabs.tsx`: 관리자 탭 네비게이션 및 컨테이너 (56줄)
    - `ProductAdmin.tsx`: 상품 관리 로직 분리 (412줄)
    - `CouponAdmin.tsx`: 쿠폰 관리 로직 분리 (286줄)
    - `AdminSection.tsx`: 공통 관리 섹션 레이아웃 (26줄)
  - [x] **Tabs 컴포넌트 개선**:
    - `Tabs.tsx`: 합성 패턴 기반 탭 컴포넌트 (97줄)
    - 제네릭 타입 지원으로 타입 안전성 확보
    - 재사용 가능한 탭 시스템 구축
  - [x] **관심사 분리**:
    - 상품 관리와 쿠폰 관리 로직을 별도 컴포넌트로 분리
    - 각 컴포넌트가 단일 책임을 가지도록 설계
    - Props를 통한 명시적 의존성 관리
- **검증**:
  - [x] TypeScript 컴파일 오류 없음
  - [x] 모든 기능 정상 작동
  - [x] 컴포넌트 간 결합도 감소
  - [x] 재사용성 향상
- **개선 효과**:
  - **코드 구조 개선**: 단일 책임 원칙(SRP) 적용
  - **관심사 분리**: 각 관리 기능별 독립적 관리 가능
  - **유지보수성 향상**: 변경 시 영향 범위 최소화
  - **확장성 확보**: 새로운 관리 기능 추가 용이
  - **재사용성**: Tabs 컴포넌트를 다른 곳에서도 사용 가능
  - **타입 안전성**: 제네릭 타입으로 타입 안전성 확보

## 📊 현재 작업 진행 상황 업데이트

| 작업                    | 상태      | 완성도 | 주요 고민사항                       |
| ----------------------- | --------- | ------ | ----------------------------------- |
| Header 리팩토링         | ✅ 완료   | 100%   | Props Drilling vs 컴포지션 패턴     |
| 컴포넌트 분리           | ✅ 완료   | 100%   | 컴포넌트 분리 수준 결정             |
| 디바운싱 분석           | ✅ 완료   | 100%   | 디바운싱 vs 쓰로틀링                |
| Icon 시스템             | 🔄 진행중 | 60%    | 복잡한 시스템 vs 간단한 시스템      |
| App.tsx 업데이트        | ✅ 완료   | 100%   | 타입 안전성 vs 간단함               |
| ProductList/ProductCard | ✅ 완료   | 100%   | 재사용성 vs 특화성                  |
| 레이아웃 시스템         | ✅ 완료   | 100%   | 일관성 vs 유연성                    |
| useLocalStorage 고도화  | ✅ 완료   | 100%   | 성능 vs 기능성                      |
| App.tsx 대폭 리팩토링   | ✅ 완료   | 100%   | 거대 컴포넌트 분리 및 테스트 안정성 |
| formatPrice 함수 수정   | ✅ 완료   | 100%   | 테스트 호환성 및 가격 표시 형식     |
| AdminPage 리팩토링      | ✅ 완료   | 100%   | 관리자 컴포넌트 분리 및 Tabs 시스템 |

## 🎯 핵심 성과 및 인사이트

### 1. **컴포지션 패턴의 효과**

- **Before**: 복잡한 단일 컴포넌트 (모든 로직 혼재)
- **After**: 작고 명확한 컴포넌트들 (단일 책임)
- **인사이트**: 적절한 수준의 분리가 가장 효과적

### 2. **타입 안전성의 중요성**

- **고민**: TypeScript를 얼마나 엄격하게 사용할 것인가?
- **결정**: 적절한 타입 정의 (필수 props만 타입 지정)
- **인사이트**: 과도한 타입 정의는 복잡성만 증가

### 3. **단순함의 가치**

- **Icon 시스템**: 복잡한 레지스트리 → 단순한 네임스페이스
- **디바운싱**: 복잡한 커스텀 훅 → 기본 useEffect 패턴
- **인사이트**: 현재 필요를 충족하는 가장 단순한 해결책이 최선

### 4. **성능 최적화의 균형**

- **디바운싱**: 300ms 지연으로 성능과 사용자 경험 균형
- **컴포넌트 분리**: 재사용성과 성능의 적절한 균형점
- **인사이트**: 성능 최적화는 사용자 경험을 고려해야 함

## 🔄 다음 작업 (우선순위 순)

### 기본과제 (완료)

1. ✅ **Phase 2.8: Header 컴포넌트 분리 및 리팩토링** - 컴포지션 패턴 적용 (완료)
2. ✅ **Phase 2.10: 컴포넌트 분리 및 레이아웃 시스템 구축** - ProductList, ProductCard, 페이지 분리 (완료)
3. ✅ **Phase 2.11: useLocalStorage 훅 고도화** - 탭 간 동기화 및 성능 최적화 (완료)
4. ✅ **Phase 2.12: App.tsx 대폭 리팩토링** - 거대 컴포넌트 분리 및 페이지 컴포넌트 분리 (완료)
5. ✅ **Phase 2.13: formatPrice 함수 수정** - 테스트 호환성 및 가격 표시 형식 개선 (완료)
6. ✅ **Phase 2.14: AdminPage 리팩토링** - 관리자 컴포넌트 분리 및 Tabs 시스템 구축 (완료)

### 기본과제 (남은 작업)

7. **Phase 2.9: Icon 시스템 완성** - 네임스페이스 패턴 최적화 (다음 우선순위)
8. **Phase 2.999: 긴 함수 분할** - 20줄 이하 함수 규칙 준수
9. **Phase 3.1: 엔티티 컴포넌트와 UI 컴포넌트 분리** - README 요구사항

### 심화과제 (기본과제 완료 후)

6. **Phase 6: Props drilling 제거** - Context 또는 Jotai 사용
7. **Phase 5: 성능 최적화** - 렌더링 및 번들 최적화

---

**마지막 업데이트**: 2024년 (AdminPage 리팩토링, 관리자 컴포넌트 분리, Tabs 시스템 구축 완료)
