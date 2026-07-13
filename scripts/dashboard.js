const CATS = {
  regata:     { label:'Regata',              color:'#3FA79F' },
  copa:       { label:'Copa & Taça',         color:'#E8B33D' },
  campeonato: { label:'Campeonato',          color:'#E8622C' },
  ranking:    { label:'Ranking & Etapa',     color:'#6C8EEF' },
  natacao:    { label:'Natação & Polo',      color:'#38B6FF' },
  festival:   { label:'Festival & Feira',    color:'#C77DFF' },
  outros:     { label:'Outras modalidades',  color:'#8FA998' },
};
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Escapa qualquer texto vindo de fora (nomes/contatos digitados no site público,
// título de evento, etc.) antes de injetar via innerHTML — evita XSS armazenado.
function esc(str){
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

let adminPassword = '';
let allEvents = [];
let allSubs = [];
let subStats = {};

/* ---------------- api helper ---------------- */
async function api(action, extra = {}){
  const res = await fetch('/.netlify/functions/admin', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ password: adminPassword, action, ...extra })
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || 'Falha na requisição.');
  return data;
}

/* ---------------- login ---------------- */
const loginScreen = document.getElementById('loginScreen');
const dash = document.getElementById('dash');
const loginErr = document.getElementById('loginErr');
const loginBtn = document.getElementById('loginBtn');

document.getElementById('loginForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const pw = document.getElementById('pw').value;
  loginBtn.disabled = true; loginBtn.textContent = 'Entrando…';
  loginErr.textContent = '';
  try{
    adminPassword = pw;
    await api('login');
    sessionStorage.setItem('nautico-admin-pw', pw); // só dura a aba/sessão do navegador
    showDashboard();
  } catch(err){
    loginErr.textContent = err.message || 'Senha incorreta.';
    adminPassword = '';
  } finally{
    loginBtn.disabled = false; loginBtn.textContent = 'Entrar';
  }
});

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  adminPassword = '';
  sessionStorage.removeItem('nautico-admin-pw');
  dash.hidden = true;
  loginScreen.style.display = 'flex';
});

async function showDashboard(){
  loginScreen.style.display = 'none';
  dash.hidden = false;
  await refreshAll();
}

// tenta reaproveitar a senha se ainda estiver na mesma aba (sessionStorage)
(async function tryAutoLogin(){
  const saved = sessionStorage.getItem('nautico-admin-pw');
  if(!saved) return;
  adminPassword = saved;
  try{
    await api('login');
    showDashboard();
  } catch{
    adminPassword = '';
    sessionStorage.removeItem('nautico-admin-pw');
  }
})();

/* ---------------- tabs ---------------- */
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden = true);
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).hidden = false;
  });
});

/* ---------------- data load ---------------- */
async function refreshAll(){
  const [evData, subData] = await Promise.all([
    api('list-events'),
    api('list-subscriptions'),
  ]);
  allEvents = evData.events || [];
  allSubs = subData.subscriptions || [];
  subStats = subData.stats || {};
  renderOverview();
  renderEventsTable();
  renderSubsTable();
}

function parseISO(str){ if(!str) return null; const [y,m,d] = str.split('-').map(Number); return new Date(y, m-1, d); }
function statusOf(ev){
  const today = new Date(); today.setHours(0,0,0,0);
  if(ev.tbd && !ev.s) return 'tbd';
  const s = parseISO(ev.s), e = parseISO(ev.e || ev.s);
  if(e && today > e) return 'encerrado';
  if(s && e && today >= s && today <= e) return 'agora';
  if(s && today < s) return 'embreve';
  return 'tbd';
}

/* ---------------- overview ---------------- */
function renderOverview(){
  document.getElementById('ovTotalEvents').textContent = allEvents.length;
  document.getElementById('ovUpcoming').textContent = allEvents.filter(e=>statusOf(e) !== 'encerrado').length;
  document.getElementById('ovTotalSubs').textContent = subStats.total || 0;
  document.getElementById('ovPending').textContent = subStats.pendentes || 0;

  const total = Math.max(subStats.total || 0, 1);
  document.getElementById('barWhats').style.setProperty('--w', ((subStats.whatsapp||0)/total*100) + '%');
  document.getElementById('barEmail').style.setProperty('--w', ((subStats.email||0)/total*100) + '%');
  document.getElementById('numWhats').textContent = subStats.whatsapp || 0;
  document.getElementById('numEmail').textContent = subStats.email || 0;

  const today = new Date(); today.setHours(0,0,0,0);
  const next = [...allEvents]
    .filter(e=>e.s)
    .map(e=>({ ...e, sd:parseISO(e.s) }))
    .filter(e=>statusOf(e) !== 'encerrado')
    .sort((a,b)=>a.sd-b.sd)
    .slice(0,5);

  const list = document.getElementById('ovNextList');
  list.innerHTML = next.length
    ? next.map(e=>`<div class="next-item"><span>${esc(e.t)}</span><span class="when">${esc(e.d)} de ${MESES[e.m]}</span></div>`).join('')
    : `<p style="color:var(--foam-dim); font-size:13px;">Nenhum evento futuro cadastrado.</p>`;
}

