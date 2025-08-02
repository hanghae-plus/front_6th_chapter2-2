# @clean-code/prettier

클린 코드 프로젝트를 위한 Prettier 설정 패키지입니다.

## 설정 종류

### 1. JavaScript 기본 설정 (`/js`)

- JavaScript 파일 전용 설정
- 기본적인 포맷팅 규칙 적용
- JSON, Markdown 파일 지원

### 2. TypeScript 설정 (`/ts`)

- TypeScript 파일 전용 설정
- TypeScript 관련 포맷팅 규칙 포함
- JSX 파일 지원

### 3. React + TypeScript 설정 (`/react`)

- React + TypeScript 프로젝트 전용 설정
- React JSX 포맷팅 규칙 포함
- CSS, SCSS, HTML 파일 지원
- JSX에서 single quote 사용

## 사용 방법

### JavaScript 프로젝트 (apps/basic)

```javascript
// prettier.config.js
import jsConfig from "@clean-code/prettier/js";

export default jsConfig;
```

### TypeScript 프로젝트

```javascript
// prettier.config.js
import tsConfig from "@clean-code/prettier/ts";

export default tsConfig;
```

### React + TypeScript 프로젝트 (apps/advanced)

```javascript
// prettier.config.js
import reactConfig from "@clean-code/prettier/react";

export default reactConfig;
```

## 주요 설정

### 공통 설정

- `printWidth`: 80 (한 줄 최대 길이)
- `tabWidth`: 2 (탭 크기)
- `useTabs`: false (스페이스 사용)
- `semi`: true (세미콜론 사용)
- `singleQuote`: true (작은따옴표 사용)
- `trailingComma`: 'none' (후행 쉼표 없음)
- `bracketSpacing`: true (객체 리터럴 중괄호 안 공백)
- `arrowParens`: 'avoid' (화살표 함수 매개변수 괄호 생략)

### React 특화 설정

- `jsxSingleQuote`: true (JSX에서 작은따옴표 사용)
- `bracketSameLine`: true (JSX 닫는 태그를 같은 줄에 배치)

## 스크립트

각 앱에서 다음 스크립트를 사용할 수 있습니다:

```bash
# 코드 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check
```

## 파일 타입별 설정

### JavaScript 설정

- `*.js`, `*.mjs`: Babel 파서 사용
- `*.json`: JSON 파서 사용
- `*.md`: Markdown 파서 사용

### TypeScript 설정

- `*.ts`: TypeScript 파서 사용
- `*.tsx`: TypeScript 파서 사용 (JSX 지원)
- `*.js`, `*.mjs`: Babel 파서 사용

### React 설정

- `*.tsx`: TypeScript 파서 사용 (JSX 지원)
- `*.jsx`: Babel 파서 사용 (JSX 지원)
- `*.css`, `*.scss`: CSS/SCSS 파서 사용
- `*.html`: HTML 파서 사용

## 설정 커스터마이징

필요한 경우 각 앱의 `prettier.config.js`에서 추가 설정을 할 수 있습니다:

```javascript
import jsConfig from "@clean-code/prettier/js";

export default {
  ...jsConfig,
  // 추가 설정
  printWidth: 100,
  tabWidth: 4,
};
```

## ESLint와의 통합

Prettier는 ESLint와 함께 사용할 때 충돌을 방지하기 위해 `eslint-config-prettier`를 사용합니다. 이는 ESLint 설정에서 이미 포함되어 있습니다.
