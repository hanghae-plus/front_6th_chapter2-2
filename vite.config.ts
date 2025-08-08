import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    base: '/front_6th_chapter2-2/',
    build: {
      rollupOptions: {
        input: 'index.advanced.html',
      },
    },
    plugins: [react()],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }),
);
