const form = document.getElementById('applyForm');
const statusMsg = document.getElementById('statusMsg');
const submitBtn = document.getElementById('submitBtn');

function showStatus(text, type){
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg show ' + type;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем...';

  const data = {
    nick: document.getElementById('nick').value.trim(),
    game: document.getElementById('game').value.trim(),
    rank: document.getElementById('rank').value.trim(),
    role: document.getElementById('role').value.trim(),
    contact: document.getElementById('contact').value.trim(),
    about: document.getElementById('about').value.trim(),
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try{
    await db.collection('applications').add(data);
    showStatus('Заявка отправлена. Организатор свяжется с тобой по указанному контакту.', 'ok');
    form.reset();
  }catch(err){
    console.error(err);
    showStatus('Не получилось отправить заявку. Проверь подключение и попробуй ещё раз.', 'err');
  }finally{
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заявку';
  }
});
