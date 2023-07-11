import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@modules': './src/modules',
      '@config': './src/config',
      '@shared': './src/shared',
      '@utils': './src/utils',
      '@errors': './src/errors',
      '@middlewares': './src/middlewares',
    },
  },
})
