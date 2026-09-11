<script setup>
defineProps({
  syllabus: { type: Array, required: true },
  activeLesson: { type: [Number, String], required: true },
  isDrawerOpen: { type: Boolean, default: false }
})

defineEmits(['close-drawer', 'toggle-module', 'navigate'])
</script>

<template>
  <!-- Overlay Gelap (Hanya muncul saat drawer mobile terbuka) -->
  <div 
    v-show="isDrawerOpen" 
    @click="$emit('close-drawer')"
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
  ></div>

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
      <!-- Tombol Tutup (X) Drawer Mobile -->
      <button @click="$emit('close-drawer')" class="md:hidden text-slate-400 hover:text-red-500 transition-colors p-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  
    <div class="p-3 flex flex-col gap-2">
      <!-- Accordion Modul -->
      <div v-for="mod in syllabus" :key="mod.id" class="mb-2">
        <button 
          @click="$emit('toggle-module', mod.id)" 
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
            @click="$emit('navigate', lesson.id)"
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
</template>