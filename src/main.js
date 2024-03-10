import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './app/router'
import App from './app/App.vue'
import './app/main.scss'
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
