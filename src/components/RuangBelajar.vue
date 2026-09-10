<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
// import { currentUser, initAuth, logout, getNisnFromUser } from '../composables/useAuth.js'
import { marked } from 'marked'
import { supabase } from '../supabase.js'
import { currentUser, initAuth, logout, getDisplayName } from '../composables/useAuth.js'
// Import data silabus master
import { informatikaSyllabusData } from '../data/informatika.js'
import { gamtekSyllabusData } from '../data/gamtek.js'
import { backendSyllabusData } from '../data/backend.js'
// Nanti jika ada webdev: import { webdevSyllabusData } from '../data/webdev.js'

// 1. Baca parameter 'subject' dari URL (misal: ?subject=backend)
const urlParams = new URLSearchParams(window.location.search)
const subjectKey = urlParams.get('subject') || 'unknown' // default ke informatika jika kosong

// 2. Kamus untuk menentukan data dan key storage berdasarkan URL
const coursesDB = {
  informatika: {
    title: 'Informatika: Untuk SMK/MAK Kelas X',
    badge: 'Python Dasar',
    totalJP: 36,
    totalMeetings: 18,
    storageKey: 'dycodev_lms_progress_python',
    syllabus: informatikaSyllabusData
  },
  gamtek: {
    title: 'Dasar-Dasar Gambar Teknik',
    badge: '',
    totalJP: 24,
    totalMeetings: 12,
    storageKey: 'dycodev_lms_progress_gamtek',
    syllabus: gamtekSyllabusData 
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

// State baru untuk menampung hasil render teks
const renderedContent = ref('')
const isLoadingContent = ref(false)

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

// Inisialisasi dasar silabus secara utuh dari file JS
const syllabus = ref(JSON.parse(JSON.stringify(activeCourse.syllabus)))

// FUNGSI LOAD PROGRESS (HIBRIDA)
const loadProgress = async () => {
  let completedIds = []

  if (currentUser.value) {
    // --- MODE SUPABASE (LOGIN) ---
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('completed_lessons')
        .eq('subject_key', subjectKey)
        .eq('student_email', currentUser.value.email)
        .single() // Karena kolomnya unik, ambil 1 baris saja
        
      if (data) completedIds = data.completed_lessons
    } catch (e) {
      // Jika error 'PGRST116', artinya data murid ini belum ada di tabel, abaikan saja
    }
  } else {
    // --- MODE GUEST (LOCAL STORAGE) ---
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) completedIds = JSON.parse(saved)
  }

  // Terapkan data yang didapat (dari DB atau Lokal) ke centang UI
  syllabus.value.forEach(mod => {
    mod.lessons.forEach(lesson => {
      lesson.isCompleted = completedIds.includes(lesson.id)
    })
  })
}

// FUNGSI SAVE PROGRESS (HIBRIDA)
const saveProgress = async () => {
  try {
    const completedIds = []
    syllabus.value.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (lesson.isCompleted) completedIds.push(lesson.id)
      })
    })

    if (currentUser.value) {
      // --- MODE SUPABASE (LOGIN) ---
      const { error } = await supabase
        .from('course_progress')
        .upsert({
          student_email: currentUser.value.email,
          subject_key: subjectKey,
          completed_lessons: completedIds,
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_email, subject_key' }) // Timpa data lama
        
      if (error) throw error
    } else {
      // --- MODE GUEST (LOCAL STORAGE) ---
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds))
    }
  } catch (e) {
    console.error("Gagal menyimpan progress", e)
  }
}

// Fungsi penentu materi pertama secara dinamis
const getFirstLessonId = () => {
  if (syllabus.value.length > 0 && syllabus.value[0].lessons.length > 0) {
    return syllabus.value[0].lessons[0].id
  }
  return 0 // Fallback jika benar-benar kosong
}

// Gunakan hasil fungsi di atas sebagai materi aktif pertama
const activeLesson = ref(getFirstLessonId())

const activeTab = ref('materi')

// // Simpan status progress ke Local Storage
// const saveProgress = () => {
//   try {
//     const completedIds = []
//     syllabus.value.forEach(mod => {
//       mod.lessons.forEach(lesson => {
//         if (lesson.isCompleted) completedIds.push(lesson.id)
//       })
//     })
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds))
//   } catch (e) {
//     console.error("Gagal menyimpan progress", e)
//   }
// }

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

  // Reset tab ke materi utama setiap kali ganti pelajaran
  activeTab.value = 'materi'
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

