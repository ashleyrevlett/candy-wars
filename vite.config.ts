import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postCSSNested from 'postcss-nested'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [vue()],
  css: {
    postcss: {
        plugins: [
          postCSSNested
        ],
    },
  },
})
