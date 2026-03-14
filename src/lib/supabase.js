import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://trgeybrmyvzdkbtzvufx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZ2V5YnJteXZ6ZGtidHp2dWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NjgzODksImV4cCI6MjA4OTA0NDM4OX0.dmF1s6vSWjPwoURYjxHfnWmF0MYadnDmvlF3Z2gCZSE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
