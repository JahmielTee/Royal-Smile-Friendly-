
let chatHistory = [];

function appendUserBubble(text){
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'user-bubble';
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function appendBotBubble(text){
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'bot-bubble';
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

async function sendToServer(userText){
  const message = {role:'user', content:userText};
  chatHistory.push(message);
  document.getElementById('chat-typing').style.display = 'block';
  try{
    const resp = await fetch('/api/chat', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({messages: chatHistory})
    });
    document.getElementById('chat-typing').style.display = 'none';
    if(!resp.ok){
      const err = await resp.text();
      console.error('Chat error', err);
      return 'Sorry, there was an error. Try again later.';
    }
    const data = await resp.json();
    chatHistory.push({role:'assistant', content: data.reply});
    return data.reply;
  }catch(e){
    document.getElementById('chat-typing').style.display = 'none';
    console.error(e);
    return 'Sorry, network error.';
  }
}

async function handleChatSubmit(){
  const input = document.getElementById('chatInput');
  const q = input.value.trim();
  if(!q) return;
  appendUserBubble(q);
  input.value = '';
  const reply = await sendToServer(q);
  appendBotBubble(reply);
}

document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'chatSendBtn') handleChatSubmit();
});
document.addEventListener('keypress', function(e){
  if(e.target && e.target.id === 'chatInput' && e.key === 'Enter') handleChatSubmit();
});
