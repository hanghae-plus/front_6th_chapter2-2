import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter2-2/" : "";

const entryFileName = "index.advanced.html";

export default mergeConfig(
  defineConfig({
    base,
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, entryFileName),
      },
    },
    plugins: [
      react(),
      {
        name: "rename-html-output",
        closeBundle() {
          const from = path.resolve(__dirname, `dist/${entryFileName}`);
          const to = path.resolve(__dirname, "dist/index.html");
          if (fs.existsSync(from)) fs.renameSync(from, to);
        },
      },
    ],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
