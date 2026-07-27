/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-support/setup.ts'],
    css: false,
    // Playwright drives a real browser and owns everything under e2e/; without
    // this, Vitest would collect those specs and fail on the @playwright/test
    // imports.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Without an explicit include, v8 only reports files a test imported, so
      // untested screens would vanish from the denominator instead of counting
      // as zero.
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        statements: 75,
      },
      exclude: [
        'src/main.tsx',
        '**/*.d.ts',
        'src/test-support/**',
        // Config and build output carry no application logic.
        '*.config.ts',
        'dist/**',
        'e2e/**',
      ],
    },
  },
})
