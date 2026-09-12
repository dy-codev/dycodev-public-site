<script setup>
import { ref, watch } from 'vue'
import { supabase } from '../supabase.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const form = ref({ newPassword: '', confirmPassword: '' })
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

// Bersihkan form setiap kali modal dibuka
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = { newPassword: '', confirmPassword: '' }
    toast.value.show = false
  }
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  // Sembunyikan otomatis setelah 3 detik
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const handleSubmit = async () => {
  // Validasi Dasar
  if (form.value.newPassword !== form.value.confirmPassword) {
    showToast('Konfirmasi password tidak cocok!', 'error')
    return
  }
  if (form.value.newPassword.length < 6) {
    showToast('Password minimal 6 karakter.', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: form.value.newPassword
    })

    if (error) throw error

    showToast('Password berhasil diperbarui!', 'success')
    
    // Tutup modal otomatis setelah sukses (jeda 2 detik agar siswa bisa membaca toast)
    setTimeout(() => {
      emit('close')
    }, 2000)

  } catch (error) {
    showToast('Gagal memperbarui: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative border border-slate-200">
      
      <!-- TOAST NOTIFICATION MENGAMBANG DI DALAM MODAL -->
      <transition 
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="-translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-full opacity-0"
      >
        <div v-if="toast.show" 
             :class="['absolute top-0 left-0 w-full px-4 py-3 text-sm font-medium text-center z-20', 
                      toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white']">
          {{ toast.message }}
        </div>
      </transition>

      <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
      </button>
    
      <div class="p-6 pt-10">
        <h3 class="text-xl font-bold text-slate-900 text-center mb-2">Ganti Password</h3>
        <p class="text-xs text-center text-slate-500 mb-6">
          Gunakan kombinasi yang mudah Anda ingat.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password Baru</label>
            <input v-model="form.newPassword" type="password" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Ulangi Password Baru</label>
            <input v-model="form.confirmPassword" type="password" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full mt-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>