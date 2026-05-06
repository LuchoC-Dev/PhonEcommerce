import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/products/**', 'src/auth/**', 'src/users/**', 'src/cart/**'],
      exclude: ['src/products/**/__tests__/**', 'src/auth/**/__tests__/**', 'src/users/**/__tests__/**', 'src/cart/**/__tests__/**'],
    },
  },
})
