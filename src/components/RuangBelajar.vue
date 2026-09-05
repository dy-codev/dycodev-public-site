<script setup>
import { ref, computed, onMounted } from 'vue'
// Import data silabus master
import { informatikaSyllabusData } from '../data/informatika.js'
import { backendSyllabusData } from '../data/backend.js'
// Nanti jika ada webdev: import { webdevSyllabusData } from '../data/webdev.js'

// 1. Baca parameter 'subject' dari URL (misal: ?subject=backend)
const urlParams = new URLSearchParams(window.location.search)
const subjectKey = urlParams.get('subject') || 'unknown' // default ke informatika jika kosong

// 2. Kamus untuk menentukan data dan key storage berdasarkan URL
const coursesDB = {
  informatika: {
    title: 'Informatika: Fondasi Pemrograman',
    badge: 'Python Dasar',
    totalJP: 36,
    totalMeetings: 18,
    storageKey: 'dycodev_lms_progress_python',
    syllabus: informatikaSyllabusData
  },
  backend: {
    title: 'Backend Engineering',
    badge: 'REST API & Database',
    totalJP: 24,
    totalMeetings: 12,
    storageKey: 'dycodev_lms_progress_backend',
    syllabus: backendSyllabusData 
  }
  // Bisa tambah webdev, qa, dll di sini nanti dengan mudah!
}

// Ambil konfigurasi yang sesuai dengan URL saat ini
const activeCourse = coursesDB[subjectKey] || {
  // 3. Tangani jika subject belum ada di database
  title: subjectKey ? subjectKey.toUpperCase() + ' - Segera Hadir' : 'Materi Pembelajaran',
  badge: 'Dalam Pengembangan',
  totalJP: 0,
  totalMeetings: 0,
  storageKey: `dycodev_lms_empty_${subjectKey}`,
  syllabus: [] // Kosong, menandakan belum ada materi
}
const STORAGE_KEY = activeCourse.storageKey

// Metadata Subject sekarang dinamis mengikuti URL!
const subjectMeta = ref({
  title: activeCourse.title,
  badge: activeCourse.badge,
  totalJP: activeCourse.totalJP,
  totalMeetings: activeCourse.totalMeetings
})

// Fungsi untuk memuat data awal silabus sekaligus menggabungkannya dengan Local Storage
const getInitialSyllabus = () => {
  // Ambil data master, lalu gandakan secara mendalam (deep clone) agar
  // perubahan state isCompleted tidak mengotori file aslinya
  const baseSyllabus = JSON.parse(JSON.stringify(activeCourse.syllabus))

  // Ambil data yang tersimpan di browser
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      const completedIds = JSON.parse(saved)
      baseSyllabus.forEach(mod => {
        mod.lessons.forEach(lesson => {
          lesson.isCompleted = completedIds.includes(lesson.id)
        })
      })
    } else {
      const initialCompletedIds = []
      baseSyllabus.forEach(mod => {
        mod.lessons.forEach(lesson => {
          if (lesson.isCompleted) initialCompletedIds.push(lesson.id)
        })
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCompletedIds))
    }
  } catch (e) {
    console.error("Gagal memuat progress dari localStorage", e)
  }

  return baseSyllabus

}

// Inisialisasi reaktif langsung memanggil fungsi pemuat data
const syllabus = ref(getInitialSyllabus())

const activeLesson = ref(101)

// Simpan status progress ke Local Storage
const saveProgress = () => {
  try {
    const completedIds = []
    syllabus.value.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (lesson.isCompleted) completedIds.push(lesson.id)
      })
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds))
  } catch (e) {
    console.error("Gagal menyimpan progress", e)
  }
}

const toggleModule = (id) => {
  const module = syllabus.value.find(m => m.id === id)
  if (module) module.isOpen = !module.isOpen
}

const selectLesson = (id) => {
  activeLesson.value = id
}

