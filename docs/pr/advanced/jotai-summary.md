# 💡 학습 포인트

### **Jotai 기본 개념 습득**

- **atom**: 상태의 기본 단위, React의 useState와 유사하지만 전역에서 접근 가능
- **기본 atom**: `atom(initialValue)` - 단순한 상태 저장
- **타입 안전성**: TypeScript와 완벽 호환으로 런타임 오류 방지
- **모듈화**: 도메인별로 atoms 분리하여 관심사 분리

### **Props Drilling 해결 전략**

- **문제**: 깊은 컴포넌트 계층에서 props 전달의 복잡성
- **해결**: atoms를 통한 전역 상태 관리로 컴포넌트가 필요한 상태 직접 구독
- **효과**: 컴포넌트 간 결합도 감소, 코드 가독성 향상

---

# Q. Jotai 에 대한 기본 설명을 해줘.

# Jotai 핵심 정리

## 🎯 Atom이란?

**Jotai에서 상태를 저장하는 가장 작은 단위**

- React의 `useState`와 비슷하지만 **전역에서 접근 가능**
- `atom(initialValue)` 형태로 생성

## �� Atoms의 3가지 역할

### **1. 상태 저장 (기본 atom)**

```typescript
const isAdminAtom = atom(false);
const productsAtom = atom([]);
```

**역할**: 데이터를 저장하는 "상자"

### **2. 계산된 값 제공 (파생 atom)**

```typescript
const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  return products.filter(p => p.name.includes(searchTerm));
});
```

**역할**: "계산기" - 다른 데이터를 조합해서 새로운 값 제공

### **3. 상태 변경 로직 캡슐화 (액션 atom)**

```typescript
const addToCartAtom = atom(
  null, // 읽기 값
  (get, set, product) => {
    // 쓰기 함수
    const cart = get(cartAtom);
    const newCart = [...cart, product];
    set(cartAtom, newCart);
  }
);
```

**역할**: "액션 실행기" - 상태를 변경하는 로직 담당

## ��️ Jotai 내장 함수들

### **`get` 함수**

- **역할**: 다른 atom의 값을 읽어오는 함수
- **특징**: 자동 의존성 추적, 타입 안전성

### **`set` 함수**

- **역할**: 다른 atom의 값을 변경하는 함수
- **특징**: 원자적 업데이트, 자동 리렌더링

### **React Hooks**

```typescript
const [value, setValue] = useAtom(atom); // 읽기/쓰기
const value = useAtomValue(atom); // 읽기만
const setValue = useSetAtom(atom); // 쓰기만
```

## ⚡ 핵심 장점

### **자동 동기화**

```typescript
// searchTerm이 변경되면 자동으로 filteredProducts도 업데이트
const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom); // 의존성
  return products.filter(p => p.name.includes(searchTerm));
});
```

### **Props Drilling 해결**

```typescript
// Before: props로 전달
<ProductList products={filteredProducts} />

// After: 직접 구독
const ProductList = () => {
  const filteredProducts = useAtomValue(filteredProductsAtom);
  return <div>{/* 렌더링 */}</div>;
};
```

## 💡 핵심 포인트

- **`get`**: "이 atom의 값을 읽어줘, 변경되면 나도 다시 계산할게"
- **`set`**: "이 atom의 값을 변경해줘, 구독하는 모든 컴포넌트를 업데이트해줘"
- **자동 의존성 관리**: React의 useEffect와 달리 수동으로 의존성 배열 관리 불필요

## 🎯 실제 적용 단계 진행 방법

### **1단계: 액션 Atoms 생성** (상태 변경 로직)

```typescript
// atoms/productAtoms.ts에 추가
export const addProductAtom = atom(
  null, // 읽기 값 없음
  (get, set, newProduct) => {
    const products = get(productsAtom);
    set(productsAtom, [...products, newProduct]);
  }
);
```

### **2단계: Custom Hooks 전환** (atoms 기반)

```typescript
// hooks/useProductAtoms.ts 생성
export const useProductAtoms = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const addProduct = useSetAtom(addProductAtom);

  return { products, filteredProducts, addProduct };
};
```

### **3단계: App.tsx 리팩토링** (Provider 추가)

```typescript
// App.tsx
import { Provider } from 'jotai';

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};
```

### **4단계: 컴포넌트 전환** (atoms 직접 구독)

```typescript
// AdminPage.tsx
export const AdminPage = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const products = useAtomValue(productsAtom);
  // props 받지 않고 atoms 직접 사용

  return <div>{/* 렌더링 */}</div>;
};
```

### **5단계: Props 제거** (23개 → 0개)

```typescript
// Before: 23개 props
<AdminPage activeTab={activeTab} products={products} ... />

// After: 0개 props
<AdminPage />
```

## 🎯 핵심 포인트

1. **액션 atoms**: 상태 변경 로직을 atoms로 캡슐화
2. **Provider**: Jotai Provider로 앱 감싸기
3. **직접 구독**: 컴포넌트에서 `useAtomValue`, `useSetAtom` 사용
4. **Props 제거**: 모든 props 전달 제거

# Q. 갑자기 다시 궁금해졌는데 atom 은 엔티티 컴포넌트에 관련된 비즈니스로직을 전역상태로 관리하는 개념인거야?

아니요! 그건 **Redux**나 **Zustand** 같은 전통적인 전역 상태 관리 라이브러리의 개념입니다.

## 🎯 Jotai의 핵심 철학

Jotai는 **"전역 상태 관리"**가 아니라 **"원자적 상태 관리"**입니다!

### **Jotai vs 전통적인 전역 상태 관리**

