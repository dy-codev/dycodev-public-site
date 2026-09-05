export const informatikaSyllabusData = [
    {
      id: 1,
      title: 'Sprint 1: Berpikir Komputasional',
      isOpen: true,
      lessons: [
        { id: 101, title: 'Pengenalan Algoritma', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 102, title: 'Mini Challenge: Flowchart', type: 'challenge', duration: '1 JP', isCompleted: false }
      ]
    },
    {
      id: 2,
      title: 'Sprint 2: Pemrograman Python',
      isOpen: true,
      lessons: [
        { 
            id: 201, 
            title: 'Variabel & Tipe Data', 
            type: 'theory', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: 'https://www.youtube.com/watch?v=gxmTFXfrMzk',
            content: `
            <h3>Apa itu Variabel?</h3>
            <p>Bayangkan variabel seperti sebuah kotak kontainer di kargo. Kotak tersebut memiliki nama (label) dan isi di dalamnya. Di Python, kita tidak perlu mendeklarasikan tipe kotaknya di awal.</p>
          
            <pre><code># Contoh membuat variabel
kode_penerbangan = "JT-610"
jumlah_penumpang = 180
berat_bagasi_kg = 25.5</code></pre>

            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-5 my-6">
                <h4 class="text-blue-800 m-0 mb-2 flex items-center gap-2">💡 Insight Industri</h4>
                <p class="text-blue-900 text-sm m-0">Dalam rekayasa perangkat lunak nyata, penamaan variabel (*naming convention*) sangat krusial. Gunakan format <code>snake_case</code> untuk Python agar kode mudah dibaca oleh tim QA maupun developer lain.</p>
            </div>`
        },
        { 
            id: 202, 
            title: 'Hands-on: Kalkulator Aviasi', 
            type: 'practice', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: null,
            content: `
            <h3>Tugas Praktik</h3>
                <p>Buatlah program Python sederhana yang meminta input jarak tempuh pesawat (dalam km) dan kecepatan rata-rata (dalam km/jam), lalu tampilkan estimasi waktu tempuhnya.</p>
            <ul>
                <li>Gunakan fungsi <code>input()</code></li>
                <li>Konversi tipe data ke <code>float</code> atau <code>int</code></li>
            </ul>`
        },
        { id: 203, title: 'Checkpoint: Percabangan (If/Else)', type: 'project', duration: '3 JP', isCompleted: false }
      ]
    }
  ]