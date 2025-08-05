import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import compat from "eslint-plugin-compat";
import cypressPlugin from "eslint-plugin-cypress";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        Set: true,
        Map: true,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: ".",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescript,
      compat,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      browsers:
        "> 0.5%, last 2 versions, not op_mini all, Firefox ESR, not dead",
    },
    rules: {
      // Prettier 통합 규칙
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
        },
      ],

      // React 관련 규칙
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",

      // TypeScript 관련 규칙
      "@typescript-eslint/no-explicit-any": "warn",

      // 팀 컨벤션 - var 사용 금지
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": "error",

      // 팀 컨벤션 - 동등 연산자 (==, !=) 금지
      eqeqeq: ["error", "always", { null: "ignore" }],

      // 팀 컨벤션 - 얼리 리턴 권장
      "consistent-return": "error",
      "no-else-return": ["error", { allowElseIf: false }],

      // 팀 컨벤션 - 템플릿 리터럴 규칙
      "prefer-template": "error",

      // 팀 컨벤션 - 상수는 대문자
      camelcase: [
        "error",
        {
          properties: "never",
          ignoreDestructuring: false,
          ignoreImports: false,
          ignoreGlobals: false,
          allow: ["^[A-Z][A-Z0-9_]*$"],
        },
      ],

      // 팀 컨벤션 - 구조분해할당 권장
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // 기본 코드 품질 규칙
      "prefer-const": "error",
      "arrow-body-style": ["error", "as-needed"],
      "object-shorthand": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-undef": "off",

      // import 순서 규칙
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", ["parent", "sibling"], "index"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
      "import/extensions": "off",
    },
  },
  // 테스트 파일 설정
  {
    files: [
      "**/src/**/*.{spec,test}.[jt]s?(x)",
      "**/__mocks__/**/*.[jt]s?(x)",
      "./src/setupTests.ts",
    ],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      "vitest/expect-expect": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        globalThis: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        vi: true,
      },
    },
  },
  // Cypress 테스트 파일 설정
  {
    files: ["cypress/e2e/**/*.cy.js"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      globals: {
        cy: true,
      },
    },
  },
  prettier,
];
