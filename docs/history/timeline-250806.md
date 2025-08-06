### �� 8단계: UI 컴포넌트 분리 작업 계획 수립

#### 작업 배경

Hook 분리 작업이 완료된 후, App.tsx의 거대한 JSX를 재사용 가능한 컴포넌트로 분리하여 완전한 관심사 분리 달성 필요

#### 현재 상황 분석

- **App.tsx**: 1,161줄의 거대한 컴포넌트
- **Hook 분리**: 완료 (9개 Hook)
- **다음 단계**: UI 컴포넌트 분리로 관심사 분리 완성

#### 단계별 작업 계획 (난이도별)

**1단계: 기본 UI 컴포넌트 분리** (2-3시간) ⭐⭐⭐

**목표**: 재사용 가능한 기본 UI 요소들을 분리하여 중복 제거

**분리할 컴포넌트들**:

1. **Notification 컴포넌트** (`components/ui/Notification.tsx`)
   - 알림 메시지 표시
   - 타입별 색상 처리 (error, success, warning)
   - 닫기 버튼 기능

2. **Button 컴포넌트** (`components/ui/Button.tsx`)
   - 재사용 가능한 버튼 컴포넌트
   - variant 지원 (primary, secondary, danger)
   - disabled 상태 처리

3. **Header 컴포넌트** (`components/ui/Header.tsx`)
   - 검색창, 관리자 버튼, 장바구니 아이콘
   - 관리자/고객 모드 전환

**예상 파일 구조**:
src/basic/components/ui/
├── Notification.tsx
├── Button.tsx
└── Header.tsx

**2단계: 도메인 컴포넌트 분리** (4-6시간) ⭐⭐⭐⭐

**목표**: 비즈니스 로직을 가진 도메인별 컴포넌트 분리

**분리할 컴포넌트들**:

1. **ProductCard 컴포넌트** (`components/ProductCard.tsx`)
   - 상품 정보 표시
   - 할인 계산 및 표시
   - 재고 상태 관리
   - 장바구니 추가 기능

2. **CartItem 컴포넌트** (`components/CartItem.tsx`)
   - 장바구니 아이템 표시
   - 수량 변경 기능
   - 할인율 표시
   - 아이템 제거 기능

3. **ProductForm 컴포넌트** (`components/ProductForm.tsx`)
   - 상품 추가/수정 폼
   - 폼 검증 로직
   - 편집 모드 관리

4. **CouponForm 컴포넌트** (`components/CouponForm.tsx`)
   - 쿠폰 추가 폼
   - 폼 초기화 기능

**예상 파일 구조**:
src/basic/components/
├── ProductCard.tsx
├── CartItem.tsx
├── ProductForm.tsx
└── CouponForm.tsx

**3단계: 페이지 컴포넌트 분리** (3-4시간) ⭐⭐⭐⭐⭐

**목표**: 큰 단위의 페이지 컴포넌트 분리

**분리할 컴포넌트들**:

1. **AdminPage 컴포넌트** (`components/pages/AdminPage.tsx`)
   - 관리자 대시보드 전체
   - 상품/쿠폰 관리 탭
   - 관리자 전용 기능들

2. **ShoppingPage 컴포넌트** (`components/pages/ShoppingPage.tsx`)
   - 쇼핑몰 메인 페이지
   - 상품 목록 표시
   - 검색 기능

3. **CartSidebar 컴포넌트** (`components/CartSidebar.tsx`)
   - 장바구니 사이드바
   - 쿠폰 선택 기능
   - 총액 계산 및 표시
   - 주문 완료 기능

**예상 파일 구조**:
src/basic/components/
├── pages/
│ ├── AdminPage.tsx
│ └── ShoppingPage.tsx
└── CartSidebar.tsx

**4단계: 통합 및 최적화** (2-3시간) ⭐⭐⭐⭐

**목표**: 컴포넌트 연결 및 성능 최적화

**작업 내용**:

1. **App.tsx 리팩토링**
   - 모든 컴포넌트 통합
   - Props 인터페이스 최적화
   - 이벤트 핸들러 연결

