<script setup>
import { ref, computed } from 'vue'

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
    lessonsCount: 12,
    level: 'Pemula',
    tag: 'SPBN Bekasi',
    icon: '💻',
    link: '#'
  },
  {
    id: 2,
    title: 'Gambar Teknik SMK',
    category: 'Materi SMK',
    description: 'Panduan standar penggambaran teknik, proyeksi, dan dokumentasi visual teknis untuk siswa kejuruan.',
    lessonsCount: 17,
    practiceCount: 18,
    level: 'Pemula',
    tag: 'SPBN Bekasi',
    icon: '📐',
    link: 'https://drive.google.com/drive/folders/1oB0gv3FnmG0n1MOPM6QQHHq9XbcojyEF?usp=sharing',
    practiceLink: 'https://drive.google.com/drive/folders/1Lk_OQfelBLp4fMFXpS0pIhSU3Q0JabbD?usp=sharing'
  },
  {
    id: 3,
    title: 'Web Development Basics',
    category: 'Software Engineering',
    description: 'Belajar fondasi pembuatan web modern menggunakan HTML, CSS, JavaScript, dan framework interaktif.',
    lessonsCount: 15,
    level: 'Pemula - Menengah',
    tag: 'Industri',
    icon: '🌐',
    link: '#'
  },
  {
    id: 4,
    title: 'Backend Engineering',
    category: 'Software Engineering',
    description: 'Arsitektur REST API, manajemen basis data, dan pembuatan layanan backend yang scalable.',
    lessonsCount: 10,
    level: 'Menengah',
    tag: 'Industri',
    icon: '⚙️',
    link: '#'
  },
  {
    id: 5,
    title: 'Software Quality Assurance',
    category: 'Quality Assurance',
    description: 'Prinsip pengujian perangkat lunak, manual testing, penyusunan test case, dan otomatisasi pengujian.',
    lessonsCount: 9,
    level: 'Semua Tingkat',
    tag: 'Industri',
    icon: '🧪',
    link: '#'
  }
])

// Filter Kartu Berdasarkan Kategori
const filteredCourses = computed(() => {
  if (selectedCategory.value === 'Semua') {
    return courses.value
  }
  return courses.value.filter(course => course.category === selectedCategory.value)
})
</script>

<template>
  <section class="min-h-screen bg-[#eef2f5] text-slate-800 px-6 py-12 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header Section -->
      <header class="mb-12 text-center md:text-left">
        <div class="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-100 rounded-full">
          LMS Statis & Sharing Hub
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Kelas <span class="text-indigo-600">Setara</span>
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Wadah berbagi pengetahuan praktis industri software engineering serta materi pembelajaran Informatika & Gambar Teknik SMK.
        </p>
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
          v-for="course in filteredCourses"
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

          <!-- Footer Kartu -->
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4 mb-4">
              <span>📚 {{ course.lessonsCount }} Modul</span>
              <a :href="course.practiceLink"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <span>📚 {{ course.practiceCount }} Latihan</span>
              </a>
              <span>🎯 {{ course.level }}</span>
            </div>

            <a 
              :href="course.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Mulai Belajar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>