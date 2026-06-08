import { createClient } from "@supabase/supabase-js";

// Check if variables are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is undefined in .env.local");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);