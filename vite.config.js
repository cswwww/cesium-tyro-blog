import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'; // 引入插件
import path from 'path'
import eslint from 'vite-plugin-eslint'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium(), eslint()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})
