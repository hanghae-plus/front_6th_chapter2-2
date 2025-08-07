import { defineConfig } from 'vite'

export default defineConfig({
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js'
  },
  base: '/front_6th_chapter2-2/',
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  }
})