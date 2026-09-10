import { ref } from 'vue'
import { supabase } from '../supabase.js'

export const currentUser = ref(null)

export const initAuth = async () => {
  const { data } = await supabase.auth.getSession()
  currentUser.value = data.session?.user || null

  supabase.auth.onAuthStateChange((_, session) => {
    currentUser.value = session?.user || null
  })
}

// Login khusus SPBN (Otomatis menambahkan domain)
export const loginWithNisn = async (nisn, password) => {
  const fakeEmail = `${nisn}@siswa.dycodev.com`
  const { data, error } = await supabase.auth.signInWithPassword({
    email: fakeEmail,
    password: password,
  })
  if (error) throw error
  return data
}

// Login khusus Publik (Menggunakan Email asli)
export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (error) throw error
  return data
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Menampilkan nama di UI (Cek apakah dia pakai email asli atau NISN)
export const getDisplayName = () => {
  if (!currentUser.value) return ''
  const email = currentUser.value.email
  
  // Jika akun murid SPBN, tampilkan NISN-nya saja
  if (email.endsWith('@siswa.dycodev.com')) {
    return email.split('@')[0] 
  }
  // Jika masyarakat umum, tampilkan emailnya
  return email 
}