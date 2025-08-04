# 📋 개요

이 문서는 React 쇼핑몰 프로젝트의 리팩토링 과정을 단계별로 기록합니다.
목표는 코드의 가독성, 유지보수성, 확장성을 향상시키고 Clean Code 원칙을 준수하는 것입니다.

# 과제 목표

- 컴포넌트 계층 분리
  - 코드의 계층과 경계를 이해하고 코드를 어떻게 잘 분리를 해두는게 좋은가?
  - 계층을 이해하고 분리하여 정리정돈을 하는 기준이나 방법 등을 습득
- 계층의 분리의 과정에서 순수함수의 개념과 디자인 패턴의 이해가 어떤 도움을 주는지 어떻게 영향을 줬는지 이해해보자.
- props drilling이 왜 불편한지 느껴보고 느낀 점 및 개선 방안 정리
- 비즈니스 로직을 커스텀 훅과 유틸 함수로 적절하게 분리

# 과제 원칙

- props drilling이 3단계를 초과하지 않도록 컴포넌트를 나눈다.

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

### 2.2 중복 코드 제거 (localStorage 패턴)

- **목적**: DRY 원칙 준수 및 코드 재사용성 향상
- **작업 예정**:
  - [ ] `src/hooks/useLocalStorage.ts` 커스텀 훅 생성
  - [ ] localStorage 초기화 로직 공통화 (3개 패턴 통합)
  - [ ] 폼 초기화 로직 상수화
  - [ ] App.tsx에서 중복 제거된 로직 적용

#### 로컬스토리지 관련 로직 먼저 분리하는 이유

- 상태 관리의 기초가 되므로 컴포넌트 분리 전에 공통 로직이 정리되는 편이 컴포넌트 분리 시 용이할 듯
- 단순히 로컬 스토리지에서 데이터 가져오고 데이터 초기화하는 로직만 있고, 다른 로직과 의존성이 없기 때문에 바로 분리가 가능해보임

### 2.3 긴 함수 분할

- **목적**: 함수 길이 20줄 이하 준수
- **작업 예정**:
  - [ ] `addToCart` 함수 분할 (38줄 → 4개 함수로 분할)
  - [ ] `handleProductSubmit` 함수 분할 (21줄 → 3개 함수로 분할)
  - [ ] 거대한 JSX return문 컴포넌트 분리 준비

## 🔄 Phase 3: 구조적 코드 개선 (예정)

### 3.1 주요 컴포넌트 분리 (SRP 적용)

- **목적**: Single Responsibility Principle 준수
- **작업 예정**:
  - [ ] **AdminPage** 컴포넌트 분리 (관리자 모드 전체)
  - [ ] **ProductList** 컴포넌트 분리 (상품 목록 UI)
  - [ ] **Cart** 컴포넌트 분리 (장바구니 UI)
  - [ ] **NotificationSystem** 컴포넌트 분리 (알림 시스템)
  - [ ] **SearchBar** 컴포넌트 분리 (검색 기능)

### 3.2 커스텀 훅 분리 (도메인별 로직 분리)

- **목적**: 비즈니스 로직과 UI 로직 분리
- **작업 예정**:
  - [ ] **useCart** - 장바구니 관련 모든 로직
  - [ ] **useProducts** - 상품 관리 관련 모든 로직
  - [ ] **useCoupons** - 쿠폰 관련 모든 로직
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

### 4.1 단위 테스트 작성

- **목적**: 코드 품질 보장
- **작업 예정**:
  - [ ] 유틸리티 함수 테스트
  - [ ] 커스텀 훅 테스트
  - [ ] 컴포넌트 테스트
  - [ ] 비즈니스 로직 테스트

### 4.2 통합 테스트 작성

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

# 📊 체크리스트

## 개발 환경 설정

- [x] Clean Code 분석 및 문서화
- [x] Prettier 설정 및 적용
- [x] Vite 절대 경로 설정
- [ ] ESLint 규칙 정비
- [ ] 허스키(Husky) pre-commit 훅 설정

## 코드 품질

- [x] 매직 넘버 상수화
- [ ] 중복 코드 제거
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

1. **Phase 2.2: 중복 코드 제거** - localStorage 패턴 및 폼 초기화 로직 (다음 우선순위)
2. **Phase 2.3: 긴 함수 분할** - 20줄 이하 함수 규칙 준수
3. **Phase 3.1: 주요 컴포넌트 분리** - SRP 원칙 적용
4. **Phase 3.2: 커스텀 훅 분리** - 도메인별 로직 분리
5. **Phase 3.3: 타입 시스템 강화** - 더 강력한 타입 안정성 확보

### 📋 체크리스트 업데이트

현재 진행 상황을 반영하여 체크리스트가 업데이트되었습니다:

- **완료**: ✅ 매직 넘버 상수화 (Phase 2.1)
- **다음 우선순위**: 중복 코드 제거, 긴 함수 분할
- **중요도 높음**: 컴포넌트 분리, 훅 분리
- **장기적**: 테스트 작성, 성능 최적화

---

**마지막 업데이트**: 2024년 (Clean Code 분석, Prettier, 절대 경로 설정, 매직넘버 상수화 완료)
