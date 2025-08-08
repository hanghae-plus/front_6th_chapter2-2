import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  // CLI에서 --mode advanced 로 호출될 때 advanced 빌드
  if (mode === "advanced") {
    const base = process.env.NODE_ENV === "production" ? "/front_6th_chapter2-2/" : "";

    return {
      base,
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            index: "index.advanced.html"
          }
        },
        outDir: "dist",
        emptyOutDir: true
      },
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts"
      }
    };
  }

  // 기본 설정
  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts"
    }
  };
});
