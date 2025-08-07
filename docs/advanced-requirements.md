# Advanced 과제 요구사항

## 개요

Context나 Jotai를 사용해서 Props drilling을 없애는 심화 과제입니다. Basic에서 분리한 컴포넌트들을 기반으로 전역 상태 관리를 적용합니다.

## 목표

- Props drilling 문제 해결
- 전역 상태 관리 방법 습득
- Context 또는 Jotai를 활용한 상태 관리
- 컴포넌트 간 데이터 전달 최적화

## 핵심 개념

### Props Drilling 문제

- Container-Presenter 패턴에서 발생하는 깊은 props 전달
- 불필요한 props 전달로 인한 컴포넌트 복잡성 증가
- 상태 관리의 중앙화 필요성

### 전역 상태 관리 선택

- **Jotai**: 전역 상태 관리가 낯설다면 선택 (참고자료 참고)
- **Context**: 깊이 공부하고 싶다면 선택

## 기능 요구사항

### 1. Props Drilling 제거

- [ ] 불필요한 props 제거
- [ ] 필요한 props만 전달하도록 개선
- [ ] 컴포넌트 간 데이터 전달 최적화

### 2. 전역 상태 관리 구현

- [ ] Context 또는 Jotai 선택 및 구현
- [ ] 상태를 중앙에서 관리
- [ ] 컴포넌트에서 상태 접근 최적화

### 3. 컴포넌트 구조 개선

- [ ] UI 컴포넌트와 엔티티 컴포넌트의 props 차별화
- [ ] 재사용성과 독립성 고려
- [ ] 콜백 처리 방식 개선

## 코드 개선 요구사항

### 1. UI 컴포넌트 설계

- [ ] 상태를 최소화하여 재사용성 향상
- [ ] 이벤트 핸들러를 props로 받아서 처리
- [ ] 독립적인 컴포넌트 설계

### 2. 엔티티 컴포넌트 설계

- [ ] 엔티티를 중심으로 props 전달
- [ ] 컴포넌트 내부에서 상태 관리
- [ ] 전역 상태와의 연동

### 3. 콜백 처리 개선

- [ ] UI 컴포넌트: 이벤트 핸들러를 props로 받음
- [ ] 엔티티 컴포넌트: 내부에서 상태 관리
- [ ] 전역 상태를 통한 데이터 흐름

### 4. 테스트 코드 통과

- [ ] 모든 테스트 케이스 통과
- [ ] 전역 상태 관리 테스트

## 구현 가이드

### Context API 사용 시

```typescript
// Context 생성
const CartContext = createContext();

// Provider 구현
const CartProvider = ({ children }) => {
  // 상태 및 로직
  return <CartContext.Provider value={...}>{children}</CartContext.Provider>;
};

// Hook 생성
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
```

### Jotai 사용 시

```typescript
// Atom 정의
const cartAtom = atom([]);
const productsAtom = atom([]);

// Hook 생성
const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  // 로직 구현
  return { cart, setCart, ... };
};
```

## 평가 기준

### 1. Props Drilling 제거 정도

- [ ] 불필요한 props 전달 제거
- [ ] 컴포넌트 계층 간 데이터 전달 최적화
- [ ] 전역 상태 활용도

### 2. 코드 품질

- [ ] 컴포넌트 재사용성
- [ ] 코드 가독성
- [ ] 유지보수성

### 3. 성능 최적화

- [ ] 불필요한 리렌더링 방지
- [ ] 메모이제이션 활용
- [ ] 상태 업데이트 최적화

### 4. 테스트 커버리지

- [ ] 전역 상태 관리 테스트
- [ ] 컴포넌트 동작 테스트
- [ ] 통합 테스트

## 제약사항

- Basic 과제의 컴포넌트 분리 결과물 기반
- Context 또는 Jotai 중 하나 선택하여 구현
- 기존 기능은 모두 유지
- 테스트 코드 통과 필수
