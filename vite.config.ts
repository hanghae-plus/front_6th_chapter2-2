import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    root: ".",
    base: "/front_6th_chapter2-2/",
    build: {
      rollupOptions: {
        input: "./index.html",
      },
      outDir: "dist",
      copyPublicDir: true,
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
