<script setup>
defineProps({
  lesson: Object,
  brief: String,
  tabLabel: String,
  hasMedia: Boolean,
  externalLinks: Array,
  scores: Array,
  bestScore: Number,
  activeTab: String
})

defineEmits(['change-tab'])

// Fungsi parser URL YouTube/Drive dipindah ke sini
const getEmbedUrl = (url) => {
  if (!url) return '';
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  if (url.includes('drive.google.com')) return url; 
  return url;
}
</script>

<template>
  <div class="max-w-4xl mx-auto">  
    <!-- Header Konten Aktif -->
    <div class="mb-8 pb-6 border-b border-slate-200">
      <div class="inline-block px-2.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 rounded-lg">
        {{ lesson.moduleTitle?.split(':')[0] }} • {{ lesson.type }}
      </div>
      <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
        {{ lesson.title }}
      </h2>
      <p class="text-slate-600 text-lg leading-relaxed">
        {{ brief }}
      </p>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="flex gap-6 border-b border-slate-200 mb-8 mt-2">
      <button @click="$emit('change-tab', 'materi')" :class="['pb-3 text-sm font-semibold border-b-2 transition-all duration-200', activeTab === 'materi' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
        {{ tabLabel }}
      </button>
      <button @click="$emit('change-tab', 'media')" :class="['pb-3 text-sm font-semibold border-b-2 transition-all duration-200', activeTab === 'media' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
        🎧 Media & Referensi
      </button>
      <button v-if="['practice', 'challenge', 'sumative'].includes(lesson.type)" @click="$emit('change-tab', 'nilai')" :class="['pb-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap', activeTab === 'nilai' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
        🏅 Riwayat Nilai
      </button>
    </div>

    <!-- TAB 1: MATERI UTAMA -->
    <div v-show="activeTab === 'materi'" class="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl">
      <div v-if="lesson.slideUrl" class="aspect-video w-full mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200">
        <iframe class="w-full h-full" :src="lesson.slideUrl" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true"></iframe>
      </div>
      <div v-if="lesson.pdfUrl" class="w-full min-h-[600px] mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200">
        <iframe class="w-full h-full min-h-[600px]" :src="lesson.pdfUrl" frameborder="0" allowfullscreen></iframe>
      </div>
      <div v-if="lesson.practiceUrl" class="w-full min-h-[650px] mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <iframe class="w-full h-full min-h-[650px]" :src="lesson.practiceUrl" frameborder="0" allowfullscreen></iframe>
      </div>
      
      <!-- Konten Vue Markdown (Cara Baru) -->
      <div v-if="lesson.component">
        <component :is="lesson.component" />
      </div>
      <!-- Konten String HTML (Kecocokan Mundur untuk materi lama) -->
      <div v-else-if="lesson.content" v-html="lesson.content"></div>
      <!-- Fallback Jika Kosong -->
      <!-- <div v-else-if="!lesson.slideUrl && !lesson.pdfUrl && !lesson.practiceUrl" class="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
        <strong>Materi Belum Tersedia:</strong> Konten untuk sesi ini belum diunggah oleh instruktur.
      </div> -->
      <!-- Fallback Elegan Jika Belum Ada Media/Materi Apapun -->
      <div v-if="!lesson.component && !lesson.content && !lesson.slideUrl && !lesson.pdfUrl && !lesson.practiceUrl" class="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <span class="text-4xl block mb-3">🚧</span>
        <p class="text-slate-600 font-bold">Materi Belum Tersedia</p>
        <p class="text-sm text-slate-500 mt-1">Modul untuk sesi ini sedang dalam tahap penyusunan oleh instruktur.</p>
      </div>
    </div>

    <!-- TAB 2: MEDIA & REFERENSI -->
    <div v-show="activeTab === 'media'" class="space-y-10">
      <div v-if="lesson.videoUrl">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">👨‍🏫</span> Penjelasan Instruktur
        </h3>
        <div class="aspect-video w-full min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200 relative">
          <iframe class="w-full h-full" :src="getEmbedUrl(lesson.videoUrl)" frameborder="0" allowfullscreen></iframe>
        </div>
        <div v-if="lesson.videoUrl.includes('drive.google.com')" class="mt-3 block sm:hidden">
          <a :href="lesson.videoUrl" target="_blank" class="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl border hover:bg-slate-200">Buka Video Penuh</a>
        </div>
      </div>

      <div v-if="lesson.externalVideoUrl || externalLinks.length > 0">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 pt-6 border-t border-slate-200">
          <span class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">💡</span> Pengayaan & Referensi Luar
        </h3>
        <div v-if="lesson.externalVideoUrl" class="aspect-video w-full mb-6 rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
          <iframe class="w-full h-full" :src="getEmbedUrl(lesson.externalVideoUrl)" frameborder="0" allowfullscreen></iframe>
        </div>
        <ul v-if="externalLinks.length > 0" class="space-y-3">
          <li v-for="(link, index) in externalLinks" :key="index">
            <a :href="link.url" target="_blank" class="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 group">
              <div>
                <p class="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 m-0">{{ link.title || 'Tautan Referensi' }}</p>
                <p class="text-xs text-slate-500 m-0 mt-0.5">{{ link.type || 'Tautan Eksternal' }}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>

      <div v-if="!hasMedia" class="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <span class="text-4xl block mb-3">🎥</span>
        <p class="text-slate-500 font-medium">Belum ada media audio/visual untuk sesi ini.</p>
      </div>
    </div>

    <!-- TAB 3: RIWAYAT NILAI -->
    <div v-show="activeTab === 'nilai'" class="space-y-6">
      <div v-if="scores.length > 0">
        <div :class="['p-5 rounded-2xl border flex items-center justify-between mb-8', bestScore >= 75 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200']">
          <div>
            <p class="text-sm font-medium text-slate-600 mb-1">Status Pencapaian Akhir</p>
            <h3 :class="['text-xl font-bold', bestScore >= 75 ? 'text-emerald-700' : 'text-rose-700']">
              {{ bestScore >= 75 ? '🎉 TUNTAS (KOMPETEN)' : '⚠️ BELUM TUNTAS' }}
            </h3>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-slate-600 mb-1">Nilai Tertinggi</p>
            <p class="text-3xl font-black text-slate-900">{{ bestScore }}</p>
          </div>
        </div>
        <h4 class="text-lg font-bold text-slate-900 mb-4">Riwayat Percobaan</h4>
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th class="px-4 py-3 font-semibold">Percobaan Ke-</th>
                <th class="px-4 py-3 font-semibold">Skor</th>
                <th class="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(attempt, index) in scores" :key="index" class="hover:bg-slate-50/50">
                <td class="px-4 py-3 font-medium text-slate-900">#{{ index + 1 }}</td>
                <td class="px-4 py-3 font-bold text-slate-700">{{ attempt.score }}</td>
                <td class="px-4 py-3">
                  <span :class="['px-2.5 py-1 text-[11px] font-bold uppercase rounded-md', attempt.isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                    {{ attempt.isPassed ? 'Lulus' : 'Remedial' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <span class="text-4xl block mb-3">📝</span>
        <p class="text-slate-600 font-bold">Belum Ada Nilai</p>
      </div>
    </div>
  </div>
</template>