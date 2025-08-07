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
        input: "./index.advanced.html",
        external: (id) => {
          return id.indexOf("refactoring(hint)") !== -1;
        },
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
