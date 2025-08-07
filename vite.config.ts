import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: '/front_6th_chapter2-2/',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          origin: 'index.origin.html',
          basic: 'index.basic.html',
          advanced: 'index.advanced.html',
        },
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
