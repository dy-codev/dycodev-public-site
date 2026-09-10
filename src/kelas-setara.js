// import { createApp } from 'vue'
// import './style.css'
// import KelasSetara from './components/KelasSetara.vue'

// createApp(KelasSetara).mount('#app')

import { createApp } from 'vue'
import './style.css' // Pastikan memanggil CSS agar Tailwind berjalan
import App from './App.vue'
import router from './router/index.js' // Import router

const app = createApp(App)
app.use(router) // Aktifkan router di sini
app.mount('#app')