<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, initAuth, logout, getDisplayName } from '../composables/useAuth.js'
import CourseCard from './CourseCard.vue'
import AuthModal from './AuthModal.vue'
// Import data silabus master
import { informatikaSyllabusData } from '../data/informatika.js'
import { backendSyllabusData } from '../data/backend.js'
import { gamtekSyllabusData } from '../data/gamtek.js'

// --- State Auth & Modal ---
const isLoginModalOpen = ref(false)
const selectedCourse = ref(null) // Menyimpan course apa yang sedang diklik

const router = useRouter()

onMounted(() => {
  initAuth()
})

// --- FUNGSI PENCEGAT KLIK DARI KARTU MAPEL ---
const handleMulaiBelajar = (course) => {
  if (currentUser.value) {
    // CEK OTORISASI: Jika user sudah login, apakah dia boleh masuk kelas ini?
    const isSpbnCourse = course.tag === 'SPBN Bekasi';
    const isPublicUser = !currentUser.value.email.endsWith('@siswa.dycodev.com');

    // Jika ini kelas SPBN dan yang login BUKAN murid SPBN (publik)
    if (isSpbnCourse && isPublicUser) {
      alert('Akses Ditolak: Materi ini bersifat privat dan khusus untuk siswa SMK Penerbangan Bakti Nusantara.');
      return; // Hentikan proses, jangan pindah halaman!
    }

    // Jika lolos pengecekan otorisasi, luncurkan ke materi
    // window.location.href = course.link;
    router.push(course.link);
  } else {
    // Jika belum login, buka modal spesifik untuk course ini
    selectedCourse.value = course;
    isLoginModalOpen.value = true;
  }
}

// --- FUNGSI PEMBUKA MODAL DARI HEADER (UMUM) ---
const openGeneralLogin = () => {
  // 1. Beritahu modal bahwa ini login umum (bukan dari kartu mapel)
  selectedCourse.value = null; 
  
  // 2. Perintahkan modal untuk buka dirinya.
  // (Saat ini terjadi, watch di AuthModal akan otomatis membersihkan form)
  isLoginModalOpen.value = true; 
}

// Data Kategori
const categories = [
  'Semua',
  'Software Engineering',
  'Materi SMK',
  'Quality Assurance'
]

const selectedCategory = ref('Semua')

// Data Mata Pelajaran & Modul
const courses = ref([
  {
    id: 1,
    title: 'Informatika SMK',
    category: 'Materi SMK',
    description: 'Konsep dasar informatika, pemikiran komputasional, serta praktik dasar pemrograman untuk siswa SMK.',
    syllabus: informatikaSyllabusData,
    level: 'Pemula',
    tag: 'SPBN Bekasi',
    icon: '💻',
    link: 'ruang-belajar/?subject=informatika',
    practiceLink: '#'
  },
  {
    id: 2,
    title: 'Gambar Teknik SMK',
    category: 'Materi SMK',
    description: 'Panduan standar penggambaran teknik, proyeksi, dan dokumentasi visual teknis untuk siswa kejuruan.',
    syllabus: gamtekSyllabusData,
    level: 'Pemula',
    tag: 'SPBN Bekasi',
    icon: '📐',
    // link: 'https://drive.google.com/drive/folders/1oB0gv3FnmG0n1MOPM6QQHHq9XbcojyEF?usp=sharing',
    link: 'ruang-belajar/?subject=gamtek',
    practiceLink: 'https://drive.google.com/drive/folders/1Lk_OQfelBLp4fMFXpS0pIhSU3Q0JabbD?usp=sharing'
  },
  {
    id: 3,
    title: 'RAMP Safety Awareness',
    category: 'Airport Safety & Operations',
    description: 'Panduan komprehensif keselamatan ground handling, identifikasi bahaya airside, dan prosedur kerja aman di sekitar pesawat.',
    lessonsCount: 0,
    practiceCount: 0,
    level: 'Semua Tingkat',
    tag: 'Umum',
    icon: '/ico-airport.png',
    link: 'ruang-belajar/?subject=rsa',
    practiceLink: '#'
  },
  {
    id: 4,
    title: 'Web Development Basics',
    category: 'Software Engineering',
    description: 'Belajar fondasi pembuatan web modern menggunakan HTML, CSS, JavaScript, dan framework interaktif.',
    lessonsCount: 15,
    practiceCount: 0,
    level: 'Pemula - Menengah',
    tag: 'Umum',
    icon: '🌐',
    link: 'ruang-belajar/?subject=webdev',
    practiceLink: '#'
  },
  {
    id: 5,
    title: 'Backend Engineering',
    category: 'Software Engineering',
    description: 'Arsitektur REST API, manajemen basis data, dan pembuatan layanan backend yang scalable.',
    syllabus: backendSyllabusData,
    level: 'Menengah',
    tag: 'Umum',
    icon: '⚙️',
    link: 'ruang-belajar/?subject=backend',
    practiceLink: '#'
  },
  {
    id: 6,
    title: 'Software Quality Assurance',
    category: 'Quality Assurance',
    description: 'Prinsip pengujian perangkat lunak, manual testing, penyusunan test case, dan otomatisasi pengujian.',
    lessonsCount: 0,
    practiceCount: 0,
    level: 'Semua Tingkat',
    tag: 'Umum',
    icon: '🧪',
    link: 'ruang-belajar/?subject=sqa',
    practiceLink: '#'
  }
])

