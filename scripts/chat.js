 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    const supabase = createClient('https://iabclikcfddqjcswhqwo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw');

  async function loadMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('content')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error loading messages:', error);
    return;
  }

  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = ''; // Clear existing content

  data.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = msg.content;
    chatBox.appendChild(div);
  });

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}


  async function sendMessage() {
    const content = document.getElementById('message').value;
    if (!content.trim()) return;
    await supabase.from('messages').insert([{ content }]);
    document.getElementById('message').value = '';
  }

  document.getElementById('send-btn').addEventListener('click', sendMessage);

  supabase
    .channel('public:messages')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
      const div = document.createElement('div');
      div.textContent = payload.new.content;
      document.getElementById('chat-box').appendChild(div);
    })
    .subscribe();

  // Load existing messages on page load
 loadMessages();
