// vite.config.js
import { defineConfig } from "file:///C:/Users/28112/Desktop/wockespace/lesson_hm/notebook/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/28112/Desktop/wockespace/lesson_hm/notebook/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createStyleImportPlugin } from "file:///C:/Users/28112/Desktop/wockespace/lesson_hm/notebook/node_modules/vite-plugin-style-import/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\28112\\Desktop\\wockespace\\lesson_hm\\notebook";
var vite_config_default = defineConfig({
  plugins: [react(), createStyleImportPlugin({
    libs: [
      {
        libraryName: "zarm",
        esModule: true,
        resolveStyle: (name) => `zarm/es/${name}/style/css`
      }
    ]
  })],
  css: {
    modules: {
      localsConvention: "dashesOnly"
    },
    preprocessorOptions: {
      // 针对 Less 预处理器的配置
      less: {
        // 允许在 Less 文件中使用内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      // 项目的物理路径
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "utils": path.resolve(__vite_injected_original_dirname, "src/utils")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7002",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyODExMlxcXFxEZXNrdG9wXFxcXHdvY2tlc3BhY2VcXFxcbGVzc29uX2htXFxcXG5vdGVib29rXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyODExMlxcXFxEZXNrdG9wXFxcXHdvY2tlc3BhY2VcXFxcbGVzc29uX2htXFxcXG5vdGVib29rXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8yODExMi9EZXNrdG9wL3dvY2tlc3BhY2UvbGVzc29uX2htL25vdGVib29rL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IGNyZWF0ZVN0eWxlSW1wb3J0UGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3R5bGUtaW1wb3J0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbi8vIGNvbnNvbGUubG9nKF9fZGlybmFtZSlcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgY3JlYXRlU3R5bGVJbXBvcnRQbHVnaW4oe1xuICAgIGxpYnM6IFtcbiAgICAgIHtcbiAgICAgICAgbGlicmFyeU5hbWU6ICd6YXJtJyxcbiAgICAgICAgZXNNb2R1bGU6IHRydWUsXG4gICAgICAgIHJlc29sdmVTdHlsZTogbmFtZSA9PiBgemFybS9lcy8ke25hbWV9L3N0eWxlL2Nzc2BcbiAgICAgIH1cbiAgICBdXG4gIH0pXSxcbiAgY3NzOiB7XG4gICAgbW9kdWxlczoge1xuICAgICAgbG9jYWxzQ29udmVudGlvbjogJ2Rhc2hlc09ubHknXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAvLyBcdTk0ODhcdTVCRjkgTGVzcyBcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcdTc2ODRcdTkxNERcdTdGNkVcbiAgICAgbGVzczoge1xuICAgICAgIC8vIFx1NTE0MVx1OEJCOFx1NTcyOCBMZXNzIFx1NjU4N1x1NEVGNlx1NEUyRFx1NEY3Rlx1NzUyOFx1NTE4NVx1ODA1NCBKYXZhU2NyaXB0XG4gICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgIH1cbiAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAvLyBcdTk4NzlcdTc2RUVcdTc2ODRcdTcyNjlcdTc0MDZcdThERUZcdTVGODRcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgJ3V0aWxzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy91dGlscycpXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NzAwMicsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsU0FBUyxvQkFBb0I7QUFDelgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsK0JBQStCO0FBQ3hDLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLHdCQUF3QjtBQUFBLElBQ3pDLE1BQU07QUFBQSxNQUNKO0FBQUEsUUFDRSxhQUFhO0FBQUEsUUFDYixVQUFVO0FBQUEsUUFDVixjQUFjLFVBQVEsV0FBVyxJQUFJO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDLENBQUM7QUFBQSxFQUNGLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLGtCQUFrQjtBQUFBLElBQ3BCO0FBQUEsSUFDQSxxQkFBcUI7QUFBQTtBQUFBLE1BRXBCLE1BQU07QUFBQTtBQUFBLFFBRUosbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDbEMsU0FBUyxLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLElBQzlDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
