# Basic 폴더 계층 구조 개선 방안

## 현재 구조의 문제점

### 1. 계층 혼재

- `utils/hooks/` vs `hooks/` 분리
- 비즈니스 로직과 유틸리티 로직 혼재

### 2. 도메인별 분리 부족

- 에러 클래스가 도메인별로 불완전
- 상수와 타입이 도메인별로 분리되지 않음

### 3. 책임 분산

- App.tsx가 너무 많은 책임
- 이벤트 핸들러가 별도 파일로 분리됨

## 개선된 구조 제안

```
src/basic/
├── components/           # UI 컴포넌트
│   ├── ui/             # 공통 UI
│   ├── cart/           # 장바구니 도메인
│   ├── product/        # 상품 도메인
│   ├── coupon/         # 쿠폰 도메인
│   └── admin/          # 관리자 도메인
├── hooks/              # 커스텀 훅 (통합)
│   ├── business/       # 비즈니스 로직 훅
│   └── utils/          # 유틸리티 훅
├── utils/              # 순수 유틸리티 함수
│   ├── calculations/   # 계산 로직
│   ├── validators/     # 검증 로직
│   ├── formatters/     # 포맷팅
│   └── storage/        # 스토리지
├── errors/             # 에러 클래스
│   ├── Cart.error.ts
│   ├── Product.error.ts
│   └── Coupon.error.ts
├── types/              # 타입 정의
│   ├── common.ts       # 공통 타입
│   ├── cart.ts         # 장바구니 타입
│   ├── product.ts      # 상품 타입
│   └── coupon.ts       # 쿠폰 타입
├── constants/          # 상수
│   ├── common.ts       # 공통 상수
│   ├── cart.ts         # 장바구니 상수
│   ├── product.ts      # 상품 상수
│   └── coupon.ts       # 쿠폰 상수
├── pages/              # 페이지 컴포넌트
├── models/             # 데이터 모델
└── __tests__/          # 테스트 파일
```

## 개선 효과

### 1. 명확한 계층 분리

- UI, 비즈니스 로직, 유틸리티가 명확히 분리
- 도메인별로 관련 코드가 그룹화

### 2. 재사용성 향상

- 도메인별로 독립적인 구조
- 공통 로직의 명확한 분리

### 3. 유지보수성 향상

- 관련 코드가 한 곳에 모임
- 변경 시 영향 범위가 명확

### 4. 확장성

- 새로운 도메인 추가 시 일관된 구조 적용 가능
