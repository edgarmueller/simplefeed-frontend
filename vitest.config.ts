// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import * as viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setup-vitest.ts'],
    },
  }),
)
