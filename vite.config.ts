import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@hooks": "/src/hooks",
        "@utils": "/src/utils",
        "@types": "/src/types",
        "@constants": "/src/constants",
        "@models": "/src/models",
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