#### **Redux/Zustand (전통적 방식)**

```typescript
// ❌ 전역 스토어에 모든 비즈니스 로직 집중
const store = {
  products: [],
  cart: [],
  coupons: [],
  // 모든 상태가 하나의 거대한 객체에
  addProduct: product => {
    /* 복잡한 로직 */
  },
  updateCart: item => {
    /* 복잡한 로직 */
  },
};
```

#### **Jotai (원자적 방식)**

```typescript
// ✅ 작은 단위로 분산된 상태
const productsAtom = atom([]); // 상품만
const cartAtom = atom([]); // 장바구니만
const searchTermAtom = atom(''); // 검색어만

// 필요한 곳에서만 조합
const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  return products.filter(p => p.name.includes(searchTerm));
});
```

## 💡 Jotai의 핵심 아이디어

### **1. 원자적 단위 (Atomic)**

- 각 atom은 **하나의 작은 상태**만 담당
- 비즈니스 로직이 아니라 **순수한 데이터**

### **2. 조합 가능 (Composable)**

- 작은 atoms를 조합해서 복잡한 상태 생성
- 필요할 때만 조합, 불필요한 의존성 없음

### **3. 지역적 접근 (Local Access)**

- 컴포넌트가 필요한 atoms만 구독
- 전역이지만 **지역적으로 사용**

## 🎯 실제 예시

```typescript
// ❌ 전통적 방식: 거대한 전역 스토어
const globalStore = {
  // 모든 비즈니스 로직이 한 곳에
  products: [],
  cart: [],
  user: {},
  settings: {},
  addProduct: () => {},
  updateCart: () => {},
  // ... 수십 개의 액션들
};

// ✅ Jotai 방식: 작은 atoms 조합
const productsAtom = atom([]);
const cartAtom = atom([]);
const searchAtom = atom('');

// 필요할 때만 조합
const filteredProductsAtom = atom(get => {
  const products = get(productsAtom);
  const search = get(searchAtom);
  return products.filter(p => p.name.includes(search));
});
```

## �� 핵심 차이점

| 구분       | 전통적 전역 상태 | Jotai          |
| ---------- | ---------------- | -------------- |
| **단위**   | 거대한 스토어    | 작은 atoms     |
| **조합**   | 미리 정의된 구조 | 필요시 조합    |
| **접근**   | 전체 스토어 접근 | 필요한 atoms만 |
| **의존성** | 강한 결합        | 느슨한 결합    |

## �� 결론

Jotai는 **"비즈니스 로직을 전역으로 관리"**하는 것이 아니라, **"작은 상태들을 원자적으로 관리하고 필요시 조합"**하는 방식입니다!

- **Redux**: "모든 것을 한 곳에서 관리"
- **Jotai**: "작은 것들을 조합해서 사용"

이것이 Jotai의 핵심 철학입니다! 🎯

# Q. 아하.. 정말 잘개 쪼개진 데이터 단위를 관리한다고 보면 될까? 여기서 관리는 구독과 변경(?) 이 맞을까?

네, 정확히 맞습니다! 🎯

## 💡 Jotai의 핵심 개념 정리

### **1. 잘개 쪼개진 데이터 단위**

```typescript
// ✅ 각각이 독립적인 작은 데이터 단위
const searchTermAtom = atom(''); // 검색어만
const isAdminAtom = atom(false); // 관리자 여부만
const cartAtom = atom([]); // 장바구니만
const selectedCouponAtom = atom(null); // 선택된 쿠폰만
```

### **2. 관리 = 구독 + 변경**

#### **구독 (Subscription)**

```typescript
// 컴포넌트에서 atoms 구독
const ProductList = () => {
  const products = useAtomValue(productsAtom);        // 읽기 구독
  const searchTerm = useAtomValue(searchTermAtom);    // 읽기 구독

  return <div>{/* 렌더링 */}</div>;
};
```

#### **변경 (Mutation)**

```typescript
// 컴포넌트에서 atoms 변경
const SearchBar = () => {
  const setSearchTerm = useSetAtom(searchTermAtom);   // 쓰기 구독

  return (
    <input onChange={(e) => setSearchTerm(e.target.value)} />
  );
};
```

## �� 핵심 포인트

### **"관리"의 의미**

- **구독**: "이 데이터가 변경되면 나도 업데이트할게"
- **변경**: "이 데이터를 새로운 값으로 바꿔줘"

### **자동 동기화**

```typescript
// searchTerm이 변경되면 자동으로 구독하는 모든 컴포넌트 업데이트
const SearchBar = () => {
  const setSearchTerm = useSetAtom(searchTermAtom);
  // setSearchTerm 호출 → 자동으로 ProductList도 리렌더링
};

const ProductList = () => {
  const searchTerm = useAtomValue(searchTermAtom);
  // searchTerm 변경 감지 → 자동 리렌더링
};
```

## �� 비유로 이해하기

### **구독 = 신문 구독**

```typescript
// "이 신문이 나오면 나도 받을게"
const Component = () => {
  const data = useAtomValue(dataAtom); // 신문 구독
};
```

### **변경 = 신문 발행**

```typescript
// "새로운 신문을 발행할게"
const Component = () => {
  const setData = useSetAtom(dataAtom); // 신문 발행
  setData(newValue); // 새로운 신문 발행
};
```

## �� 결론

**Jotai = 잘개 쪼개진 데이터 단위의 구독/변경 관리**

- **데이터**: 작은 단위로 분산
- **구독**: 변경 감지 및 자동 업데이트
- **변경**: 원자적 업데이트 및 구독자들에게 알림

이것이 Jotai의 핵심입니다! 🚀
