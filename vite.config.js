import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import postcssPxToRem from 'postcss-pxtorem'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPxToRem({
          rootValue: 192,
          unitPrecision: 5,
          propList: ['*'],
          minPixelValue: 1,
          exclude: /node_modules/i
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variables.scss" as *;'
      }
    }
  }
})