// Filter Kartu Berdasarkan Kategori & Hitung Modul Secara Dinamis
const displayCourses = computed(() => {
  // 1. Filter kategori
  let activeCourses = selectedCategory.value === 'Semua' 
    ? courses.value 
    : courses.value.filter(course => course.category === selectedCategory.value)

  // 2. Kalkulasi dinamis
  return activeCourses.map(course => {
    if (course.syllabus) {
      let theoryCount = 0
      let practiceCount = 0

      course.syllabus.forEach(mod => {
        mod.lessons.forEach(lesson => {
          if (lesson.type === 'theory') {
            theoryCount++
          } else if (['practice', 'challenge', 'project', 'sumative'].includes(lesson.type)) {
            practiceCount++
          }
        })
      })

      // Timpa angka dengan hasil kalkulasi
      return { ...course, lessonsCount: theoryCount, practiceCount: practiceCount }
    }
    
    // Jika tidak punya array syllabus (mapel G-Drive), kembalikan data apa adanya
    return course
  })
})
</script>

<template>
  <section class="min-h-screen bg-[#eef2f5] text-slate-800 px-6 py-12 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header Section -->
      <header class="mb-12 text-center md:text-left">
        <div class="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-100 rounded-full">
          Knowledge For All
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Kelas <span class="text-indigo-600">Setara</span>
        </h1>
  
        <!-- Container untuk Tagline dan Auth UI -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <p class="text-lg text-slate-600 max-w-2xl leading-relaxed m-0">
            Ruang belajar terbuka untuk berbagi pengetahuan dan pengalaman, karena setiap orang berhak mendapatkan kesempatan untuk belajar.
          </p>
    
          <!-- Area Auth (Tombol Login / Profil) -->
          <div class="shrink-0 flex justify-center md:justify-end">
            <!-- Jika Belum Login -->
            <button 
              v-if="!currentUser" 
              @click="openGeneralLogin" 
              class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                Login Siswa
            </button>

            <!-- Jika Sudah Login -->
            <div v-else class="flex items-center gap-3">
              <div class="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl">
                <span>👤</span>
                <span>{{ getDisplayName() }}</span>
              </div>
              <button 
                @click="logout" 
                class="text-sm font-medium px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-colors"
                >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            selectedCategory === category
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
              : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/60'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Course Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard 
          v-for="course in displayCourses" 
          :key="course.id" 
          :course="course"
          @mulai-belajar="handleMulaiBelajar"
          />
      </div>
    </div>
  </section>
  
  <!-- SMART MODAL LOGIN -->
  <AuthModal 
    :is-open="isLoginModalOpen" 
    :course="selectedCourse" 
    @close="isLoginModalOpen = false" 
  />
</template>