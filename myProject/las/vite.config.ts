import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    },
    hmr: {
      overlay: false, // 禁用错误覆盖
      timeout: 5000 // 延长超时时间
    },
    watch: {
      usePolling: false, // 禁用轮询
      interval: 1000 // 增加文件系统监视间隔
    }
  }
})
