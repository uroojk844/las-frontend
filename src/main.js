import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.component('icon', Icon)
app.mount('#app')
