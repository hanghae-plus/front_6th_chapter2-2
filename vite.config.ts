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
        // FSD Layer Aliases for Basic
        "@shared": "/src/basic/shared",
        "@entities": "/src/basic/entities",
        "@features": "/src/basic/features",
        "@widgets": "/src/basic/widgets",
        "@pages": "/src/basic/pages",
        "@app": "/src/basic/app",
        // Assets
        "@assets": "/src/basic/assets",
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
