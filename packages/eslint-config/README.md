# @clean-code/eslint

클린 코드 프로젝트를 위한 ESLint 설정 패키지입니다.

## 설정 종류

### 1. JavaScript 기본 설정 (`/js`)

- JavaScript 파일 전용 설정
- 기본적인 린트 규칙 적용
- 테스트 파일에 대한 특별 규칙 포함

### 2. TypeScript 설정 (`/ts`)

- TypeScript 파일 전용 설정
- TypeScript 관련 규칙 포함
- 엄격한 타입 체크 규칙 적용

### 3. React + TypeScript 설정 (`/react`)

- React + TypeScript 프로젝트 전용 설정
- React 관련 규칙 포함
- React Hooks 규칙 포함
- React Refresh 규칙 포함

## 사용 방법

### JavaScript 프로젝트 (apps/basic, apps/original)

```javascript
// eslint.config.js
import jsConfig from '@clean-code/eslint/js';

export default jsConfig;
```

### TypeScript 프로젝트

```javascript
// eslint.config.js
import tsConfig from '@clean-code/eslint/ts';

export default tsConfig;
```

### React + TypeScript 프로젝트 (apps/advanced)

```javascript
// eslint.config.js
import reactConfig from '@clean-code/eslint/react';

export default reactConfig;
```

## 주요 규칙

### JavaScript 규칙

- `no-var`: `var` 사용 금지
- `prefer-const`: 가능한 경우 `const` 사용
- `no-console`: `console` 사용 경고
- `complexity`: 함수 복잡도 제한 (10)
- `max-depth`: 중첩 깊이 제한 (3)

### TypeScript 규칙

- `@typescript-eslint/no-explicit-any`: `any` 타입 사용 경고
- `@typescript-eslint/no-unused-vars`: 사용하지 않는 변수 경고
- `@typescript-eslint/prefer-nullish-coalescing`: nullish coalescing 사용 권장
- `@typescript-eslint/prefer-optional-chain`: optional chaining 사용 권장

### React 규칙

- `react-hooks/rules-of-hooks`: Hooks 규칙 강제
- `react-hooks/exhaustive-deps`: useEffect 의존성 배열 검사
- `react/jsx-key`: JSX 리스트에 key 속성 필수
- `react/no-array-index-key`: 배열 인덱스를 key로 사용 금지

## 스크립트

각 앱에서 다음 스크립트를 사용할 수 있습니다:

```bash
# 린트 검사
pnpm lint

# 린트 오류 자동 수정
pnpm lint:fix
```

## 테스트 파일 규칙

테스트 파일(`*.test.js`, `*.test.ts`, `*.test.tsx`)에는 다음과 같은 특별 규칙이 적용됩니다:

- `no-console`: 허용 (테스트 로그용)
- `complexity`: 제한 없음
- TypeScript 관련 엄격한 규칙들 완화

## 설정 커스터마이징

필요한 경우 각 앱의 `eslint.config.js`에서 추가 규칙을 설정할 수 있습니다:

```javascript
import jsConfig from '@clean-code/eslint/js';

export default [
  ...jsConfig,
  {
    rules: {
      // 추가 규칙 설정
      'custom-rule': 'error',
    },
  },
];
```
