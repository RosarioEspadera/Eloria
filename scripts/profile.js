const supabase = window.supabase.createClient(
  'https://iabclikcfddqjcswhqwo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw'
);

// Load profile info
(async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return console.error('User not found');

  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url, name, age, address')
    .eq('id', user.id)
    .single();

  if (error) return console.error('Profile fetch error:', error);

  if (data?.avatar_url) {
    document.getElementById('profile-photo').src = data.avatar_url;
  }

  document.getElementById('name').textContent = data?.name || '—';
  document.getElementById('age').textContent = data?.age || '—';
  document.getElementById('address').textContent = data?.address || '—';
})();

// Upload new photo
document.getElementById('change-photo')?.addEventListener('click', async () => {
  const fileInput = document.getElementById('photo-upload');
  const file = fileInput.files[0];
  if (!file) return;

  const { data: { user } } = await supabase.auth.getUser();
  const fileName = `user-${user.id}-${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file, { upsert: true });

  if (uploadError) return console.error('Upload failed:', uploadError.message);

  const { data: publicData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);

  const publicUrl = publicData.publicUrl;

  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  document.getElementById('profile-photo').src = publicUrl;
});

// Logout
document.getElementById('logout-button')?.addEventListener('click', () => {
  window.location.href = 'login.html';
});
