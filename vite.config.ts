import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default mergeConfig(
  defineConfig({
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: "default",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
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
