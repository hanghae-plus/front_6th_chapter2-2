module.exports = {
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.app.json",
      },
    },
  },
  rules: {
    // FSD 레이어 의존성 규칙
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          // Shared는 아무것도 참조할 수 없음
          {
            target: "./src/**/shared/**/*",
            from: "./src/**/entities/**/*",
            message: "Shared layer cannot import from Entities layer",
          },
          {
            target: "./src/**/shared/**/*",
            from: "./src/**/features/**/*",
            message: "Shared layer cannot import from Features layer",
          },
          {
            target: "./src/**/shared/**/*",
            from: "./src/**/widgets/**/*",
            message: "Shared layer cannot import from Widgets layer",
          },
          {
            target: "./src/**/shared/**/*",
            from: "./src/**/pages/**/*",
            message: "Shared layer cannot import from Pages layer",
          },
          {
            target: "./src/**/shared/**/*",
            from: "./src/**/app/**/*",
            message: "Shared layer cannot import from App layer",
          },

          // Entities는 Features 이상을 참조할 수 없음
          {
            target: "./src/**/entities/**/*",
            from: "./src/**/features/**/*",
            message: "Entities layer cannot import from Features layer",
          },
          {
            target: "./src/**/entities/**/*",
            from: "./src/**/widgets/**/*",
            message: "Entities layer cannot import from Widgets layer",
          },
          {
            target: "./src/**/entities/**/*",
            from: "./src/**/pages/**/*",
            message: "Entities layer cannot import from Pages layer",
          },
          {
            target: "./src/**/entities/**/*",
            from: "./src/**/app/**/*",
            message: "Entities layer cannot import from App layer",
          },

          // Features는 같은 레이어끼리 참조할 수 없음
          {
            target: "./src/**/features/**/*",
            from: "./src/**/features/**/*",
            except: ["./src/**/features/index.ts"],
            message:
              "Features cannot import from other Features. Use barrel exports instead.",
          },
          {
            target: "./src/**/features/**/*",
            from: "./src/**/widgets/**/*",
            message: "Features layer cannot import from Widgets layer",
          },
          {
            target: "./src/**/features/**/*",
            from: "./src/**/pages/**/*",
            message: "Features layer cannot import from Pages layer",
          },
          {
            target: "./src/**/features/**/*",
            from: "./src/**/app/**/*",
            message: "Features layer cannot import from App layer",
          },

          // Widgets는 Pages 이상을 참조할 수 없음
          {
            target: "./src/**/widgets/**/*",
            from: "./src/**/pages/**/*",
            message: "Widgets layer cannot import from Pages layer",
          },
          {
            target: "./src/**/widgets/**/*",
            from: "./src/**/app/**/*",
            message: "Widgets layer cannot import from App layer",
          },

          // Pages는 App을 참조할 수 없음
          {
            target: "./src/**/pages/**/*",
            from: "./src/**/app/**/*",
            message: "Pages layer cannot import from App layer",
          },
        ],
      },
    ],

    // 배럴 익스포트 강제
    "import/no-internal-modules": [
      "error",
      {
        allow: [
          // 같은 레이어 내에서만 내부 모듈 접근 허용
          "**/shared/hooks/*",
          "**/shared/libs/*",
          "**/shared/ui/*",
          "**/entities/*/hooks/*",
          "**/entities/*/libs/*",
          "**/entities/*/ui/*",
          "**/entities/*/types*",
          "**/features/*/hooks/*",
          "**/features/*/ui/*",
          "**/widgets/*/ui/*",
          // 타입 파일은 직접 접근 허용
          "**/*.types",
          "**/types*",
          // 테스트 파일은 예외
          "**/__tests__/**/*",
          // 메인 앱 파일들
          "**/main.tsx",
          "**/App.tsx",
          // 아이콘 등 에셋
          "**/assets/**/*",
        ],
      },
    ],

    // Path Alias 사용 권장
    "import/no-relative-packages": "error",
  },
};
