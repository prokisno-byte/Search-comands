const loginBox = document.getElementById('loginBox');
const adminPanel = document.getElementById('adminPanel');
const loginMsg = document.getElementById('loginMsg');
const logoutLink = document.getElementById('logoutLink');
const appsList = document.getElementById('appsList');
const tabs = document.querySelectorAll('.tab');

let currentFilter = 'pending';
let unsubscribe = null;

function showLoginMsg(text){
  loginMsg.textContent = text;
  loginMsg.className = 'status-msg show err';
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try{
    await firebase.auth().signInWithEmailAndPassword(email, password);
  }catch(err){
    showLoginMsg('Не получилось войти: проверь email и пароль.');
  }
});

logoutLink.addEventListener('click', (e) => {
  e.preventDefault();
  firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged((user) => {
  if(user){
    loginBox.style.display = 'none';
    adminPanel.style.display = 'block';
    logoutLink.style.display = 'inline';
    startListening();
  }else{
    loginBox.style.display = 'block';
    adminPanel.style.display = 'none';
    logoutLink.style.display = 'none';
    if(unsubscribe) unsubscribe();
  }
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    startListening();
  });
});

function startListening(){
  if(unsubscribe) unsubscribe();

  let query = db.collection('applications').orderBy('createdAt', 'desc');
  if(currentFilter !== 'all'){
    query = query.where('status', '==', currentFilter);
  }

  unsubscribe = query.onSnapshot((snapshot) => {
    if(snapshot.empty){
      appsList.innerHTML = '<div class="empty">Заявок в этой категории пока нет.</div>';
      return;
    }
    appsList.innerHTML = '';
    snapshot.forEach(doc => {
      appsList.appendChild(renderCard(doc.id, doc.data()));
    });
  }, (err) => {
    appsList.innerHTML = '<div class="empty">Не удалось загрузить заявки. Проверь правила доступа Firestore.</div>';
    console.error(err);
  });
}

function renderCard(id, data){
  const card = document.createElement('div');
  card.className = 'app-card';

  const badgeClass = data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : 'pending';
  const badgeText = data.status === 'approved' ? 'Принята' : data.status === 'rejected' ? 'Отклонена' : 'На рассмотрении';

  card.innerHTML = `
    <div class="main">
      <span class="badge ${badgeClass}">${badgeText}</span><br>
      <span class="nick">${escapeHtml(data.nick || '—')}</span><span class="tag">${escapeHtml(data.contact || '')}</span>
      <div class="meta">
        <span><b>Игра:</b> ${escapeHtml(data.game || '—')}</span>
        <span><b>Ранг:</b> ${escapeHtml(data.rank || '—')}</span>
        <span><b>Роль:</b> ${escapeHtml(data.role || '—')}</span>
      </div>
      <div class="about">${escapeHtml(data.about || '')}</div>
    </div>
    <div class="actions">
      <button class="btn btn-ok" data-action="approved">Принять</button>
      <button class="btn btn-danger" data-action="rejected">Отклонить</button>
    </div>
  `;

  card.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => updateStatus(id, btn.dataset.action));
  });

  return card;
}

async function updateStatus(id, status){
  try{
    await db.collection('applications').doc(id).update({ status });
  }catch(err){
    console.error(err);
    alert('Не получилось обновить статус заявки.');
  }
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
