import { createRouter, createWebHistory } from 'vue-router'
import KelasSetara from '../components/KelasSetara.vue'
import RuangBelajar from '../components/RuangBelajar.vue'

const routes = [
  { 
    path: '/', // Ini akan merujuk ke url.com/kelas-setara/
    component: KelasSetara 
  },
  { 
    path: '/ruang-belajar', // Ini akan merujuk ke url.com/kelas-setara/ruang-belajar
    component: RuangBelajar 
  }
]

const router = createRouter({
  // Tambahkan '/kelas-setara/' sebagai base URL untuk History API
  history: createWebHistory('/kelas-setara/'),
  routes,
})

export default router