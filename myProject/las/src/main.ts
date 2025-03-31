
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 使用pinia
import { createPinia } from 'pinia'
// 使用router
import routes from './router'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// createApp(App).mount('#app')

const app = createApp(App)
app.use(pinia).use(routes).use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')