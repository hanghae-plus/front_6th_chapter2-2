# 검증(Validation) 아키텍처 가이드

## 개요

이 문서는 쇼핑카트 애플리케이션의 검증 시스템과 알림 처리에 대한 역할 분담을 설명합니다.

## 핵심 원칙

### 1. 단일 책임 원칙 (SRP)
- **Validator**: 비즈니스 규칙 검증만 담당
- **Hook/Component**: 검증 결과에 따른 UI 상태 변경 및 사용자 알림 담당

### 2. 관심사 분리
- 검증 로직과 알림 처리를 명확히 분리
- 재사용 가능한 순수 함수로 검증 로직 구현

## 검증 시스템 구조

### Validator 함수들 (`src/basic/utils/validators.ts`)

#### Cart 도메인
```typescript
// 장바구니 재고 검증
validateCartStock(product: Product, requestedQuantity: number, cart: CartItem[])

// 쿠폰 사용 가능 여부 검증
validateCouponAvailable(coupon: Coupon, cartTotal: number)

// 쿠폰 코드 중복 검증
validateCouponCode(coupons: Coupon[], couponCode: string)
```

#### Admin 도메인
```typescript
// 관리자 가격 검증
validateAdminPrice(price: number)

// 관리자 재고 검증
validateAdminStock(stock: number)

// 할인율 검증
validateDiscountRate(rate: number)

// 할인 금액 검증
validateDiscountAmount(amount: number)
```

### 공통 반환 형태
모든 validator 함수는 일관된 형태로 결과를 반환합니다:

```typescript
{
  isValid: boolean;
  errorMessage?: string;
}
```

## 역할 분담

### Validator의 역할
- ✅ 비즈니스 규칙 검증
- ✅ 에러 메시지 생성
- ✅ 순수 함수로 구현 (부작용 없음)
- ❌ UI 상태 변경 금지
- ❌ 알림 표시 금지

### Hook/Component의 역할
- ✅ Validator 호출
- ✅ 검증 결과에 따른 상태 변경
- ✅ 사용자 알림 (`addNotification` 호출)
- ✅ 비즈니스 로직 실행

## 사용 패턴 예시

### useCart 훅에서의 사용
```typescript
const addToCart = useCallback((product: Product) => {
  // 1. Validator로 검증
  const validation = validateCartStock(product, newQuantity, cart);
  
  // 2. 검증 실패 시 알림 및 조기 반환
  if (validation.errorMessage) {
    addNotification?.(validation.errorMessage, "error");
    return;
  }

  // 3. 검증 성공 시 비즈니스 로직 실행
  setCart((prevCart) => cartModel.addItemToCart(prevCart, product));
  addNotification?.("장바구니에 담았습니다", "success");
}, [cart, addNotification]);
```

### AdminPage 컴포넌트에서의 사용
```typescript
onBlur={(e) => {
  const price = parseInt(e.target.value);
  
  // 1. Validator로 검증
  const validation = validateAdminPrice(price);
  
  // 2. 검증 실패 시 알림 및 상태 초기화
  if (validation.errorMessage) {
    addNotification(validation.errorMessage, "error");
    setProductForm({ ...productForm, price: 0 });
  }
}}
```

## 장점

### 1. 테스트 용이성
- Validator 함수들은 순수 함수로 단위 테스트가 쉬움
- 비즈니스 규칙 변경 시 해당 validator만 수정

### 2. 재사용성
- 동일한 검증 로직을 여러 컴포넌트에서 재사용 가능
- 도메인별로 그룹화되어 관리 효율성 증대

### 3. 유지보수성
- 검증 로직과 UI 로직이 분리되어 각각 독립적으로 수정 가능
- 에러 메시지 변경 시 validator 함수만 수정하면 전체 적용

### 4. 일관성
- 모든 검증 함수가 동일한 인터페이스를 사용
- 에러 처리 패턴이 일관됨

## 확장 가이드

새로운 검증 로직 추가 시:

1. **Validator 함수 생성**: 순수 함수로 비즈니스 규칙만 검증
2. **도메인별 그룹화**: Cart/Admin 등 적절한 섹션에 배치
3. **일관된 반환 형태**: `{ isValid, errorMessage }` 구조 유지
4. **Hook/Component에서 활용**: 검증 결과에 따른 UI 처리 구현

이 아키텍처를 통해 검증 로직의 재사용성과 유지보수성을 높이고, 코드의 가독성과 테스트 용이성을 확보할 수 있습니다.