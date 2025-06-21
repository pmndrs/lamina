import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'lamina/vanilla': path.resolve(__dirname, '../../src/vanilla.ts'),
      lamina: path.resolve(__dirname, '../../src/index.tsx'),
    },
  },
})
