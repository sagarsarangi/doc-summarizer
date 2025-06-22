import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shzuosddioswtbajrbpi.supabase.co"; // Use your actual URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoenVvc2RkaW9zd3RiYWpyYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzkzNjYsImV4cCI6MjA2NjExNTM2Nn0.z7KRY-H30y3nQnnN3s2KC-fSmG5hoPmFbRUTVoGWDHY"; // Get this from your Supabase project → Project Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
