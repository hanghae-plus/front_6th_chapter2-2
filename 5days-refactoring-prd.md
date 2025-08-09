# Day 5: 최종 정리 및 레이아웃 컴포넌트 분리

## 목표

- 레이아웃 관련 컴포넌트 분리 완료
- AdminPage, ProductListPage 최종 정리
- App 컴포넌트를 최소한의 라우팅 로직만 포함하도록 정리
- 전체 아키텍처 검증 및 문서화

## 작업 범위

### 1단계: 레이아웃 컴포넌트 분리

```typescript
// src/basic/components/layout/Header.tsx
export const Header: React.FC<{
  isAdmin: boolean;
  onToggleAdmin: () => void;
  cartItemCount: number;
}>;

// src/basic/components/layout/Navigation.tsx
export const Navigation: React.FC<NavigationProps>;

// src/basic/components/layout/MainLayout.tsx
export const MainLayout: React.FC<MainLayoutProps>;
```

### 2단계: 페이지 컴포넌트 최종 정리

```typescript
// src/basic/components/ProductListPage.tsx
export const ProductListPage: React.FC - 완전한 상품 목록 페이지

// src/basic/components/AdminPage.tsx
export const AdminPage: React.FC - 완전한 관리자 페이지
```

### 3단계: App 컴포넌트 최종 정리

```typescript
// src/basic/App.tsx - 최종 모습 (50줄 이하)
const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <MainLayout>
      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        cartItemCount={...}
      />
      <NotificationList />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <ProductListPage />}
      </main>
    </MainLayout>
  );
};
```

### 4단계: 최종 폴더 구조 정리

```
src/basic/
├── App.tsx (50줄 이하)
├── components/
│   ├── layout/         - 레이아웃 컴포넌트
│   ├── ui/             - 재사용 UI 컴포넌트
│   ├── ProductListPage.tsx
│   ├── AdminPage.tsx
│   ├── CartSummary.tsx
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── CouponList.tsx
│   ├── CouponCard.tsx
│   └── CouponForm.tsx
├── constants/
│   ├── product.ts
│   ├── cart.ts
│   ├── coupon.ts
│   └── notification.ts
├── utils/
│   ├── hooks/
│   ├── productUtils.ts
│   ├── cartUtils.ts
│   ├── couponUtils.ts
│   ├── discountUtils.ts
│   ├── formatters.ts
│   └── searchUtils.ts
├── models/
│   ├── productAtoms.ts
│   ├── cartAtoms.ts
│   ├── couponAtoms.ts
│   └── notificationAtoms.ts
└── hooks/
    ├── useProducts.ts
    ├── useCart.ts
    ├── useCoupons.ts
    └── useNotifications.ts
```

### 5단계: 최종 통합 테스트

- [ ] 모든 도메인 기능 통합 테스트
- [ ] E2E 시나리오 테스트
- [ ] 성능 테스트 (렌더링 최적화 확인)

### 6단계: 아키텍처 문서화

```markdown
// docs/refactoring-summary.md

- 리팩토링 전후 비교
- 아키텍처 다이어그램
- 각 계층의 책임 범위
- 데이터 흐름 설명
```

## 최종 검증 항목

### PR 체크리스트 기준

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entity만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entity만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?
- [x] UI 컴포넌트 계층과 엔티티 컴포넌트의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 Hook과 라이브러리 훅과의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 순수함수와 유틸리티 함수의 계층의 성격이 다르다는 것을 이해하고 적용했는가?

## 최종 성공 기준

1. App 컴포넌트가 50줄 이하로 단순화됨
2. 모든 기존 테스트가 통과함
3. 각 도메인이 완전히 독립적으로 분리됨
4. 재사용 가능한 컴포넌트들이 확보됨
5. 코드 가독성과 유지보수성이 대폭 향상됨

## 최종 deliverable

- 완전히 리팩토링된 쇼핑몰 애플리케이션
- 계층별 아키텍처 문서
- 리팩토링 전후 비교 분석
- 각 도메인별 사용 가이드
