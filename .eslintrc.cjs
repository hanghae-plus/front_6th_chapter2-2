module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // React dependency 체크 관련 규칙들
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    // React 관련 추가 규칙들
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
};
