export const informatikaSyllabusData = [
    {
      id: 1,
      title: 'Sprint 1: Teknologi Informasi dan Komunikasi',
      isOpen: false,
      lessons: [
        { id: 101, title: 'Aplikasi Media Komunikasi', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 102, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false },
        { id: 103, title: 'Mesin Pencari Informasi Digital', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 104, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false },
        { id: 105, title: 'Fitur Lanjutan Aplikasi Perkantoran', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 106, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false },
        { id: 107, title: 'Integrasi Aplikasi Office', type: 'theory', duration: '1 JP', isCompleted: false },
        { id: 108, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false },
        { id: 109, title: 'Mini Project: Webinar', type: 'challenge', duration: '1 JP', isCompleted: false }
      ]
    },
    {
      id: 2,
      title: 'Sprint 2: Sistem Komputer',
      isOpen: false,
      lessons: [
        { 
            id: 201, 
            title: 'Prengkat Keras Komputer', 
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
            title: 'Quiz: Mengenal Perangkat Keras', 
            type: 'practice', 
            duration: '1 JP', 
            isCompleted: false,
            videoUrl: null,
            quizUrl: '/kuis-hardware.html',
            content: `
            <h3>Uji Pemahaman Hardware</h3>
            <p>Silakan kerjakan kuis interaktif di bawah ini untuk menguji pemahamanmu mengenai komponen perangkat keras komputer.</p>
            `
        },
        { id: 203, title: 'Perangkat Lunak Komputer', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 204, title: 'Hands-on: Instalasi OS', type: 'practice', duration: '2.5 JP', isCompleted: false },
        { id: 205, title: 'Pengguna', type: 'theory', duration: '2 JP', isCompleted: false },
        { id: 206, title: 'Quiz', type: 'practice', duration: '0.5 JP', isCompleted: false },
        { id: 207, title: 'Mekanisme Kinerja Internal Pada Komputer', type: 'theory', duration: '1 JP', isCompleted: false },
        { id: 208, title: 'Quiz', type: 'practice', duration: '0.5 JP', isCompleted: false },
        { id: 209, title: 'Interaksi Antara Kmputer dan Pengguna', type: 'theory', duration: '1 JP', isCompleted: false },
        { id: 210, title: 'Quiz', type: 'practice', duration: '0.5 JP', isCompleted: false },
        { id: 211, title: 'Mini Challenge: Quiz', type: 'challenge', duration: '1 JP', isCompleted: false }
      ]
    },
    {
        id: 3,
        title: 'Sprint 3: Jaringan Komputer',
        isOpen: false,
        lessons: [
            {id: 301,}
        ]
    },
    {
        id: 4,
        title: 'Sprint 4: Analisis Data',
        isOpen: false,
        lessons: [
            {id: 401}
        ]
    },
    {
        id: 5,
        title: 'Sprint 5: Dampak Sosial Informatika',
        isOpen: false,
        lessons: [
            {id: 501}
        ]
    },
    {
        id: 6,
        title: 'Sprint 6: SAS Ganjil',
        isOpen: false,
        lessons: [
            {}
        ]
    },
    {
        id: 7,
        title: 'Sprint 7: Berpikir Komputasional',
        isOpen: false,
        lessons: [
            {}
        ]
    },
    {
        id: 8,
        title: 'Sprint 8: Algoritma & Pemrograman',
        isOpen: false,
        lessons: [
            {}
        ]
    },
    {
        id: 9,
        title: 'Sprint 9: Praktik Lintas Bidang',
        isOpen: false,
        lessons: [
            {}
        ]
    },
    {
        id: 10,
        title: 'Sprint 10: SAS Genap',
        isOpen: false,
        lessons: [
            {}
        ]
    },
  ]