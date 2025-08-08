# UI 컴포넌트 분리 전후 스타일 변경 사항

## 개요
UI 컴포넌트 분리 작업을 통해 기존 인라인 스타일들이 공통 컴포넌트로 통합되면서 발생한 스타일 변경 사항들을 정리한 문서입니다.

## 주요 변경 사항

### 1. InputWithLabel 컴포넌트

#### 변경 전 (인라인 스타일)
```tsx
<input 
  type="text" 
  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
  {...inputOptions} 
/>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<InputWithLabel
  label="상품명"
  value={name}
  onChange={onNameChange}
  variant="products"  // 새로 추가된 variant
  required
/>
```

#### 스타일 변경 내용
- **variant 추가**: `products`, `coupons` variant로 도메인별 스타일 구분
- **일관된 스타일링**: 모든 InputWithLabel이 동일한 기본 스타일 사용
- **확장성**: className prop을 통한 추가 커스터마이징 가능

### 2. Badge 컴포넌트

#### 변경 전 (인라인 스타일)
```tsx
// CouponCard
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
  {discountType === 'amount' ? `${formatNumberWon({ number: discountValue })} 할인` : `${discountValue}% 할인`}
</span>

// ProductCardUI
<span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
  BEST
</span>

// CartPageHeader
<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
  {totalItemCount}
</span>
```

#### 변경 후 (공통 컴포넌트)
```tsx
// CouponCard
<Badge variant="discount">
  {discountType === 'amount' ? `${formatNumberWon({ number: discountValue })} 할인` : `${discountValue}% 할인`}
</Badge>

// ProductCardUI
<Badge variant="error" className="absolute top-2 right-2">
  BEST
</Badge>

// CartPageHeader
<Badge variant="error" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center">
  {totalItemCount}
</Badge>
```

#### 스타일 변경 내용
- **variant 시스템**: `error`, `discount`, `stock` variant로 상태별 스타일 구분
- **일관된 디자인**: 모든 배지가 동일한 기본 스타일 사용
- **위치 조정**: className을 통한 위치 조정 가능

### 3. Card 컴포넌트

#### 변경 전 (인라인 스타일)
```tsx
<div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
  {children}
</div>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<Card variant="gradient">
  {children}
</Card>
```

#### 스타일 변경 내용
- **variant 시스템**: `default`, `gradient` variant로 스타일 구분
- **일관된 패딩**: 모든 Card가 동일한 기본 패딩 사용
- **확장성**: padding prop을 통한 패딩 조정 가능

### 4. FormTitle 컴포넌트

#### 변경 전 (인라인 스타일)
```tsx
// Products 폼
<h3 className="text-lg font-medium text-gray-900">{children}</h3>

// Coupons 폼
<h3 className="text-md font-medium text-gray-900">{children}</h3>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<FormTitle size="lg">{title}</FormTitle>
```

#### 스타일 변경 내용
- **size 시스템**: `md`, `lg` size로 크기 구분
- **일관된 폰트**: 모든 FormTitle이 동일한 폰트 스타일 사용
- **확장성**: className prop을 통한 추가 스타일링 가능

### 5. PageHeader 컴포넌트 (새로 생성)

#### 변경 전 (분리된 컴포넌트)
```tsx
// PageTitle
<h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>

// PageInfo
<p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
```

#### 변경 후 (통합된 컴포넌트)
```tsx
<PageHeader 
  title="관리자 대시보드"
  description="상품과 쿠폰을 관리할 수 있습니다"
/>
```

#### 스타일 변경 내용
- **통합된 구조**: 제목과 설명을 하나의 컴포넌트로 통합
- **일관된 간격**: 제목과 설명 사이의 간격이 일관되게 적용
- **확장성**: description이 선택적이며 className prop 지원

### 6. TabTitle 컴포넌트

#### 변경 전 (도메인별 컴포넌트)
```tsx
<h2 className="text-lg font-semibold">{children}</h2>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<TabTitle>{children}</TabTitle>
```

