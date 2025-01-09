import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// vue全家桶之状态管理库
import { createPinia } from 'pinia'

const app = createApp(App)
// pinia 实例  vue 全家桶的状态管理库
const pinia = createPinia()
app
   .use(pinia)
   .mount('#app')


