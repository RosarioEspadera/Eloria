const SUPABASE_URL = 'https://iabclikcfddqjcswhqwo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw'; 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// 🧠 Load profile info
async function loadProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return console.error('User fetch error:', authError);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url, name, age, address, email')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) return console.error('Profile fetch error:', profileError);

  if (!profile) {
    console.warn('No profile found — creating blank profile.');
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      name: '',
      age: null,
      address: '',
      avatar_url: ''
    });
    if (insertError) return console.error('Insert failed:', insertError.message);
    return loadProfile(); // reload after insert
  }

  // 🖼️ Populate UI
  document.getElementById('name').textContent = profile.name || '—';
  document.getElementById('age').textContent = profile.age || '—';
  document.getElementById('address').textContent = profile.address || '—';
  document.getElementById('email').textContent = profile.email || '—';
  document.getElementById('profile-photo').src = profile.avatar_url || 'default.png';
}

loadProfile();

// 📸 Upload new photo
document.getElementById('change-photo')?.addEventListener('click', async () => {
  const fileInput = document.getElementById('photo-upload');
  const file = fileInput?.files?.[0];
  if (!file) return console.error('No file selected');

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return console.error('User fetch error:', userError);

  const fileName = `user-${user.id}-${Date.now()}-${file.name}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data: publicData, error: urlError } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    if (urlError || !publicData?.publicUrl) throw new Error('Failed to get public URL');

    const publicUrl = publicData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) throw updateError;

    document.getElementById('profile-photo').src = publicUrl;
    console.log('Photo updated successfully!');
  } catch (err) {
    console.error('Upload failed:', err.message);
  }
});


// 🚪 Logout
document.getElementById('logout-button')?.addEventListener('click', () => {
  window.location.href = 'login.html';
});

