import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const ignoresConfig = {
  ignores: [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".vite/**",
    "coverage/**",
    "src/origin/",
    "src/refactoring(hint)/"
  ]
};

const baseConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    sourceType: "module"
  },
  rules: {
    ...js.configs.recommended.rules
  }
};

const typescriptConfig = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    }
  },
  plugins: {
    "@typescript-eslint": tseslint
  },
  rules: {
    ...tseslint.configs.recommended.rules
  }
};

const reactConfig = {
  files: ["**/*.{jsx,tsx}"],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true
      }
    ]
  }
};

const importSortConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    "simple-import-sort": simpleImportSort
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
};

export default [
  ignoresConfig,
  baseConfig,
  typescriptConfig,
  reactConfig,
  importSortConfig,
  prettierConfig
];