// Fungsi bantu mencari objek lesson asli langsung dari struktur syllabus
const findLessonById = (id) => {
  for (const mod of syllabus.value) {
    const found = mod.lessons.find(l => l.id === id)
    if (found) {
      return {
        ...found,
        moduleTitle: mod.title,
        moduleId: mod.id
      }
    }
  }
  return null
}

// Daftar ID seluruh materi untuk navigasi berurutan
const allLessonIds = computed(() => {
  return syllabus.value.flatMap(mod => mod.lessons.map(l => l.id))
})

const currentIndex = computed(() => {
  return allLessonIds.value.indexOf(activeLesson.value)
})

const prevLesson = computed(() => {
  const idx = currentIndex.value
  return idx > 0 ? findLessonById(allLessonIds.value[idx - 1]) : null
})

const nextLesson = computed(() => {
  const idx = currentIndex.value
  return idx !== -1 && idx < allLessonIds.value.length - 1 ? findLessonById(allLessonIds.value[idx + 1]) : null
})

// Data konten materi yang sedang aktif
const currentLessonData = computed(() => {
  return findLessonById(activeLesson.value) || { title: '', type: '', content: '', moduleTitle: '' }
})

// Kalkulasi persentase progress secara reaktif berdasarkan data asli syllabus
const calculatedProgress = computed(() => {
  let total = 0
  let completed = 0
  for (const mod of syllabus.value) {
    for (const lesson of mod.lessons) {
      total++
      if (lesson.isCompleted) completed++
    }
  }
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})

// Mengubah status selesai langsung pada objek asli di dalam syllabus
const toggleComplete = () => {
  for (const mod of syllabus.value) {
    const found = mod.lessons.find(l => l.id === activeLesson.value)
    if (found) {
      found.isCompleted = !found.isCompleted
      saveProgress() // Simpan perubahan ke local storage
      break
    }
  }
}

// State untuk melacak drawer mobile
const isDrawerOpen = ref(false)

const navigateTo = (lessonId) => {
  activeLesson.value = lessonId
  const targetLesson = findLessonById(lessonId)
  if (targetLesson) {
    const parentModule = syllabus.value.find(m => m.id === targetLesson.moduleId)
    if (parentModule && !parentModule.isOpen) parentModule.isOpen = true
  }
  // Otomatis tutup drawer di mobile saat materi dipilih
  isDrawerOpen.value = false 
}

// Brief/deskripsi pengantar yang otomatis berubah berdasarkan tipe materi
const lessonBrief = computed(() => {
  const type = currentLessonData.value.type
  
  switch (type) {
    case 'theory':
      return 'Pelajari konsep fundamental, dokumentasi, dan penjelasan terstruktur sebelum masuk ke sesi praktik.'
    case 'challenge':
    case 'practice':
      return 'Waktunya hands-on! Terapkan langsung teori ke dalam baris kode untuk menguji pemahaman logismu.'
    case 'project':
    case 'sumative':
      return 'Checkpoint / Penilaian akhir modul. Selesaikan tantangan komprehensif ini untuk mengukur pencapaian belajarmu.'
    default:
      return `Sesi pembelajaran interaktif untuk topik ${currentLessonData.value.title}.`
  }
})