2. **성능 최적화**
   - React.memo 적용
   - 불필요한 리렌더링 방지
   - Props 최적화

3. **테스트 및 검증**
   - 각 컴포넌트별 테스트
   - 통합 테스트
   - 기존 기능 동작 확인

#### 예상 소요 시간 및 난이도

| 단계  | 난이도     | 예상 시간 | 주요 작업             |
| ----- | ---------- | --------- | --------------------- |
| 1단계 | ⭐⭐⭐     | 2-3시간   | 기본 UI 컴포넌트 분리 |
| 2단계 | ⭐⭐⭐⭐   | 4-6시간   | 도메인 컴포넌트 분리  |
| 3단계 | ⭐⭐⭐⭐⭐ | 3-4시간   | 페이지 컴포넌트 분리  |
| 4단계 | ⭐⭐⭐⭐   | 2-3시간   | 통합 및 최적화        |

**총 예상 시간**: **11-16시간** (1.5-2일)

#### 최종 목표

**Before (현재)**:

```typescript
// App.tsx: 1,161줄의 거대한 컴포넌트
const App = () => {
  // 모든 Hook들...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1,000줄 이상의 JSX */}
    </div>
  );
};
```

**After (목표)**:

```typescript
// App.tsx: 50줄 이하의 깔끔한 컨테이너
const App = () => {
  // Hook들 사용
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList notifications={notifications} />
      <Header {...headerProps} />
      <main>
        {isAdmin ? <AdminPage {...adminProps} /> : <ShoppingPage {...shoppingProps} />}
      </main>
    </div>
  );
};
```

# Middle-Out 방식 리팩토링 작업 내역

## �� Middle-Out 전략 개요

**Middle-Out 방식**: 복잡한 컴포넌트를 **안쪽에서부터 바깥쪽으로** 분리하는 전략

- **장점**: 에러 위험 최소화, 점진적 개선
- **적용 대상**: AdminPage 내부 컴포넌트들

## �� 작업 순서 및 전략

### **1단계: CouponManagement 분리** ⭐⭐⭐⭐⭐

**목적**: 가장 복잡한 쿠폰 관리 섹션을 먼저 분리

**분리 전략**:

```
CouponManagement (메인 컨테이너)
├── CouponCard (개별 쿠폰 표시)
├── AddCouponButton (새 쿠폰 추가 버튼)
└── CouponForm (쿠폰 추가 폼)
```

**완료된 작업**:

- ✅ `src/basic/components/pages/admin/CouponManagement.tsx` 생성
- ✅ `src/basic/components/pages/admin/coupon/` 디렉토리 생성
- ✅ `CouponCard.tsx` 분리 (30줄)
- ✅ `AddCouponButton.tsx` 분리 (15줄)
- ✅ `CouponForm.tsx` 분리 (100줄)
- ✅ `coupon/index.ts` 생성

**파일 구조**:

```
src/basic/components/pages/admin/
├── CouponManagement.tsx
└── coupon/
    ├── CouponCard.tsx
    ├── AddCouponButton.tsx
    ├── CouponForm.tsx
    └── index.ts
```

### **2단계: ProductManagement 분리** ⭐⭐⭐⭐⭐ (예정)

**목적**: 상품 관리 섹션 분리

**예상 분리 구조**:

```
ProductManagement (메인 컨테이너)
├── ProductTable (상품 목록 테이블)
├── ProductForm (상품 추가/수정 폼)
├── ProductRow (개별 상품 행)
└── DiscountPolicy (할인 정책 관리)
```

**예상 파일 구조**:

```
src/basic/components/pages/admin/
├── CouponManagement.tsx
├── ProductManagement.tsx
├── coupon/
│   └── ...
└── product/
    ├── ProductTable.tsx
    ├── ProductForm.tsx
    ├── ProductRow.tsx
    ├── DiscountPolicy.tsx
    └── index.ts
```

### **3단계: AdminDashboardHeader 분리** ⭐⭐⭐ (예정)

**목적**: 관리자 대시보드 헤더 분리