/* ---------------- events table ---------------- */
function renderEventsTable(){
  const tbody = document.getElementById('eventsTbody');
  if(allEvents.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Nenhum evento cadastrado ainda.</td></tr>`;
    return;
  }
  const sorted = [...allEvents].sort((a,b)=> a.m - b.m || (a.s||'').localeCompare(b.s||''));
  tbody.innerHTML = sorted.map(ev=>{
    const cat = CATS[ev.c] || CATS.outros;
    return `<tr>
      <td>${MESES[ev.m]}</td>
      <td>${esc(ev.d)}</td>
      <td>${esc(ev.t)}</td>
      <td><span class="mini-tag" style="--tag-color:${cat.color}">${esc(cat.label)}</span></td>
      <td style="text-align:right; white-space:nowrap;">
        <button class="row-btn" data-edit="${esc(ev.id)}">Editar</button>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('[data-edit]').forEach(btn=>{
    btn.addEventListener('click', ()=>openEventModal(allEvents.find(e=>e.id === btn.dataset.edit)));
  });
}

/* ---------------- subscriptions table ---------------- */
function renderSubsTable(){
  const tbody = document.getElementById('subsTbody');
  if(allSubs.length === 0){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Nenhuma inscrição de lembrete ainda.</td></tr>`;
    return;
  }
  tbody.innerHTML = allSubs.map(sub=>`
    <tr>
      <td>${esc(sub.name) || '—'}</td>
      <td>${sub.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'}</td>
      <td>${esc(sub.contact) || '—'}</td>
      <td>${esc(sub.eventTitle) || '—'}</td>
      <td>${esc(sub.eventWhen) || '—'}</td>
      <td><span class="pill ${sub.sent ? 'sent' : 'pending'}">${sub.sent ? 'Enviado' : 'Pendente'}</span></td>
      <td style="text-align:right;"><button class="row-btn" data-del="${esc(sub.key)}">Remover</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      if(!confirm('Remover esta inscrição de lembrete?')) return;
      try{
        await api('delete-subscription', { key: btn.dataset.del });
        showToast('Removido', 'Inscrição excluída.');
        await refreshAll();
      } catch(err){ showToast('Erro', err.message); }
    });
  });
}

/* ---------------- event modal ---------------- */
const eventOverlay = document.getElementById('eventOverlay');
const eventForm = document.getElementById('eventForm');
const eventErr = document.getElementById('eventErr');

document.getElementById('newEventBtn').addEventListener('click', ()=>openEventModal(null));
document.getElementById('closeEventModal').addEventListener('click', closeEventModal);
eventOverlay.addEventListener('click', e=>{ if(e.target === eventOverlay) closeEventModal(); });

function openEventModal(ev){
  eventErr.textContent = '';
  document.getElementById('eventModalEyebrow').textContent = ev ? 'Editar evento' : 'Novo evento';
  document.getElementById('eventModalTitle').textContent = ev ? 'Editar evento' : 'Adicionar evento';
  document.getElementById('evId').value = ev ? ev.id : '';
  document.getElementById('evMonth').value = ev ? ev.m : '0';
  document.getElementById('evCat').value = ev ? ev.c : 'regata';
  document.getElementById('evTitle').value = ev ? ev.t : '';
  document.getElementById('evDateLabel').value = ev ? ev.d : '';
  document.getElementById('evStart').value = ev ? (ev.s || '') : '';
  document.getElementById('evEnd').value = ev ? (ev.e || '') : '';
  document.getElementById('evTbd').checked = ev ? !!ev.tbd : false;
  document.getElementById('deleteEventBtn').hidden = !ev;
  eventOverlay.classList.add('show');
}
function closeEventModal(){ eventOverlay.classList.remove('show'); }

eventForm.addEventListener('submit', async e=>{
  e.preventDefault();
  eventErr.textContent = '';
  const payload = {
    id: document.getElementById('evId').value || undefined,
    m: Number(document.getElementById('evMonth').value),
    c: document.getElementById('evCat').value,
    t: document.getElementById('evTitle').value.trim(),
    d: document.getElementById('evDateLabel').value.trim(),
    s: document.getElementById('evStart').value || null,
    e: document.getElementById('evEnd').value || document.getElementById('evStart').value || null,
    tbd: document.getElementById('evTbd').checked,
  };
  try{
    await api('save-event', { event: payload });
    closeEventModal();
    showToast('Salvo ✔', `"${payload.t}" foi ${payload.id ? 'atualizado' : 'adicionado'}.`);
    await refreshAll();
  } catch(err){
    eventErr.textContent = err.message;
  }
});

document.getElementById('deleteEventBtn').addEventListener('click', async ()=>{
  const id = document.getElementById('evId').value;
  if(!id || !confirm('Excluir este evento permanentemente?')) return;
  try{
    await api('delete-event', { id });
    closeEventModal();
    showToast('Excluído', 'Evento removido do calendário.');
    await refreshAll();
  } catch(err){
    eventErr.textContent = err.message;
  }
});

/* ---------------- toast ---------------- */
function showToast(title, msg){
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<b>${esc(title)}</b>${esc(msg)}`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='.3s'; setTimeout(()=>t.remove(),300); }, 4200);
}
