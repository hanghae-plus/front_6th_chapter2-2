import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
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
  
  // 테스트 파일 설정
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**/*.js'],
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
      'complexity': 'off'
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