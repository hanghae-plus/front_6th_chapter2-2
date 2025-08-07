import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // JavaScript 기본 설정
  js.configs.recommended,
  
  // TypeScript 파일 설정
  {
    files: ['**/*.ts', '**/*.tsx'],
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
  
  // 테스트 파일 설정
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
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
        afterAll: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'complexity': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off'
    }
  },
  
  // 특정 파일 제외
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js'
    ]
  },
  
  // Prettier와 충돌 방지
  prettierConfig
]; 