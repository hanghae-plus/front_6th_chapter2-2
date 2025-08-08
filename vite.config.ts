import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: '/front_6th_chapter2-2/', // GitHub Pages 레포지토리 이름으로 변경
    build: {
      outDir: 'dist/advanced', // src/advanced 빌드 결과물이 저장될 디렉토리
      rollupOptions: {
        input: './index.html', // src/advanced의 진입점 HTML 파일
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  })
);
