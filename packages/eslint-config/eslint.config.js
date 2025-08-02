import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  // JavaScript 기본 설정
  js.configs.recommended,
  
  // JavaScript 파일 설정
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // 기본 규칙
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      
      // 코드 품질 규칙
      'complexity': ['warn', 10],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],
      
      // 가독성 규칙
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      
      // 변수 관련 규칙
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      
      // 함수 관련 규칙
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-loop-func': 'error'
    }
  },
  
  // TypeScript 파일 설정 (React가 아닌 경우)
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // 기본 규칙
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
      'no-unused-vars': 'off', // TypeScript 규칙 사용
      'no-console': 'warn',
      
      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      
      // 코드 품질 규칙
      'complexity': ['warn', 10],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],
      
      // 가독성 규칙
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      
      // 변수 관련 규칙
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      
      // 함수 관련 규칙
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-loop-func': 'error'
    }
  },
  
  // React + TypeScript 파일 설정
  {
    files: ['**/*.tsx', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: 'readonly',
        JSX: 'readonly'
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // 기본 규칙
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
      'no-unused-vars': 'off', // TypeScript 규칙 사용
      'no-console': 'warn',
      
      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      
      // React 규칙
      'react/jsx-uses-react': 'off', // React 17+ 에서는 불필요
      'react/react-in-jsx-scope': 'off', // React 17+ 에서는 불필요
      'react/prop-types': 'off', // TypeScript 사용시 불필요
      'react/display-name': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'warn',
      'react/sort-prop-types': 'off',
      'react/style-prop-object': 'error',
      'react/void-dom-elements-no-children': 'error',
      
      // React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // React Refresh 규칙
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // 코드 품질 규칙
      'complexity': ['warn', 10],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],
      
      // 가독성 규칙
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      
      // 변수 관련 규칙
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      
      // 함수 관련 규칙
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-loop-func': 'error'
    }
  },
  
  // 테스트 파일 설정
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.js', '**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**/*.js', '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        render: 'readonly',
        screen: 'readonly',
        fireEvent: 'readonly',
        waitFor: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'complexity': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  },
  
  // 특정 파일 제외
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
      'build/**'
    ]
  },
  
  // Prettier와 충돌 방지
  prettierConfig
]; 