// Fungsi untuk mengubah link YouTube standar menjadi link Embed
const getEmbedUrl = (url) => {
  if (!url) return '';
  // Regex untuk menangkap ID video dari berbagai format link YouTube
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

// Label tombol aksi dinamis berdasarkan tipe materi
const completionButtonText = computed(() => {
  const type = currentLessonData.value.type
  const isCompleted = currentLessonData.value.isCompleted

  if (type === 'theory') {
    return isCompleted ? '✓ Materi Sudah Dipahami' : 'Tandai Sudah Paham'
  } else {
    // Digunakan untuk tipe practice, challenge, project, sumative
    return isCompleted ? '✓ Asesmen Diselesaikan' : 'Tandai Asesmen Selesai'
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#eef2f5] text-slate-800 font-sans flex flex-col h-screen">
    
    <!-- Topbar Navigation -->
    <header class="bg-white/70 backdrop-blur-md border-b border-white/80 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 z-10 sticky top-0 relative">
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Tombol Menu (Hamburger) - Hanya muncul di mobile -->
        <button @click="isDrawerOpen = true" class="md:hidden text-slate-600 hover:text-indigo-600 focus:outline-none p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <!-- Tombol Kembali yang menyesuaikan lebar layar -->
        <a href="/kelas-setara/" class="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="hidden sm:inline">Kembali ke Kelas</span>
          <span class="sm:hidden">Kembali</span>
        </a>
        <div class="h-6 w-px bg-slate-200 hidden md:block"></div>
        <h1 class="font-bold text-slate-900 hidden md:block">{{ subjectMeta.title }}</h1>
      </div>
      
      <!-- Metadata / Progress Desktop -->
      <div class="flex items-center gap-4 text-xs font-medium">
        <!-- Memendekkan teks metadata di mobile agar rapi -->
        <span class="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/50">
          <span class="hidden sm:inline">⏱️ {{ subjectMeta.totalMeetings }} Pertemuan ({{ subjectMeta.totalJP }} JP)</span>
          <span class="sm:hidden shrink-0">⏱️ {{ subjectMeta.totalJP }} JP</span>
        </span>
        <div class="hidden sm:flex items-center gap-2">
          <span class="text-slate-500">Progress:</span>
          <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full transition-all duration-300" :style="`width: ${calculatedProgress}%`"></div>
          </div>
          <span class="text-slate-700">{{ calculatedProgress }}%</span>
        </div>
      </div>

      <!-- Garis Progress Mobile (Fullwidth persis di atas konten) -->
      <div class="absolute bottom-0 left-0 w-full h-[3px] bg-slate-200/50 sm:hidden">
        <div class="h-full bg-indigo-500 transition-all duration-300" :style="`width: ${calculatedProgress}%`"></div>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex flex-1 overflow-hidden">

      <!-- JIKA SILABUS KOSONG / BELUM DISUSUN -->
      <div v-if="activeCourse.syllabus.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div class="max-w-md bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm">
          <span class="text-5xl mb-4 block">🚧</span>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Materi Belum Disusun</h2>
          <p class="text-slate-600 text-sm mb-6 leading-relaxed">
            Modul pembelajaran untuk mata pelajaran <strong class="text-slate-900">{{ activeCourse.title }}</strong> sedang dalam tahap penyusunan kurikulum oleh instruktur. Silakan kembali lagi nanti!
          </p>
          <a href="/kelas-setara/" class="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-colors duration-200 inline-flex items-center gap-2">
            Kembali ke Daftar Kelas
          </a>
        </div>
      </div>

      <!-- JIKA SILABUS ADA (TAMPILAN NORMAL SEPERTI BIASA) -->
      <template v-else>
        
        <!-- Overlay Gelap (Hanya muncul saat drawer mobile terbuka) -->
        <div 
          v-show="isDrawerOpen" 
          @click="isDrawerOpen = false"
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          >
        </div>
      
        <!-- Sidebar / Silabus (Kiri) -->
        <aside 
          :class="[
            'w-[85vw] sm:w-80 lg:w-96 bg-white/95 md:bg-white/40 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shrink-0 overflow-y-auto',
            'fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out',
            isDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          ]"
          >
          <div class="p-5 border-b border-slate-200/60 flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Silabus Pembelajaran</h2>
          
            <!-- Tombol Tutup (X) Drawer - Hanya muncul di mobile -->
            <button @click="isDrawerOpen = false" class="md:hidden text-slate-400 hover:text-red-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        
          <div class="p-3 flex flex-col gap-2">
            <!-- Accordion Modul -->
            <div v-for="mod in syllabus" :key="mod.id" class="mb-2">
              <button 
                @click="toggleModule(mod.id)" 
                class="w-full flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white border border-slate-100 transition-colors text-left"
                >
                <span class="font-semibold text-slate-800 text-sm">{{ mod.title }}</span>
                <svg :class="{'rotate-180': mod.isOpen}" class="w-4 h-4 text-slate-400 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            
              <!-- List TP / Sub-materi -->
              <div v-show="mod.isOpen" class="mt-2 pl-4 pr-2 flex flex-col gap-1 border-l-2 border-indigo-100 ml-5">
                <button 
                  v-for="lesson in mod.lessons" :key="lesson.id"
                  @click="navigateTo(lesson.id)"
                  :class="[ 
                    'flex items-start gap-3 p-2.5 rounded-lg text-left text-sm transition-all',
                    activeLesson === lesson.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-100/50 text-slate-600'
                  ]"
                  >
                  <!-- Ikon Status/Tipe -->
                  <span class="mt-0.5 shrink-0">
                    <svg v-if="lesson.isCompleted" class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span v-else-if="lesson.type === 'theory'" class="text-slate-400">📖</span>
                    <span v-else-if="lesson.type === 'challenge' || lesson.type === 'practice'" class="text-orange-400">⚡</span>
                    <span v-else-if="lesson.type === 'project'" class="text-indigo-500">🎯</span>
                  </span>
                
                  <div class="flex flex-col">
                    <span>{{ lesson.title }}</span>
                    <span class="text-[10px] text-slate-400 mt-1 uppercase">{{ lesson.duration }} • {{ lesson.type }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Area Konten (Kanan) -->
        <main class="flex-1 overflow-y-auto p-6 md:p-10">
          <!-- Render pesan jika data materi kosong -->
          <div v-if="!syllabus || syllabus.length === 0" class="max-w-4xl mx-auto text-center py-20">
            <h2 class="text-2xl font-bold text-slate-600">Konten Belum Tersedia</h2>
            <p class="text-slate-500 mt-2">Materi untuk mapel ini sedang dalam tahap penyusunan.</p>
          </div>

          <div class="max-w-4xl mx-auto">  
            <!-- Header Konten Aktif -->
            <div class="mb-8 pb-6 border-b border-slate-200">
              <div class="inline-block px-2.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 rounded-lg">
                {{ currentLessonData.moduleTitle.split(':')[0] }} • {{ currentLessonData.type }}
              </div>
              <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                {{ currentLessonData.title }}
              </h2>
              <p class="text-slate-600 text-lg leading-relaxed">
                {{ lessonBrief }}
              </p>
            </div>

            <!-- Simulasi Konten Markdown / Video -->
            <div class="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl">
            
              <!-- Tempat Video (Otomatis memutar YouTube jika URL tersedia) -->
              <div v-if="currentLessonData.videoUrl" class="aspect-video w-full mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
                <iframe 
                  class="w-full h-full"
                  :src="getEmbedUrl(currentLessonData.videoUrl)" 
                  title="Video Materi Pembelajaran" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen>
                </iframe>
              </div>

              <!-- Konten Materi yang Di-render dari Data -->
              <div v-html="currentLessonData.content"></div>

            </div>

            <!-- Navigasi Bawah (Prev/Next) -->
            <div class="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            
              <!-- Tombol Sebelumnya -->
              <button
                v-if="prevLesson"
                @click="navigateTo(prevLesson.id)"
                class="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                Sebelumnya
              </button>
              <div v-else></div> <!-- Spacer agar layout tetap seimbang -->

              <!-- Tombol Aksi: Tandai Paham / Belum Paham (Bisa Rollback) -->
              <button
                @click="toggleComplete"
                :class="[
                  'w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2',
                  currentLessonData.isCompleted 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                ]"
                >
                <svg v-if="currentLessonData.isCompleted" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              
                {{ completionButtonText }}
              </button>

              <!-- Tombol Lanjut (Hanya melihat materi berikutnya) -->
              <button
                v-if="nextLesson"
                @click="navigateTo(nextLesson.id)"
                class="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                Lanjut
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <div v-else></div>

            </div>
          </div>
        </main>

      </template>

    </div>
  </div>
</template>

<style>
/* Kustomisasi scrollbar untuk sidebar agar rapi */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>