// Memfilter link yang benar-benar ada isinya (bukan placeholder null)
const validExternalLinks = computed(() => {
  const links = currentLessonData.value.externalLinks
  if (!links || !Array.isArray(links)) return []
  
  // Hanya kembalikan objek link yang memiliki URL valid (tidak null dan tidak string kosong)
  return links.filter(link => link && link.url !== null && link.url.trim() !== '')
})

// Mengecek secara total apakah Tab Media memiliki minimal 1 konten valid
const hasMediaContent = computed(() => {
  return !!(
    currentLessonData.value.videoUrl || 
    currentLessonData.value.externalVideoUrl || 
    validExternalLinks.value.length > 0
  )
})

// Label dinamis untuk Tab 1 berdasarkan judul atau tipe materi
const mainTabLabel = computed(() => {
  const lesson = currentLessonData.value
  if (!lesson || !lesson.title) return '📖 Materi Utama'

  // Jika judul mengandung titik dua (misal: "Quiz: Hardware", "Hands-on: Garis"), ambil kata depannya
  if (lesson.title.includes(':')) {
    const prefix = lesson.title.split(':')[0].trim()
    return `⚡ ${prefix}`
  }

  // Fallback berdasarkan tipe materi jika tidak ada titik dua
  if (lesson.type === 'theory') return '📖 Materi Utama'
  if (lesson.type === 'practice' || lesson.type === 'challenge') return '⚡ Lembar Praktik'
  if (lesson.type === 'project' || lesson.type === 'sumative') return '🏆 Evaluasi / Proyek'

  return '📖 Materi Utama'
})

// Fungsi untuk mengubah link YouTube standar menjadi link Embed,
// dan meloloskan URL Google Drive secara langsung
const getEmbedUrl = (url) => {
  if (!url) return '';
  
  // 1. Cek apakah ini link YouTube
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // 2. Cek apakah ini link Google Drive
  if (url.includes('drive.google.com')) {
    // Kembalikan URL asli, karena Anda sudah memasukkan
    // URL versi /preview langsung di data.js Anda
    return url; 
  }

  // Fallback untuk URL lainnya
  return url;
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

// Pantau setiap kali currentLessonData berubah (siswa klik materi lain)
watch(
  () => currentLessonData.value, 
  async (newLesson) => {
    if (!newLesson) return;

    // PRIORITAS 1: Cek apakah ada format string HTML lama (Backward compatibility)
    if (newLesson.content && newLesson.content.trim() !== '') {
      renderedContent.value = newLesson.content;
      isLoadingContent.value = false;
    } 
    // PRIORITAS 2: Jika tidak ada HTML, cek apakah ada file Markdown
    else if (newLesson.markdownUrl) {
      isLoadingContent.value = true
      try {
        const response = await fetch(newLesson.markdownUrl)
        
        // PASTIKAN responsenya benar-benar sukses dan bukan halaman HTML (biasanya Vite 404 fallback mengembalikan content-type text/html)
        const contentType = response.headers.get("content-type");
        if (!response.ok || (contentType && contentType.includes("text/html"))) {
            throw new Error('File Markdown tidak ditemukan atau belum dibuat');
        }
        
        const rawText = await response.text()
        renderedContent.value = marked.parse(rawText) 
      } catch (error) {
        console.error("Gagal memuat markdown:", error)
        renderedContent.value = `
          <div class="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
            <strong>Materi Belum Tersedia:</strong> File markdown untuk sesi ini belum diunggah oleh instruktur.
          </div>`
      } finally {
        isLoadingContent.value = false
      }
    } 
    // PRIORITAS 3: Kosong
    else {
      renderedContent.value = ''
    }
  }, 
  { immediate: true } 
)

// ==========================================
// FITUR RIWAYAT NILAI KUIS
// ==========================================
// const QUIZ_STORAGE_KEY = `dycodev_quiz_scores_${subjectKey}`
// const quizHistory = ref({})

// // Fungsi memuat riwayat nilai dari Local Storage
// const loadQuizHistory = () => {
//   try {
//     const saved = localStorage.getItem(QUIZ_STORAGE_KEY)
//     if (saved) quizHistory.value = JSON.parse(saved)
//   } catch (e) {
//     console.error("Gagal memuat riwayat nilai", e)
//   }
// }

// // Fungsi menyimpan riwayat nilai
// const saveQuizScore = (score) => {
//   const lessonId = activeLesson.value
  
//   if (!quizHistory.value[lessonId]) {
//     quizHistory.value[lessonId] = []
//   }

//   // Tambahkan data tes baru
//   quizHistory.value[lessonId].push({
//     date: new Date().toISOString(),
//     score: score,
//     isPassed: score >= 70 // KKM disetel 70, ubah sesuai standar Anda
//   })

//   // Simpan ke Local Storage
//   localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizHistory.value))
// }

// ==========================================
// FITUR RIWAYAT NILAI KUIS (HIBRIDA)
// ==========================================
const QUIZ_STORAGE_KEY = `dycodev_quiz_scores_${subjectKey}`
const quizHistory = ref({})

// FUNGSI LOAD KUIS (HIBRIDA)
const loadQuizHistory = async () => {
  if (currentUser.value) {
    // --- MODE SUPABASE ---
    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('subject_key', subjectKey)
        .eq('student_name', currentUser.value.email)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data) {
        const historyMap = {}
        data.forEach(item => {
          if (!historyMap[item.lesson_id]) historyMap[item.lesson_id] = []
          historyMap[item.lesson_id].push({
            date: item.created_at,
            score: item.score,
            isPassed: item.is_passed
          })
        })
        quizHistory.value = historyMap
      }
    } catch (e) {
      console.error("Gagal memuat riwayat kuis dari Supabase", e)
    }
  } else {
    // --- MODE GUEST ---
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY)
      if (saved) quizHistory.value = JSON.parse(saved)
    } catch (e) {
      console.error("Gagal memuat riwayat nilai lokal", e)
    }
  }
}

