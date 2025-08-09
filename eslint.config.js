import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // 브라우저 API
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        CustomEvent: "readonly",
        EventListener: "readonly",
        history: "readonly",
        // React
        React: "readonly",
        // HTML 타입들
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLFormElement: "readonly",
        // 테스트 환경
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript 관련 규칙
      ...tseslint.configs.recommended.rules,

      // React Hooks 규칙 - React dependency 체크의 핵심
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh 규칙
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // React 관련 규칙들
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-pascal-case": "warn",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "warn",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "error",
      "react/no-unsafe": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/style-prop-object": "error",
      "react/void-dom-elements-no-children": "error",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    ignores: ["dist/**", ".eslintrc.cjs", "eslint.config.js"],
  },
];
