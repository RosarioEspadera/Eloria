import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient('https://iabclikcfddqjcswhqwo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw');

document.getElementById('change-photo').addEventListener('click', async () => {
  const fileInput = document.getElementById('photo-upload');
  const file = fileInput.files[0];

  if (!file) return;

  const fileName = `user-${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (error) {
    console.error('Upload failed:', error.message);
    return;
  }

  const { publicUrl } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName).data;

  document.getElementById('profile-photo').src = publicUrl;
});


document.getElementById('logout-button').addEventListener('click', () => {
  window.location.href = 'login.html';
});
