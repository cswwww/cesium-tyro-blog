import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 引入ElementPlue
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) { // 引入ElementPlus Icon
  app.component(key, component)
}
app.use(ElementPlus)
app.mount('#app')
