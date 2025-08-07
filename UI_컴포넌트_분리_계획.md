# UI 컴포넌트 분리 계획

## 개요
UI와 데이터 컴포넌트를 분리하여 계층을 나누고, 스타일을 공유할 수 있는 재사용 가능한 컴포넌트들을 분리하는 계획입니다.

## 현재 상황 분석

### 1. 중복되는 UI 컴포넌트들

#### InputWithLabel 컴포넌트
- **위치**: `src/advanced/components/admin-page/products-tab/ui/InputWithLabel.tsx`
- **위치**: `src/advanced/components/admin-page/coupons-tab/ui/InputWithLabel.tsx`
- **위치**: `src/advanced/components/admin-page/ui/InputWithLabel.tsx`
- **문제점**: 동일한 기능의 컴포넌트가 3곳에 중복 존재
- **차이점**: 
  - products-tab: `text-sm` 클래스 없음
  - coupons-tab: `text-sm` 클래스 있음
  - admin-page/ui: 기본 버전

#### FormTitle 컴포넌트
- **위치**: `src/advanced/components/admin-page/products-tab/ui/FormTitle.tsx`
- **위치**: `src/advanced/components/admin-page/coupons-tab/ui/FormTitle.tsx`
- **문제점**: 완전히 동일한 컴포넌트가 중복 존재

#### Button 컴포넌트
- **위치**: `src/advanced/components/admin-page/products-tab/ui/Button.tsx`
- **문제점**: 단일 위치에만 존재하지만 재사용 가능한 스타일

### 2. 공통 스타일 패턴들

#### 버튼 스타일
```tsx
// 기본 버튼
className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"

// 취소 버튼
className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"

// 제출 버튼
className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"

// 장바구니 버튼
className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
  disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
}`}
```

#### 카드 스타일
```tsx
// 기본 카드
className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"

// 그라데이션 카드
className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"

// 섹션 카드
className="bg-white rounded-lg border border-gray-200"
```

#### 배지(Badge) 스타일
```tsx
// 할인 배지
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700"

// 재고 상태 배지
className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  stock > 10 ? 'bg-green-100 text-green-800' : 
  stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
  'bg-red-100 text-red-800'
}`}
```

## 제안하는 UI 컴포넌트 구조

### 1. 공통 UI 컴포넌트 (`src/advanced/components/ui/`)

#### 기본 컴포넌트들
- **Button.tsx** - 다양한 스타일의 버튼 (기본, 취소, 제출, 비활성화)
- **Input.tsx** - 기본 입력 필드
- **InputWithLabel.tsx** - 라벨이 있는 입력 필드 (variant 지원)
- **Select.tsx** - 기본 셀렉트 박스
- **SelectWithLabel.tsx** - 라벨이 있는 셀렉트 박스
- **Card.tsx** - 다양한 스타일의 카드 (기본, 그라데이션, 섹션)
- **Badge.tsx** - 상태별 배지 (성공, 경고, 오류, 정보)
- **Modal.tsx** - 모달 다이얼로그
- **Toast.tsx** - 알림 토스트 (기존 UIToast 개선)

#### 아이콘 컴포넌트들 ✅
- **DeleteIcon.tsx** - 삭제 아이콘
- **AddIcon.tsx** - 추가 아이콘
- **CloseIcon.tsx** - 닫기 아이콘
- **CartIcon.tsx** - 장바구니 아이콘
- **EmptyCartIcon.tsx** - 빈 장바구니 아이콘
- **ImagePlaceholderIcon.tsx** - 이미지 플레이스홀더 아이콘

#### 레이아웃 컴포넌트들
- **Container.tsx** - 컨테이너 레이아웃
- **Grid.tsx** - 그리드 레이아웃
- **Flex.tsx** - Flexbox 레이아웃
- **Section.tsx** - 섹션 레이아웃
- **Divider.tsx** - 구분선

#### 폼 컴포넌트들
- **Form.tsx** - 폼 컨테이너
- **FormTitle.tsx** - 폼 제목
- **FormGroup.tsx** - 폼 그룹
- **FormActions.tsx** - 폼 액션 버튼들