// FUNGSI SAVE KUIS (HIBRIDA)
const saveQuizScore = async (score) => {
  const lessonId = activeLesson.value
  const isPassed = score >= 70

  // 1. Update antarmuka (Vue State) seketika tanpa loading lama
  if (!quizHistory.value[lessonId]) {
    quizHistory.value[lessonId] = []
  }
  quizHistory.value[lessonId].push({
    date: new Date().toISOString(),
    score: score,
    isPassed: isPassed
  })

  // 2. Simpan datanya di balik layar
  if (currentUser.value) {
    // --- MODE SUPABASE ---
    try {
      const { error } = await supabase
        .from('quiz_scores')
        .insert([
          {
            student_name: currentUser.value.email, // Kita simpan emailnya ke kolom ini
            subject_key: subjectKey,
            lesson_id: lessonId,
            score: score,
            is_passed: isPassed
          }
        ])
      if (error) throw error
    } catch (e) {
      console.error("Gagal menyimpan kuis ke Supabase", e)
    }
  } else {
    // --- MODE GUEST ---
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizHistory.value))
  }

  activeTab.value = 'nilai'
}

// Listener untuk menangkap pesan dari iframe HTML
const handleIframeMessage = (event) => {
  // Pastikan tipe pesan sesuai dengan yang dikirim dari kuis
  if (event.data && event.data.type === 'QUIZ_FINISHED') {
    saveQuizScore(event.data.score)
    // Opsional: Otomatis pindah ke tab nilai setelah kuis selesai
    activeTab.value = 'nilai' 
  }
}

// Pasang 'telinga' saat komponen dimuat
onMounted(async () => {
  // TUNGGU sampai status login dipastikan dari browser cookies/session
  await initAuth()
  
  // Setelah tahu dia Login atau Guest, baru tarik datanya!
  loadProgress()
  loadQuizHistory()
  window.addEventListener('message', handleIframeMessage)
})

// Cabut 'telinga' saat komponen dihancurkan (good practice)
onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage)
})

// Data riwayat nilai untuk materi yang sedang aktif
const currentLessonScores = computed(() => {
  return quizHistory.value[activeLesson.value] || []
})

