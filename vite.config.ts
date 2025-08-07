import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

const base = '/front_6th_chapter2-2/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
