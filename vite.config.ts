import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import fs from "fs";

export default mergeConfig(
  defineConfig({
    plugins: [
      react(),
      {
        name: "rename-advanced-html",
        closeBundle() {
          // 빌드 완료 후 index.advanced.html을 index.html로 이름 변경
          const advancedPath = resolve(__dirname, "dist/index.advanced.html");
          const indexPath = resolve(__dirname, "dist/index.html");

          if (fs.existsSync(advancedPath)) {
            fs.renameSync(advancedPath, indexPath);
            console.log("✅ index.advanced.html을 index.html로 이름 변경 완료");
          }
        },
      },
    ],
    base:
      process.env.NODE_ENV === "production" ? "/front_6th_chapter2-2/" : "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: "index.advanced.html",
        },
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
