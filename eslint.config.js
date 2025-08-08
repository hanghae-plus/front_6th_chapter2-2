// eslint.config.js (ESLint 9.x flat config용)

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: ["dist", "eslint.config.js"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
            globals: {
                window: "readonly",
                document: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "prettier": prettier,
        },
        rules: {
            ...tseslint.configs.recommended.rules, // @typescript-eslint/recommended
            ...reactHooks.configs.recommended.rules, // react-hooks/recommended
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "no-unused-vars": "off",
            "prettier/prettier": "error"
        },
    },
];