### 2. 도메인별 UI 컴포넌트

#### Admin UI (`src/advanced/components/admin-page/ui/`)
- **AdminButton.tsx** - 관리자 페이지 전용 버튼
- **AdminCard.tsx** - 관리자 페이지 전용 카드
- **AdminTable.tsx** - 관리자 페이지 전용 테이블
- **TabTitle.tsx** - 탭 제목 (기존 유지)
- **PageTitle.tsx** - 페이지 제목 (기존 유지)

#### Cart UI (`src/advanced/components/cart-page/ui/`)
- **CartButton.tsx** - 장바구니 전용 버튼
- **CartCard.tsx** - 장바구니 전용 카드
- **CartBadge.tsx** - 장바구니 전용 배지

### 3. 분리 완료된 UI/데이터 컴포넌트 ✅

#### ProductCard 분리 완료
- **ProductCard.tsx** - 데이터 컴포넌트 (비즈니스 로직, 데이터 가공)
- **ProductCardUI.tsx** - UI 컴포넌트 (순수 표현 역할)

#### ProductsForm 분리 완료
- **ProductsForm.tsx** - 데이터 컴포넌트 (폼 상태 관리, 데이터 가공)
- **ProductsFormUI.tsx** - UI 컴포넌트 (순수 표현 역할)

### 4. 컴포넌트 설계 원칙 및 지침

#### UI 컴포넌트 정의
- **순수성**: 컴포넌트 내부에서 데이터(props)를 가공하지 않음
- **표현성**: 주입된 props를 그대로 표현하는 역할만 담당
- **재사용성**: 다양한 컨텍스트에서 재사용 가능하도록 설계

#### 컴포넌트 설계 원칙
- **확장성 고려**: 향후 확장 가능성을 염두에 두고 설계
- **현재 사용성 우선**: 현재 시점에서 사용하지 않는 값은 정의하지 않음
- **점진적 확장**: 실제 필요가 생길 때 옵션을 추가하는 방식
- **일관성 유지**: 프로젝트 전체에서 사용되는 스타일과 패턴만 포함

#### Props 설계
```tsx
// Button 예시 (현재 사용되는 옵션만 포함)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'; // ghost 제거 (사용되지 않음)
  size?: 'md' | 'lg'; // sm 제거 (사용되지 않음)
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string; // 추가 스타일링을 위한 선택적 클래스
}

// Card 예시 (현재 사용되는 옵션만 포함)
interface CardProps {
  variant?: 'default' | 'gradient'; // section 제거 (사용되지 않음)
  padding?: 'md' | 'lg'; // sm 제거 (사용되지 않음)
  children: ReactNode;
  className?: string;
}

// ProductCard UI 예시
interface ProductCardUIProps {
  name: string;
  description?: string;
  price: string;
  discountRate?: string;
  isRecommended: boolean;
  stockStatus: 'sufficient' | 'low' | 'out';
  remainingStock: number;
  onAddToCart: () => void;
}
```

#### 스타일 변형 지원 (현재 사용되는 스타일만 포함)
```tsx
// Button 컴포넌트 내부
const buttonVariants = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700'
  // ghost 제거 (현재 사용되지 않음)
};

const buttonSizes = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
  // sm 제거 (현재 사용되지 않음)
};
```

## 마이그레이션 계획

### Phase 1: UI/데이터 컴포넌트 분리 ✅ (완료)
1. ProductCard UI/데이터 분리 완료
2. ProductsForm UI/데이터 분리 완료
3. 기타 데이터 가공이 있는 컴포넌트들 분리 예정

### Phase 2: 공통 컴포넌트 생성 ✅ (완료)
1. `src/advanced/components/ui/` 폴더에 기본 컴포넌트들 생성 완료
2. Button, Input, Card, Badge 컴포넌트 구현 완료
3. 기존 중복 컴포넌트들과 호환성 유지 완료

### Phase 3: 중복 제거 ✅ (완료)
1. 동일한 기능의 중복 컴포넌트들을 공통 컴포넌트로 교체 완료
2. 기존 스타일과 동일한 variant 제공 완료
3. 점진적으로 마이그레이션 완료