#### 스타일 변경 내용
- **일관된 스타일**: 모든 탭 제목이 동일한 스타일 사용
- **확장성**: className prop을 통한 추가 스타일링 가능

### 7. SelectWithLabel 컴포넌트

#### 변경 전 (도메인별 컴포넌트)
```tsx
<select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm">
  {options.map(({ label, value }) => (
    <option key={value} value={value}>{label}</option>
  ))}
</select>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<SelectWithLabel
  label="할인 타입"
  options={[
    { label: '정액 할인', value: 'amount' },
    { label: '정률 할인', value: 'percentage' },
  ]}
  value={discountType}
  onChange={handleDiscountTypeChange}
/>
```

#### 스타일 변경 내용
- **라벨 통합**: select와 label이 하나의 컴포넌트로 통합
- **일관된 스타일**: InputWithLabel과 동일한 스타일 사용
- **확장성**: className prop을 통한 추가 스타일링 가능

### 8. CartTitle 컴포넌트

#### 변경 전 (도메인별 컴포넌트)
```tsx
<h2 className="text-lg font-semibold mb-4 flex items-center">
  <CartIcon />
  {children}
</h2>
```

#### 변경 후 (공통 컴포넌트)
```tsx
<CartTitle>{children}</CartTitle>
```

#### 스타일 변경 내용
- **아이콘 통합**: CartIcon이 컴포넌트 내부에 포함
- **일관된 스타일**: 모든 CartTitle이 동일한 스타일 사용
- **확장성**: className prop을 통한 추가 스타일링 가능

## 제거된 스타일 옵션들

### 1. Badge 컴포넌트
- **제거된 variant**: `success`, `warning`, `info`
- **제거된 size**: `sm`
- **이유**: 현재 프로젝트에서 사용되지 않음

### 2. Button 컴포넌트
- **제거된 variant**: `ghost`
- **제거된 size**: `sm`
- **이유**: 현재 프로젝트에서 사용되지 않음

### 3. Card 컴포넌트
- **제거된 variant**: `section`, `product`
- **제거된 padding**: `sm`
- **이유**: 현재 프로젝트에서 사용되지 않음

### 4. FormTitle 컴포넌트
- **제거된 size**: `sm`
- **이유**: 현재 프로젝트에서 사용되지 않음

### 5. InputWithLabel 컴포넌트
- **제거된 size**: `sm`
- **이유**: 현재 프로젝트에서 사용되지 않음

## 스타일 변경의 장점

### 1. 일관성 향상
- 모든 컴포넌트가 동일한 디자인 시스템을 따름
- 도메인별로 일관된 스타일 적용

### 2. 유지보수성 향상
- 스타일 변경 시 한 곳에서만 수정하면 됨
- 새로운 스타일 추가가 용이

### 3. 재사용성 향상
- 공통 컴포넌트로 다양한 곳에서 재사용 가능
- variant와 size를 통한 유연한 스타일링

### 4. 개발 생산성 향상
- 인라인 스타일 작성 불필요
- 컴포넌트 기반의 빠른 개발

## 주의사항

### 1. 기존 스타일과의 차이점
- **수정 완료**: 모든 컴포넌트가 기존 인라인 스타일과 정확히 동일하게 수정됨
- variant 시스템 도입으로 스타일 선택이 명시적으로 변경됨
- **Badge 컴포넌트**: 기존 인라인 스타일과 정확히 일치하도록 수정됨
  - `bg-red-500 text-white` (error variant)
  - `bg-orange-500 text-white` (stock variant)
  - `bg-white text-indigo-700` (discount variant)
  - `px-2 py-1 text-xs` (md size)
  - `rounded` (base classes)

### 2. 확장 시 고려사항
- 새로운 variant나 size 추가 시 모든 사용처를 고려해야 함
- 기존 스타일과의 호환성을 유지해야 함

### 3. 테스트 필요성
- 스타일 변경으로 인한 시각적 차이가 없는지 확인 필요
- 모든 브라우저에서 일관된 렌더링 확인 필요
