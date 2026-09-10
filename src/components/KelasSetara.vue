<script setup>
import { ref, computed, onMounted } from 'vue'
import { currentUser, initAuth, loginWithNisn, loginWithEmail, logout, getDisplayName } from '../composables/useAuth.js'
// Import data silabus master
import { informatikaSyllabusData } from '../data/informatika.js'
import { backendSyllabusData } from '../data/backend.js'
import { gamtekSyllabusData } from '../data/gamtek.js'

// --- State Auth & Modal ---
const isLoginModalOpen = ref(false)
const loginMode = ref('nisn') // Default tab: 'nisn' atau 'email'
const loginForm = ref({ nisn: '', email: '', password: '' })
const loginError = ref('')
const isLoggingIn = ref(false)
const selectedCourse = ref(null) // Menyimpan course apa yang sedang diklik

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
    window.location.href = course.link;
  } else {
    // Jika belum login, buka modal spesifik untuk course ini
    selectedCourse.value = course;
    loginForm.value = { nisn: '', email: '', password: '' };
    loginError.value = '';
    
    if (course.tag === 'SPBN Bekasi') {
      loginMode.value = 'nisn';
    }
    
    isLoginModalOpen.value = true;
  }
}

// --- FUNGSI PROSES LOGIN ---
const handleLogin = async () => {
  loginError.value = ''
  isLoggingIn.value = true
  
  try {
    if (loginMode.value === 'nisn') {
      await loginWithNisn(loginForm.value.nisn, loginForm.value.password)
    } else {
      await loginWithEmail(loginForm.value.email, loginForm.value.password)
    }
    
    // Jika sukses, tutup modal dan lanjutkan perjalanan ke materi!
    isLoginModalOpen.value = false
    window.location.href = selectedCourse.value.link
    
  } catch (error) {
    loginError.value = 'Kredensial tidak valid. Periksa kembali data Anda.'
  } finally {
    isLoggingIn.value = false
  }
}

// --- FUNGSI PEMBUKA MODAL DARI HEADER (UMUM) ---
const openGeneralLogin = () => {
  selectedCourse.value = null; // Kosongkan selectedCourse agar modal tahu ini mode umum
  loginForm.value = { nisn: '', email: '', password: '' };
  loginError.value = '';
  loginMode.value = 'nisn'; // Default tab
  isLoginModalOpen.value = true;
}