### Phase 4: 도메인별 컴포넌트 정리
1. 도메인별 특화 컴포넌트 생성
2. 공통 컴포넌트를 확장하여 도메인별 기능 추가
3. 일관된 디자인 시스템 구축

## 예상 효과

### 1. 코드 중복 제거
- InputWithLabel 컴포넌트 중복 제거
- FormTitle 컴포넌트 중복 제거
- 버튼 스타일 중복 제거

### 2. 일관성 향상
- 동일한 기능의 컴포넌트들이 일관된 스타일 사용
- 디자인 시스템 구축으로 UI 일관성 보장

### 3. 유지보수성 향상
- 스타일 변경 시 한 곳에서만 수정
- 새로운 컴포넌트 추가 시 기존 패턴 활용

### 4. 개발 생산성 향상
- 재사용 가능한 컴포넌트로 빠른 개발
- Props를 통한 유연한 커스터마이징

### 5. 관심사 분리
- UI 컴포넌트는 순수하게 표현 역할만 담당
- 데이터 컴포넌트는 비즈니스 로직과 데이터 가공 처리
- 테스트 용이성 향상

### 6. 재사용성 향상
- UI 컴포넌트는 다양한 컨텍스트에서 재사용 가능
- 데이터 로직 변경 시 UI 컴포넌트에 영향 없음

## 컴포넌트 설계 지침

### 확장성 vs 현재 사용성 균형
- **확장성 고려**: 향후 기능 확장을 위한 구조 설계
- **현재 사용성 우선**: 실제 사용되는 기능만 구현
- **점진적 확장**: 필요에 따라 옵션 추가

### 최적화 원칙
- **YAGNI (You Aren't Gonna Need It)**: 지금 필요하지 않은 기능은 구현하지 않음
- **실용적 설계**: 과도한 추상화보다는 현재 요구사항에 맞는 설계
- **유지보수성**: 코드 복잡도 최소화로 유지보수 용이성 확보

### 컴포넌트 옵션 관리
- **현재 사용 패턴 분석**: 실제 프로젝트에서 사용되는 스타일과 옵션만 포함
- **불필요한 옵션 제거**: 사용되지 않는 variant, size, color 등 제거
- **일관된 인터페이스**: 모든 컴포넌트가 동일한 패턴으로 옵션 관리

## 현재 진행 상황

### ✅ 완료된 작업
1. **아이콘 컴포넌트 분리**: SVG 아이콘들을 `src/advanced/components/icons/` 폴더에 분리
2. **ProductCard UI/데이터 분리**: ProductCard를 UI 컴포넌트와 데이터 컴포넌트로 분리 완료
3. **ProductsForm UI/데이터 분리**: ProductsForm을 UI 컴포넌트와 데이터 컴포넌트로 분리 완료

### ✅ 완료된 작업
1. **아이콘 컴포넌트 분리**: SVG 아이콘들을 `src/advanced/components/icons/` 폴더에 분리
2. **ProductCard UI/데이터 분리**: ProductCard를 UI 컴포넌트와 데이터 컴포넌트로 분리 완료
3. **ProductsForm UI/데이터 분리**: ProductsForm을 UI 컴포넌트와 데이터 컴포넌트로 분리 완료
4. **중복 컴포넌트 통합**: InputWithLabel, FormTitle, Button, Card 등 중복 컴포넌트들을 공통 컴포넌트로 통합 완료
5. **컴포넌트 최적화**: 실제 사용하지 않는 스타일과 옵션들을 제거하여 컴포넌트를 간소화 완료
6. **Badge 컴포넌트 활용**: 기존 배지 스타일들을 Badge 컴포넌트로 교체 완료

### 📋 남은 작업
1. **도메인별 UI 컴포넌트 정리**: Admin UI, Cart UI 등 도메인별 특화 컴포넌트 정리
2. **테스트 및 검증**: 기능과 스타일이 올바르게 작동하는지 확인

## 다음 단계

1. **도메인별 컴포넌트 정리**: Admin UI, Cart UI 등 도메인별 특화 컴포넌트 정리
2. **테스트 및 검증**: 기능과 스타일이 올바르게 작동하는지 확인
