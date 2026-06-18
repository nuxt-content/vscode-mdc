import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts']
  },
  resolve: {
    alias: {
      vscode: new URL('./test/unit/__mocks__/vscode.ts', import.meta.url).pathname
    }
  }
})
