import fs from "fs";
import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter2-2/" : "";
const entryFileName = "index.advanced.html";

export default defineConfig({
  base,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/advanced"),
    },
  },
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.js",
  },
});
