import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueform from '@vueform/vueform/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueform()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, './src/index.js'),
      name: 'formue-crud',
      // the proper extensions will be added
      fileName: 'formue-crud'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'pinia', 'formue', 'vueform', 'axios'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vueform: 'vueform',
          vue: 'Vue',
          pinia: 'pinia',
          formue: 'formue',
          axios: 'axios'
        }
      }
    }
  }
})
