module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ".",
      },
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // 상위 디렉토리 상대 경로 import만 금지
    "import/no-relative-parent-imports": "error",
    // 사용하지 않는 변수 경고 끄기
    "@typescript-eslint/no-unused-vars": "off",
    // 모든 상대 경로를 금지
    "no-restricted-imports": [
      "error",
      {
        patterns: ["./", "../"],
      },
    ],
  },
};
