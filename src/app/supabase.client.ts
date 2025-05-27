import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://mhdzgcegfazeydrkggzj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZHpnY2VnZmF6ZXlkcmtnZ3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDIyNzUsImV4cCI6MjA2MzUxODI3NX0.6JjAbto_KC6M1gxfUap7eGl6_Cc2u_HHzuiPMZwwBHo';
export const supabase = createClient(supabaseUrl, supabaseKey)