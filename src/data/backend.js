import { markRaw, defineAsyncComponent } from 'vue'

export const backendSyllabusData = [
  {
    id: 1,
    title: 'Sprint 1: Arsitektur & REST API',
    isOpen: true,
    lessons: [
      { 
        id: 301, 
        title: 'Pengenalan Web Server & HTTP Protocol', 
        type: 'theory', 
        duration: '2 JP', 
        isCompleted: false,
        slideUrl: null,
        pdfUrl: null,
        videoUrl: null,
        externalVideoUrl: 'https://www.youtube.com/watch?v=x3c1ih2NJEg', // Masuk ke "Pengayaan"
        externalLinks: [ // Masuk ke "Pengayaan"
          { title: 'Jurnal Standar ISO Garis Gambar', url: 'https://link-jurnal.com/iso-pdf', type: 'Makalah / Jurnal' },
          { title: 'Simulator AutoCAD Online', url: 'https://autocad-web.com', type: 'Interactive Web' }
        ],
        content: `
          <h3>Cara Kerja Klien-Server</h3>
          <p>Backend bertindak sebagai otak di balik layar yang memproses logika bisnis, mengelola basis data, dan melayani permintaan (*request*) dari frontend atau aplikasi mobile.</p>
          <pre><code># Contoh respons JSON sederhana dari REST API
{
  "status": "success",
  "code": 200,
  "message": "Data penerbangan berhasil dimuat"
}</code></pre>
        `
      },
      { 
        id: 302, 
        title: 'Mini Challenge: Desain Endpoint REST', 
        type: 'challenge', 
        duration: '2 JP', 
        isCompleted: false,
        content: `
          <h3>Tantangan Desain Endpoint</h3>
          <p>Rancang struktur URL endpoint (RESTful convention) untuk fitur manajemen data jadwal penerbangan dan manifest penumpang.</p>
          <ul>
            <li>Gunakan struktur *noun* (kata benda) jamak.</li>
            <li>Terapkan metode HTTP yang tepat (GET, POST, PUT, DELETE).</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 2,
    title: 'Sprint 2: Manajemen Basis Data & Skalabilitas',
    isOpen: true,
    lessons: [
      { 
        id: 303, 
        title: 'Relasi Database & Query Dasar', 
        type: 'theory', 
        duration: '3 JP', 
        isCompleted: false,
        videoUrl: null,
        content: `
          <h3>Relasi Antar Tabel</h3>
          <p>Memahami konsep *One-to-Many* dan *Many-to-Many* dalam relasi basis data relasional (seperti PostgreSQL atau MySQL) agar integritas data tetap terjaga.</p>
        `
      },
      { 
        id: 304, 
        title: 'Checkpoint: Migrasi & CRUD API', 
        type: 'project', 
        duration: '4 JP', 
        isCompleted: false,
        content: `
          <h3>Milestone Project Backend</h3>
          <p>Selesaikan pembuatan API lengkap yang mencakup operasi Create, Read, Update, dan Delete terhubung ke database lokal.</p>
        `
      }
    ]
  }
]