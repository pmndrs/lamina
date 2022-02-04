import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  resolve: {
    alias: {
      three: path.resolve('./node_modules/three'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      lamina: path.resolve('../src/index.tsx'),
    },
  },
  plugins: [reactRefresh()],
})
