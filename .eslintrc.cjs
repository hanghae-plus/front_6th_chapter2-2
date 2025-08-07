import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // ESLint 검사에서 제외할 파일 설정
  {
    ignores: ['src/main.original.js'],
  },

  // JavaScript 파일에 대한 기본 규칙 설정
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'], // JavaScript 파일만 적용
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
      ecmaVersion: 2021,
    },
    rules: {
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // TypeScript 및 React 파일에 대한 규칙 설정
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic, // TypeScript 스타일 관련 규칙 추가
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts,jsx}'], // TypeScript 및 React 파일에만 적용
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'], // 타입 기반 규칙을 위한 tsconfig.json 경로 설정
      },
    },
    rules: {
      // TypeScript의 'no-unused-vars' 규칙 사용으로 JS 기본 규칙 비활성화
      'no-unused-vars': 'off',
      // 'react/react-in-jsx-scope' 및 'react/jsx-uses-react'는 React 17+에서 더 이상 필요 없음
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier 관련 설정
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]);