**예상 구조**:

```
AdminDashboardHeader
├── Title (제목)
└── Description (설명)
```

### **4단계: AdminTabs 분리** ⭐⭐ (예정)

**목적**: 탭 네비게이션 분리

**예상 구조**:

```
AdminTabs
├── TabButton (개별 탭 버튼)
└── TabContent (탭 내용)
```

### **5단계: AdminPage 통합** ⭐⭐⭐⭐⭐ (최종)

**목적**: 모든 분리된 컴포넌트들을 통합

**예상 구조**:

```
AdminPage
├── AdminDashboardHeader
├── AdminTabs
├── ProductManagement (activeTab === 'products')
└── CouponManagement (activeTab === 'coupons')
```

## ��️ 핵심 설계 원칙

### **1. 도메인별 디렉토리 구조**

```
admin/
├── CouponManagement.tsx
├── ProductManagement.tsx
├── coupon/          # 쿠폰 관련 컴포넌트들
├── product/         # 상품 관련 컴포넌트들
└── index.ts
```

### **2. 컴포넌트 분리 기준**

- **복잡도**: 100줄 이상 → 분리 대상
- **재사용성**: 다른 곳에서 사용 가능 → 분리 대상
- **책임**: 단일 책임 원칙 준수

### **3. Props 전달 패턴**

```typescript
// 부모에서 자식으로 필요한 데이터와 함수만 전달
<CouponManagement
  coupons={coupons}
  couponForm={couponForm}
  onAddCoupon={onAddCoupon}
  addNotification={addNotification}
/>
```

## �� 작업 진행 상황

### **완료된 작업**

- ✅ CouponManagement 분리 (100%)
- ✅ CouponCard 분리 (100%)
- ✅ AddCouponButton 분리 (100%)
- ✅ CouponForm 분리 (100%)
- ✅ 디렉토리 구조 정리 (100%)

### **진행 중인 작업**

- 🔄 ProductManagement 분리 (0%)

### **예정된 작업**

- ⏳ AdminDashboardHeader 분리
- ⏳ AdminTabs 분리
- ⏳ AdminPage 통합

## 🎯 Middle-Out 방식의 장점

### **1. 에러 위험 최소화**

- 작은 단위로 분리하여 에러 발생 가능성 감소
- 각 단계마다 테스트 가능

### **2. 점진적 개선**

- 한 번에 모든 것을 분리하지 않고 단계별 진행
- 각 단계에서 피드백 반영 가능

### **3. 복잡도 관리**

- 가장 복잡한 부분부터 시작하여 전체 복잡도 점진적 감소
- 개발자 부담 분산

### **4. 재사용성 향상**

- 분리된 컴포넌트들은 독립적으로 재사용 가능
- 테스트 용이성 증가

## �� 다음 단계 계획

### **즉시 진행 가능**

1. **ProductManagement 분리**
   - ProductTable 컴포넌트 분리
   - ProductForm 컴포넌트 분리
   - product/ 디렉토리 생성

### **중기 계획**

2. **AdminDashboardHeader 분리**
3. **AdminTabs 분리**

### **최종 목표**

4. **AdminPage 완전 분리**
   - App.tsx에서 AdminPage 컴포넌트 사용
   - 완전한 페이지 레벨 분리

## 💡 학습 포인트

### **1. Middle-Out vs Top-Down vs Bottom-Up**

- **Middle-Out**: 복잡한 부분부터 시작 (현재 방식)
- **Top-Down**: 전체 구조부터 설계
- **Bottom-Up**: 작은 컴포넌트부터 조립

### **2. 컴포넌트 분리 기준**

- **복잡도**: 100줄 이상
- **재사용성**: 다른 곳에서 사용 가능
- **책임**: 단일 책임 원칙

### **3. 디렉토리 구조 설계**

- **도메인별**: coupon/, product/
- **계층별**: pages/admin/
- **재사용성**: ui/, components/

---

**현재 상태**: CouponManagement 분리 완료 ✅  
**다음 단계**: ProductManagement 분리 진행 예정 🚀
