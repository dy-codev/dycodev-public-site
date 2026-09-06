export const gamtekSyllabusData = [
    {
      id: 1,
      title: 'Sprint 1: Pengantar Gambar Teknik',
      isOpen: false,
      lessons: [
        { 
            id: 101, 
            title: 'Mindset', 
            type: 'theory', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: null,
            slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vS3VzywmRvmW3ie-S8YAMLtTn3sPn1VYwp3HoRlHREHZ6Hg3lAQ_Qb6_F7gyYXCVg/pubembed?start=false&loop=false',
            content: `
            <h3>Pengantar Gambar Teknik</h3>
            `
        },
        { id: 102, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false },
        { id: 109, title: 'Mini Challenge: ', type: 'challenge', duration: '1 JP', isCompleted: false, videoUrl: '#', content: `` }
      ]
    },
    {
      id: 2,
      title: 'Sprint 2: Garis Gambar dan Etiket',
      isOpen: false,
      lessons: [
        { 
            id: 201, 
            title: 'Garis Gambar', 
            type: 'theory', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: null,
            slideUrl:'https://docs.google.com/presentation/d/e/2PACX-1vQ5NBE698nJX_VbB8ltOebzzAOJdT50mUmQSeJor-aVzKHXRzXqR4gLvY5sqtYmHQ/pubembed?start=false',
            content: `
            <h3>Garis Gambar</h3>
            `
        },
        { 
            id: 202, 
            title: 'Hands-on: Menggambar Garis', 
            type: 'practice', 
            duration: '3 JP', 
            isCompleted: false,
            videoUrl: null,
            slideUrl: null,
            content: `
            <h3>Tugas Praktik</h3>
                <p>Buatlah program Python sederhana yang meminta input jarak tempuh pesawat (dalam km) dan kecepatan rata-rata (dalam km/jam), lalu tampilkan estimasi waktu tempuhnya.</p>
            <ul>
                <li>Gunakan fungsi <code>input()</code></li>
                <li>Konversi tipe data ke <code>float</code> atau <code>int</code></li>
            </ul>`
        },
        { 
            id: 203, 
            title: 'Etiket Gambar', 
            type: 'theory', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: null,
            slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vTf4JJTHj8Uz9SNqps2e0JCPrypmAHhtINRgsjtDHALGx4MxpWyEqy9xiWvdxAifQ/pubembed?start=false',
            content: null
        },
        { id: 204, title: 'Quiz', type: 'practice', duration: '2.5 JP', isCompleted: false },
        { 
            id: 205, 
            title: 'Membaca Skala Penggaris Ukur', 
            type: 'theory', 
            duration: '2 JP', 
            isCompleted: false,
            videoUrl: null,
            slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vQ3SN3pUxuQ8u7CSQ4aVWDafERfBfeOIa4-uzx2yRuqUyi8tmjiwkyFmOfgP9Ogag/pubembed?start=false',
            content: null
        },
        { id: 206, title: 'Hands-on: Membuat Etiket', type: 'challenge', duration: '3 JP', isCompleted: false },
      ]
    },
    {
        id: 3,
        title: 'Sprint 3: Huruf, Angka, dan Notasi Gambar',
        isOpen: false,
        lessons: [
            // {id: 301, title: '', type: 'theory', duration: '2 JP', isCompleted: false },
            { 
                id: 302, 
                title: 'Hands-on: Latihan Membuat Huruf dan Angka', 
                type: 'practice', 
                duration: '1 JP', 
                isCompleted: false,
                videoUrl: null,
                slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRGtcBsWN8WP9oVvFcUTw9hP_4LHUtw4DuztnsE5uw0lK24DKxFa_RC2UB16UioBw/pubembed?start=false',
                content: null
            },
            { 
                id: 303, 
                title: 'Cara Memberikan Notasi Ukur', 
                type: 'theory', duration: '2 JP', 
                isCompleted: false,
                videoUrl: null,
                slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRO0YHaXLqJGTAIU6G9UM11NcWpIeRiZT-i9p_fRFdywJcfrg_4jzc-RSEsniTqVw/pubembed?start=false&loop=false',
                content: null 
            },
            // { id: 304, title: 'Quiz', type: 'practice', duration: '2.5 JP', isCompleted: false },
        ]
    },
    {
        id: 4,
        title: 'Sprint 4: Gambar Isometrik',
        isOpen: false,
        lessons: [
            { id: 401, title: 'Gambar Isometrik', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSHoLom6vf9-yhu7yFUVqmziAG99VnDWAwc5-GfPkgjgPxAnRfyIxSCfhASAnaZZQ/pubembed?start=false', content: null },
            { id: 402, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 403, title: 'Tahapan Latihan Isometrik 1', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vS_ma1JA9vFhR2U3VBqBxkypgMYGWBh1ls1gwY64bvefRqbyIzJCnYNUe7iljeoqw/pubembed?start=false', content: null },
            { id: 404, title: 'Hands-on: Menggambar Isometrik 1', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 405, title: 'Tahapan Latihan Isometrik 2', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSUUILGx_DK3ABp60lqjIeTNUuLOp29Mn5ZZo3OgH2qUnJI2zmOj40SePmK0QfgLQ/pubembed?start=false', content: null },
            { id: 406, title: 'Hands-on: Menggambar Isometrik 2', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 407, title: 'Tahapan Latihan Isometrik 3', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vQo6voBYTCZRhk3eN6zqIfe2F5TmFpKh3c8JZUbsjwQci_tSTFM2wsyqwFNlBf1ig/pubembed?start=false&loop=false', content: null },
            { id: 408, title: 'Hands-on: Menggambar Isometrik 3', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 5,
        title: 'Sprint 5: Proyeksi Amerika',
        isOpen: false,
        lessons: [
            { id: 501, title: 'Proyeksi Amerika', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSa0kjzl4Cc9ezNBdrUUxr0eC7h_tYwoHnasUrdFTYpUGDwaGDtf5ktP7EPOOhT-g/pubembed?start=false', content: null },
            { id: 502, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 503, title: 'Tahapan Latihan Proyeksi Amerika 1', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRuWIOz1QTlp9012jFF0pIKXyW9Iw9EmeI5b4kPkWt8ATqA7o_c0D-b9FuCvTEvDw/pubembed?start=false', content: null },
            { id: 504, title: 'Hands-on: Menggambar Proyeksi Amerika 1', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 505, title: 'Tahapan Latihan Proyeksi Amerika 2', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vQLHkLMrqxT8V0s2zjGzVvPLczOR3pafDmlIZreXhvHUZ3q3zXMJ1JBii_Zyf88jg/pubembed?start=false', content: null },
            { id: 506, title: 'Hands-on: Menggambar Proyeksi Amerika 2', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 6,
        title: 'Sprint 6: SAS Ganjil',
        isOpen: false,
        lessons: [
            { id: 601, title: 'Hands-On:', type: 'project', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 7,
        title: 'Sprint 7: Proyeksi Eropa',
        isOpen: false,
        lessons: [
            // { id: 701, title: '', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            // { id: 702, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 703, title: 'Hands-on: Menggambar Proyeksi Eropa 1', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 704, title: 'Hands-on: Menggambar Proyeksi Eropa 2', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 8,
        title: 'Sprint 8: Skala Gambar',
        isOpen: false,
        lessons: [
            { id: 801, title: 'Skala Gambar', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vTkcxAmRr1ce0kdsghVezaI6vByZIhjroLypUgd7qWHMEinHtnjKjCqX0afruKeIw/pubembed?start=false', content: null },
            { id: 802, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 9,
        title: 'Sprint 9: Geometri',
        isOpen: false,
        lessons: [
            { id: 901, title: 'Teori Geometri', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSYuLjdDXxii4ajhprYqJtUOFWLCW2XctZSJMDAoBRLHaI4J4ZsZFzTykyNy-l7Cg/pubembed?start=false&loop=false', content: null },
            // { id: 902, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 903, title: 'Hands-on: Latihan Dasar Geometri', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 904, title: 'Tahapan Latihan Garis Lingkar Singgung', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: null, pdfUrl: 'https://drive.google.com/file/d/19uFx1vl3dhogddSyGUKyR7swSbdEbxye/preview', content: null },
            { id: 905, title: 'Hands-on: Menggambar Geometri 1', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 906, title: 'Hands-on: Menggambar Geometri 2', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 907, title: 'Hands-on: Menggambar Geometri 3', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 10,
        title: 'Sprint 10: Gambar Potongan',
        isOpen: false,
        lessons: [
            // { id: 1001, title: 'Pengantar Gambar Potongan', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            // { id: 1002, title: 'Quiz', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 1003, title: 'Tahapan Latihan Gambar Potongan 1', type: 'theory', duration: '2 JP', isCompleted: false, videoUrl: null, slideUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vR-vB-hPIbhVwX3l119rofl4xQYp0dU5MpS7D99kOKLQG4O4d4KS1HlqzfCpiFwbA/pubembed?start=false', content: null },
            { id: 1004, title: 'Hands-on: Menggambar Potongan 1', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
            { id: 1005, title: 'Hands-on: Menggambar Potongan 2', type: 'practice', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
    {
        id: 11,
        title: 'Sprint 11: SAS Genap',
        isOpen: false,
        lessons: [
            { id: 1101, title: 'Challenge:', type: 'project', duration: '1 JP', isCompleted: false, videoUrl: null, slideUrl: null, content: null },
        ]
    },
  ]