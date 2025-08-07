# 리팩토링 프로젝트 문서

## 📚 문서 목록

### 🎯 핵심 문서

- [**리팩토링 로드맵**](./refactoring-roadmap.md) - 단순한 폴더 구조 기반 리팩토링 계획

### 📊 분석 문서

- [**Brownfield 분석**](./brownfield-analysis.md) - 현재 코드베이스 분석

## 🎯 프로젝트 목표

현재 1,124줄의 거대한 `App.tsx`를 **단순하고 실용적인 폴더 구조**로 리팩토링합니다.

### 최종 구조

```
src/
├── models/           # 엔티티 (비즈니스 로직)
│   ├── cart.ts
│   ├── product.ts
│   ├── coupon.ts
│   └── discount.ts
├── components/       # 페이지 + UI 컴포넌트
│   ├── CartPage.tsx
│   ├── AdminPage.tsx
│   └── ui/          # 재사용 가능한 UI 컴포넌트
├── hooks/           # 상태 관리
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useCoupons.ts
├── utils/           # 유틸리티
│   ├── formatters.ts
│   └── validators.ts
└── App.tsx
```

## 🚀 실행 계획

### Phase 1: 모델 분리 (1일)

- [ ] models/cart.ts 생성
- [ ] models/product.ts 생성
- [ ] models/coupon.ts 생성
- [ ] models/discount.ts 생성

### Phase 2: 유틸리티 분리 (1일)

- [ ] utils/formatters.ts 생성
- [ ] utils/validators.ts 생성

### Phase 3: 훅 분리 (1일)

- [ ] hooks/useCart.ts 생성
- [ ] hooks/useProducts.ts 생성
- [ ] hooks/useCoupons.ts 생성

### Phase 4: 컴포넌트 분리 (1일)

- [ ] components/CartPage.tsx 생성
- [ ] components/AdminPage.tsx 생성
- [ ] components/ui/Button.tsx 생성

### Phase 5: 앱 통합 (1일)

- [ ] App.tsx 간소화
- [ ] 최종 통합 및 테스트

## 📊 예상 결과

### 코드 품질 개선

- **라인 수**: 1,124줄 → 50줄 (App.tsx)
- **파일 수**: 1개 → 20+ 개
- **복잡도**: 높음 → 낮음
- **재사용성**: 없음 → 높음

### 아키텍처 개선

- **명확한 분리**: 모델, 훅, 컴포넌트 분리
- **비즈니스 지향**: 모델 중심 설계
- **확장성**: 새로운 기능 추가 용이
- **테스트 용이성**: 각 레이어별 독립적 테스트

## 🎯 핵심 원칙

1. **단순함**: 복잡한 아키텍처보다는 실용적인 구조
2. **명확성**: 각 파일의 역할이 명확하게 분리
3. **재사용성**: 모델과 유틸리티의 높은 재사용성
4. **유지보수성**: 이해하기 쉽고 수정하기 쉬운 구조