const highestScore = computed(() => {
  if (currentLessonScores.value.length === 0) return 0
  return Math.max(...currentLessonScores.value.map(s => s.score))
})
// ==========================================
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
        <!-- Profil User / Logout -->
        <div class="h-6 w-px bg-slate-200 hidden md:block"></div> <!-- Pemisah Vertikal -->
    
        <div v-if="currentUser" class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>👤</span>
            <span class="hidden sm:inline">{{ getDisplayName() }}</span>
          </div>
          <button @click="logout" title="Keluar" class="text-sm p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
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
                    <span v-else-if="lesson.type === 'practice'" class="text-orange-400">⚡</span>
                    <span v-else-if="lesson.type === 'challenge'" class="text-slate-400">🧗🏼‍♂️</span>
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
        <main class="flex-1 flex flex-col h-full overflow-hidden relative">
          
          <!-- Area Konten yang Bisa Di-scroll -->
          <div class="flex-1 overflow-y-auto p-6 md:p-10 pb-12">
            
            <!-- Render pesan jika data materi kosong -->
            <div v-if="!syllabus || syllabus.length === 0" class="max-w-4xl mx-auto text-center py-20">
              <h2 class="text-2xl font-bold text-slate-600">Konten Belum Tersedia</h2>
              <p class="text-slate-500 mt-2">Materi untuk mapel ini sedang dalam tahap penyusunan.</p>
            </div>

            <!-- JIKA ADA MATERI -->
            <div v-else class="max-w-4xl mx-auto">  
              
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

              <!-- TABS NAVIGATION -->
              <div class="flex gap-6 border-b border-slate-200 mb-8 mt-2">
                <!-- Tab 1: Materi -->
                <button
                  @click="activeTab = 'materi'"
                  :class="[
                    'pb-3 text-sm font-semibold border-b-2 transition-all duration-200', 
                    activeTab === 'materi' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  ]"
                >
                  {{ mainTabLabel }}
                </button>
                <!-- Tab 2: Media -->
                <button
                  @click="activeTab = 'media'"
                  :class="[
                    'pb-3 text-sm font-semibold border-b-2 transition-all duration-200', 
                    activeTab === 'media' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  ]"
                >
                  🎧 Media & Referensi
                </button>

                <!-- TAB BARU: Nilai (Hanya muncul untuk kuis/asesmen) -->
                <button
                  v-if="['practice', 'challenge', 'sumative'].includes(currentLessonData.type)"
                  @click="activeTab = 'nilai'"
                  :class="[
                    'pb-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap', 
                    activeTab === 'nilai' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  ]"
                >
                  🏅 Riwayat Nilai
                </button>
              </div>

              <!-- TAB 1: MATERI UTAMA (Teks, Slide, PDF) -->
              <div v-show="activeTab === 'materi'" class="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl">
                
                <!-- Tempat Google Slide -->
                <div v-if="currentLessonData.slideUrl" class="aspect-video w-full mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200">
                  <iframe 
                    class="w-full h-full"
                    :src="currentLessonData.slideUrl" 
                    title="Presentasi Materi" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    mozallowfullscreen="true" 
                    webkitallowfullscreen="true">
                  </iframe>
                </div>

                <!-- Tempat Modul PDF -->
                <div v-if="currentLessonData.pdfUrl" class="w-full min-h-[600px] mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200">
                  <iframe 
                    class="w-full h-full min-h-[600px]"
                    :src="currentLessonData.pdfUrl" 
                    title="Modul Pembelajaran PDF" 
                    frameborder="0" 
                    allow="autoplay"
                    allowfullscreen>
                  </iframe>
                </div>

                <!-- Tempat Kuis Interaktif HTML (Otomatis muncul jika practiceUrl tersedia) -->
                <div v-if="currentLessonData.practiceUrl" class="w-full min-h-[650px] mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                  <iframe 
                    class="w-full h-full min-h-[650px]"
                    :src="currentLessonData.practiceUrl" 
                    title="Kuis Interaktif" 
                    frameborder="0" 
                    allowfullscreen>
                  </iframe>
                </div>

                <!-- Konten Teks / HTML -->
                <div v-if="isLoadingContent" class="py-10 text-center text-slate-500 animate-pulse">
                  Memuat materi teks...
                </div>
                <div v-else v-html="renderedContent"></div>
              </div>

              <!-- TAB 2: MEDIA & REFERENSI (Video Ori & Eksternal) -->
              <div v-show="activeTab === 'media'" class="space-y-10">
                
                <!-- Segmen 1: Video Instruktur (Ori) -->
                <div v-if="currentLessonData.videoUrl">
                  <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">👨‍🏫</span> 
                    Penjelasan Instruktur
                  </h3>
                  <!-- Menambahkan min-h-[260px] untuk mobile, dan min-h-[320px] untuk layar yang sedikit lebih besar -->
                  <div class="aspect-video w-full min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200 relative">
                    <iframe 
                      class="w-full h-full"
                      :src="getEmbedUrl(currentLessonData.videoUrl)" 
                      title="Video Materi Pembelajaran" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen>
                    </iframe>
                  </div>
                  <!-- Tombol Alternatif Buka Video (Khusus Mobile) -->
                  <div v-if="currentLessonData.videoUrl.includes('drive.google.com')" class="mt-3 block sm:hidden">
                    <a 
                      :href="currentLessonData.videoUrl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Buka Video Penuh
                    </a>
                  </div>
                </div>

                <!-- Segmen 2: Referensi Eksternal -->
                <div v-if="currentLessonData.externalVideoUrl || validExternalLinks.length > 0">
                  <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 pt-6 border-t border-slate-200">
                    <span class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">💡</span> 
                    Pengayaan & Referensi Luar
                  </h3>
                  
                  <!-- Video Eksternal (Misal: YouTube channel lain) -->
                  <div v-if="currentLessonData.externalVideoUrl" class="aspect-video w-full mb-6 rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
                    <iframe 
                      class="w-full h-full"
                      :src="getEmbedUrl(currentLessonData.externalVideoUrl)" 
                      title="Video Referensi Eksternal" 
                      frameborder="0" 
                      allowfullscreen>
                    </iframe>
                  </div>

                  <!-- Daftar Link/Makalah Eksternal (Hanya melooping yang valid) -->
                  <ul v-if="validExternalLinks.length > 0" class="space-y-3">
                    <li v-for="(link, index) in validExternalLinks" :key="index">
                      <a :href="link.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div>
                          <p class="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 m-0">
                            {{ link.title || 'Tautan Referensi' }}
                          </p>
                          <p class="text-xs text-slate-500 m-0 mt-0.5">
                            {{ link.type || 'Tautan Eksternal' }}
                          </p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Fallback jika tab media BENAR-BENAR KOSONG / hanya berisi null -->
                <div v-if="!hasMediaContent" class="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <span class="text-4xl block mb-3">📭</span>
                  <p class="text-slate-500 font-medium">Belum ada media audio/visual untuk sesi ini.</p>
                  <p class="text-sm text-slate-400 mt-1">Silakan fokus pada tab Materi Utama.</p>
                </div>

              </div>

              <!-- TAB 3: RIWAYAT NILAI -->
              <div v-show="activeTab === 'nilai'" class="space-y-6">
                
                <div v-if="currentLessonScores.length > 0">
                  <!-- Banner Status Akhir -->
                  <div :class="[
                    'p-5 rounded-2xl border flex items-center justify-between mb-8',
                    highestScore >= 70 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  ]">
                    <div>
                      <p class="text-sm font-medium text-slate-600 mb-1">Status Pencapaian Akhir</p>
                      <h3 :class="['text-xl font-bold', highestScore >= 70 ? 'text-emerald-700' : 'text-rose-700']">
                        {{ highestScore >= 70 ? '🎉 TUNTAS (KOMPETEN)' : '⚠️ BELUM TUNTAS' }}
                      </h3>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-slate-600 mb-1">Nilai Tertinggi</p>
                      <p class="text-3xl font-black text-slate-900">{{ highestScore }}</p>
                    </div>
                  </div>

                  <!-- Tabel Riwayat -->
                  <h4 class="text-lg font-bold text-slate-900 mb-4">Riwayat Percobaan</h4>
                  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table class="w-full text-left text-sm text-slate-600">
                      <thead class="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <tr>
                          <th class="px-4 py-3 font-semibold">Percobaan Ke-</th>
                          <th class="px-4 py-3 font-semibold">Tanggal & Waktu</th>
                          <th class="px-4 py-3 font-semibold">Skor</th>
                          <th class="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr v-for="(attempt, index) in currentLessonScores" :key="index" class="hover:bg-slate-50/50">
                          <td class="px-4 py-3 font-medium text-slate-900">#{{ index + 1 }}</td>
                          <td class="px-4 py-3">{{ new Date(attempt.date).toLocaleString('id-ID') }}</td>
                          <td class="px-4 py-3 font-bold text-slate-700">{{ attempt.score }}</td>
                          <td class="px-4 py-3">
                            <span :class="[
                              'px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md',
                              attempt.isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            ]">
                              {{ attempt.isPassed ? 'Lulus' : 'Remedial' }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Kondisi jika belum ada nilai -->
                <div v-else class="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <span class="text-4xl block mb-3">📝</span>
                  <p class="text-slate-600 font-bold">Belum Ada Nilai</p>
                  <p class="text-sm text-slate-500 mt-1">Kamu belum pernah menyelesaikan kuis/asesmen ini. Kerjakan sekarang di tab Materi Utama!</p>
                </div>

              </div>
            </div>
          </div>

          <!-- FIXED BOTTOM BAR (Navigasi Selalu di Bawah) -->
          <div v-if="syllabus && syllabus.length > 0" class="shrink-0 border-t border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4 md:px-10 z-20 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)]">
            <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
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

              <!-- Tombol Lanjut -->
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