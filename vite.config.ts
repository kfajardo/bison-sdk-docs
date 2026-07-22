import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// Alias the SDK to its source: the docs app dogfoods the live SDK, no build step needed
// on the SDK side. Swap to `file:../bison-sdk` in package.json to test the published dist.
const sdk = (p: string) => fileURLToPath(new URL(`../bison-sdk/src/${p}`, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      'bison-jib-sdk/components': sdk('components/index.ts'),
      'bison-jib-sdk/validation': sdk('validation/index.ts'),
      'bison-jib-sdk/styles.css': fileURLToPath(new URL('../bison-sdk/src/styles.css', import.meta.url)),
      'bison-jib-sdk': sdk('index.ts'),
    },
  },
})
