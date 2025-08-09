# Day 4: Notification 시스템 + UI 컴포넌트 분리

## 목표

- Notification 시스템 완전 분리
- 재사용 가능한 UI 컴포넌트 생성
- 검색 및 디바운스 기능 모듈화

## 작업 범위

### 1단계: Notification 관련 컴포넌트 분리

```typescript
// src/advanced/components/ui/NotificationList.tsx
export const NotificationList: React.FC;

// src/advanced/components/ui/Toast.tsx
export const Toast: React.FC<ToastProps>;
```

### 2단계: Notification 상수 분리

```typescript
// src/advanced/constants/notification.ts
export const NOTIFICATION_DURATION = 3000;
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
} as const;
```

### 3단계: Notification 순수함수 분리

```typescript
// src/advanced/utils/notificationUtils.ts
export const createNotification = (message: string, type: NotificationType): Notification
export const generateNotificationId = (): string
```

### 4단계: Notification 상태관리 (Atom + Hook)

```typescript
// src/advanced/models/notificationAtoms.ts
export const notificationsAtom = atom<Notification[]>([]);

// src/advanced/hooks/useNotifications.ts
export const useNotifications = () => {
  // 알림 추가/제거/자동제거
};
```

### 5단계: 재사용 가능한 UI 컴포넌트 생성

```typescript
// src/advanced/components/ui/Button.tsx
export const Button: React.FC<ButtonProps>;

// src/advanced/components/ui/Input.tsx
export const Input: React.FC<InputProps>;

// src/advanced/components/ui/SearchInput.tsx
export const SearchInput: React.FC<SearchInputProps>;

// src/advanced/components/ui/TabNavigation.tsx
export const TabNavigation: React.FC<TabNavigationProps>;
```

### 6단계: 검색 및 디바운스 기능 모듈화

```typescript
// src/advanced/utils/hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T

// src/advanced/utils/searchUtils.ts
export const searchProducts = (products: ProductWithUI[], term: string): ProductWithUI[]
```

### 7단계: App.tsx에서 해당 코드 제거 및 연결

## 이전 작업과의 연결점

- Day 1-3에서 분리한 모든 도메인과 연동
- 모든 도메인에서 notification 사용

## 테스트 전략

- [ ] 알림 시스템 동작 테스트
- [ ] UI 컴포넌트 렌더링 테스트
- [ ] 디바운스 기능 테스트
- [ ] 검색 기능 테스트

## 성공 기준

1. Notification 시스템이 완전히 분리됨
2. 재사용 가능한 UI 컴포넌트들이 생성됨
3. App 컴포넌트가 대폭 간소화됨
4. 모든 기존 테스트가 통과함

## 다음 날 준비사항

- 최종 App 컴포넌트 정리 준비
- 관리자 페이지 컴포넌트 완성 준비
