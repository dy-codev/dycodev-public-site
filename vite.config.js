import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      // Opsional: Anda bisa menambahkan konfigurasi Markdown parser di sini nanti
    }),
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
      },
      // 2. Trik Rahasia untuk Server Produksi (Cloudflare)
      closeBundle() {
        const indexPath = 'dist/kelas-setara/index.html'
        const fallbackPath = 'dist/kelas-setara/404.html'
        
        // Setelah build selesai, gandakan index.html menjadi 404.html
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath)
          console.log('✅ File 404.html untuk direktori kelas-setara berhasil digandakan!')
        }
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