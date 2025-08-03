const supabase = window.supabase.createClient(
  'https://iabclikcfddqjcswhqwo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw'
);

// 🧠 Load profile info
async function loadProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('User fetch error:', authError);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url, name, age, address')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    return;
  }

  if (!profile) {
    console.warn('No profile found — creating blank profile.');
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      name: '',
      age: null,
      address: '',
      avatar_url: ''
    });
    if (insertError) {
      console.error('Insert failed:', insertError.message);
      return;
    }
    return loadProfile(); // reload after insert
  }

  // 🖼️ Populate UI
  document.getElementById('name').value = profile.name || '';
  document.getElementById('age').value = profile.age || '';
  document.getElementById('address').value = profile.address || '';
  document.getElementById('profile-photo').src = profile.avatar_url || 'default-avatar.png';
}

loadProfile();

// 📸 Upload new photo
document.getElementById('change-photo')?.addEventListener('click', async () => {
  const fileInput = document.getElementById('photo-upload');
  const file = fileInput.files[0];
  if (!file) return;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('User fetch error:', authError);
    return;
  }

  const fileName = `user-${user.id}-${Date.now()}-${file.name}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) throw updateError;

    document.getElementById('profile-photo').src = publicUrl;
  } catch (err) {
    console.error('Upload failed:', err.message);
  }
});

// 🚪 Logout
document.getElementById('logout-button')?.addEventListener('click', () => {
  window.location.href = 'login.html';
});
