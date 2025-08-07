import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter2-2/" : "";

export default defineConfig({
  plugins: [react()],
  base,
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.advanced.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@basic": "/src/basic",
      "@advanced": "/src/advanced",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/advanced/_setupTests.ts",
  },
});