// --- FUNGSI GUEST ---
const continueAsGuest = () => {
  isLoginModalOpen.value = false
  // Pastikan selectedCourse ada sebelum memanggil .link
  if (selectedCourse.value) {
    window.location.href = selectedCourse.value.link;
  }
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
    link: '/ruang-belajar/?subject=informatika',
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
    link: '/ruang-belajar/?subject=gamtek',
    practiceLink: 'https://drive.google.com/drive/folders/1Lk_OQfelBLp4fMFXpS0pIhSU3Q0JabbD?usp=sharing'
  },
  {
    id: 3,
    title: 'Web Development Basics',
    category: 'Software Engineering',
    description: 'Belajar fondasi pembuatan web modern menggunakan HTML, CSS, JavaScript, dan framework interaktif.',
    lessonsCount: 15,
    practiceCount: 0,
    level: 'Pemula - Menengah',
    tag: 'Umum',
    icon: '🌐',
    link: '/ruang-belajar/?subject=webdev',
    practiceLink: '#'
  },
  {
    id: 4,
    title: 'Backend Engineering',
    category: 'Software Engineering',
    description: 'Arsitektur REST API, manajemen basis data, dan pembuatan layanan backend yang scalable.',
    syllabus: backendSyllabusData,
    level: 'Menengah',
    tag: 'Umum',
    icon: '⚙️',
    link: '/ruang-belajar/?subject=backend',
    practiceLink: '#'
  },
  {
    id: 5,
    title: 'Software Quality Assurance',
    category: 'Quality Assurance',
    description: 'Prinsip pengujian perangkat lunak, manual testing, penyusunan test case, dan otomatisasi pengujian.',
    lessonsCount: 0,
    practiceCount: 0,
    level: 'Semua Tingkat',
    tag: 'Umum',
    icon: '🧪',
    link: '/ruang-belajar/?subject=sqa',
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
      <!-- <header class="mb-12 text-center md:text-left">
        <div class="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-100 rounded-full">
          Knowledge For All
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Kelas <span class="text-indigo-600">Setara</span>
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Ruang belajar terbuka untuk berbagi pengetahuan dan pengalaman, karena setiap orang berhak mendapatkan kesempatan untuk belajar.
        </p>
      </header> -->

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
        <div
          v-for="course in displayCourses"
          :key="course.id"
          class="group relative bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Header Kartu -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl p-3 bg-indigo-50/80 rounded-xl border border-indigo-100/50">
                {{ course.icon }}
              </span>
              <span class="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
                {{ course.tag }}
              </span>
            </div>

            <!-- Judul & Deskripsi -->
            <h2 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {{ course.title }}
            </h2>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              {{ course.description }}
            </p>
          </div>

          <!-- Footer Kartu (Perbaikan Tata Letak) -->
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4 mb-4">
              
              <!-- Bungkus Modul & Latihan di dalam satu div agar rata kiri bersamaan -->
              <div class="flex items-center gap-4">
                <span>📚 {{ course.lessonsCount || 0 }} Modul</span>
                <!-- Hilangkan a tag jika practiceLink '#' agar tidak terlihat seperti link patah -->
                <a v-if="course.practiceLink !== '#'"
                    :href="course.practiceLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:text-indigo-600 transition-colors"
                >
                  <span>🤺 {{ course.practiceCount || 0 }} Latihan</span>
                </a>
                <span v-else>🤺 {{ course.practiceCount || 0 }} Latihan</span>
              </div>

              <!-- Level otomatis terdorong ke paling kanan karena justify-between -->
              <span class="shrink-0 text-right font-medium">🎯 {{ course.level }}</span>
            </div>

            <button 
              @click="handleMulaiBelajar(course)"
              class="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Mulai Belajar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- SMART MODAL LOGIN -->
<div v-if="isLoginModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative border border-slate-200">
    
    <button @click="isLoginModalOpen = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
    </button>
    
    <div class="p-6">
      <h3 class="text-xl font-bold text-slate-900 text-center mb-2">Akses Kelas</h3>
      
      <!-- Label Materi (Hanya muncul jika mengklik dari kartu materi) -->
      <p v-if="selectedCourse" class="text-xs text-center text-slate-500 mb-6">
        Materi: <span class="font-bold text-indigo-600">{{ selectedCourse.title }}</span>
      </p>
      <p v-else class="text-xs text-center text-slate-500 mb-6">
        Masuk untuk menyimpan riwayat belajarmu
      </p>

      <!-- TAB SWITCHER (Sembunyikan jika materi yang diklik adalah SPBN) -->
      <div v-if="!selectedCourse || selectedCourse.tag !== 'SPBN Bekasi'" class="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          @click="loginMode = 'nisn'"
          :class="['flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors', loginMode === 'nisn' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
        >
          Siswa SPBN
        </button>
        <button 
          @click="loginMode = 'email'"
          :class="['flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors', loginMode === 'email' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
        >
          Umum / Publik
        </button>
      </div>
      
      <!-- PESAN ERROR -->
      <div v-if="loginError" class="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100 flex items-start gap-2">
        <span>⚠️</span> {{ loginError }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        
        <!-- FORM NISN -->
        <div v-if="loginMode === 'nisn'">
          <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nomor Induk (NISN)</label>
          <input v-model="loginForm.nisn" type="text" placeholder="Contoh: 1001" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
        </div>

        <!-- FORM EMAIL -->
        <div v-if="loginMode === 'email'">
          <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Alamat Email</label>
          <input v-model="loginForm.email" type="email" placeholder="nama@email.com" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
        </div>

        <!-- PASSWORD UMUM -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
          <input v-model="loginForm.password" type="password" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
        </div>

        <button type="submit" :disabled="isLoggingIn" class="w-full mt-2 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoggingIn ? 'Memverifikasi...' : 'Masuk' }}
        </button>
      </form>
    </div>

    <!-- AREA FOOTER MODAL (KONDISIONAL) -->
    
    <!-- 1. Jika diklik dari materi Publik -->
    <div v-if="selectedCourse && selectedCourse.tag !== 'SPBN Bekasi'" class="bg-slate-50 p-4 border-t border-slate-100 text-center">
      <p class="text-xs text-slate-500 mb-3">Tidak ingin menyimpan progress?</p>
      <button @click="continueAsGuest" class="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
        Lewati, Masuk sebagai Guest
      </button>
    </div>

    <!-- 2. Jika diklik dari materi SPBN -->
    <div v-else-if="selectedCourse && selectedCourse.tag === 'SPBN Bekasi'" class="bg-indigo-50 p-4 border-t border-indigo-100 text-center">
      <p class="text-[11px] text-indigo-700 font-medium leading-tight m-0">
        Materi ini bersifat privat untuk siswa <br>SMK Penerbangan Bakti Nusantara.
      </p>
    </div>

    <!-- 3. Jika diklik dari tombol Header (Bebas Eksplorasi) -->
    <div v-else class="bg-slate-50 p-4 border-t border-slate-100 text-center">
      <p class="text-xs text-slate-500 mb-3">Belum punya akun?</p>
      <button @click="isLoginModalOpen = false" class="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
        Eksplorasi Kelas Setara sebagai Guest
      </button>
    </div>

  </div>
</div>

</template>