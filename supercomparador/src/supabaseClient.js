import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yizuxbujwcebmmhnifie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpenV4YnVqd2NlYm1taG5pZmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjU0NTIsImV4cCI6MjA1OTU0MTQ1Mn0.cUZGoKi0C2PumEkzxh9ipXre5sHrrhJ3F7l1sK_bQJc';

export const supabase = createClient(supabaseUrl, supabaseKey)

    
