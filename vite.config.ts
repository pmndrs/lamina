import react from '@vitejs/plugin-react'
import fs from 'fs/promises'
import path from 'path'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

function copyFiles() {
  return {
    name: 'copy-license',
    closeBundle: async () => {
      await fs.copyFile('./LICENSE', './dist/LICENSE')
      await fs.copyFile('./README.md', './dist/README.md')
      await fs.copyFile('./dist/vanilla.d.ts', './dist/vanilla/vanilla.d.ts')
      await fs.rm('./dist/vanilla.d.ts')

      // Write vanilla package.json
      const vanillaJson = {
        main: 'lamina.cjs.js',
        module: 'lamina.es.js',
        type: 'module',
        types: 'vanilla.d.ts',
      }
      await fs.writeFile('./dist/vanilla/package.json', JSON.stringify(vanillaJson, null, 2))
    },
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        vanilla: path.resolve(__dirname, 'src/vanilla.ts'),
        react: path.resolve(__dirname, 'src/index.tsx'),
      },
      name: 'lamina',
      formats: ['es', 'cjs'],
      fileName: (format, entry) => {
        switch (entry) {
          case 'vanilla':
            return `vanilla/lamina.${format}.js`
          case 'react':
            return `lamina.${format}.js`
          default:
            return `${entry}.${format}.js`
        }
      },
    },
    rollupOptions: {
      plugins: [
        // @ts-ignore
        excludeDependenciesFromBundle({
          dependencies: true,
          peerDependencies: true,
        }),
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
    }),
    copyFiles(),
  ],
})
