import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to admin-dashboard/.env and rebuild.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Public website address (used for "View live site" and case-study previews).
export const SITE_URL = 'https://codecanvas-topaz.vercel.app'
