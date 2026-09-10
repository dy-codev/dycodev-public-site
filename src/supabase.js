import { createClient } from '@supabase/supabase-js'

// Ganti dengan URL dan Key dari menu API di dashboard Supabase Anda
const supabaseUrl = 'https://dcndmkhtdlinmimwxslw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjbmRta2h0ZGxpbm1pbXd4c2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDA2OTIsImV4cCI6MjEwNDUxNjY5Mn0.uLSSerFpzF_LR7w7qhliPyZQcDrLgMDqHw2YQUb9Uk4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)