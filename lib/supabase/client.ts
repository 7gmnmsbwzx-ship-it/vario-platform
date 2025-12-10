// Supabase Client (Browser-side)
// Using @supabase/ssr for Next.js App Router
// This client is used for client-side operations

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton instance for convenience
export const supabase = createClient()
