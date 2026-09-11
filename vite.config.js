// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ],
// })

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    {
      // Plugin kustom ringan untuk mengatur SPA Fallback
      name: 'kelas-setara-spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Jika URL diawali /kelas-setara/ DAN yang diminta adalah halaman HTML
          if (req.url.startsWith('/kelas-setara/') && req.headers.accept?.includes('text/html')) {
            req.url = '/kelas-setara/index.html' // Belokkan ke Vue Index
          }
          next()
        })
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'kelas-setara': resolve(__dirname, 'kelas-setara/index.html'),
        // 'ruang-belajar': resolve(__dirname, 'ruang-belajar/index.html'),
      },
    },
  },
  })