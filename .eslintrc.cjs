module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-refresh", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React Refresh 관련
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // TypeScript 관련 규칙
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",

    // React Hooks 관련
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",

    // 기본적인 에러 방지
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-expressions": "error",
    "no-unreachable": "error",
  },
  overrides: [
    {
      files: ["*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "no-console": "off",
      },
    },
  ],
};
