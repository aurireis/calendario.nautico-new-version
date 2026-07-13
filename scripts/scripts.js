/* ---------------- category metadata ---------------- */
const CATS = {
  regata:     { label:'Regata',              color:'var(--c-regata)',     icon:'<path d="M12 3v12"/><path d="M12 3l5 9H12z" fill="currentColor" stroke="none" opacity=".9"/><path d="M12 7l-4 8h4z" fill="currentColor" stroke="none" opacity=".55"/><path d="M4 18h16l-2 3H6z"/>' },
  copa:       { label:'Copa & Taça',         color:'var(--c-copa)',       icon:'<path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><line x1="12" y1="13" x2="12" y2="17"/><path d="M9 17h6l1 4H8l1-4z"/>' },
  campeonato: { label:'Campeonato',          color:'var(--c-campeonato)', icon:'<path d="M7 3l3 7"/><path d="M17 3l-3 7"/><circle cx="12" cy="15" r="6"/><circle cx="12" cy="15" r="2.2"/>' },
  ranking:    { label:'Ranking & Etapa',     color:'var(--c-ranking)',    icon:'<line x1="5" y1="19" x2="5" y2="13"/><line x1="12" y1="19" x2="12" y2="9"/><line x1="19" y1="19" x2="19" y2="5"/>' },
  natacao:    { label:'Natação & Polo',      color:'var(--c-natacao)',    icon:'<path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>' },
  festival:   { label:'Festival & Feira',    color:'var(--c-festival)',   icon:'<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" fill="currentColor" stroke="none"/>' },
  outros:     { label:'Outras modalidades',  color:'var(--c-outros)',     icon:'<line x1="4" y1="20" x2="20" y2="4"/><ellipse cx="19" cy="5" rx="3" ry="1.6" transform="rotate(45 19 5)"/>' },
};

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

/* ---------------- events dataset (from official 2026 program) ---------------- */
const EV = [
 {m:0,d:'23–25',s:'2026-01-23',e:'2026-01-25',t:'Tour das Ilhas 2026',c:'regata'},
 {m:0,d:'24',s:'2026-01-24',e:'2026-01-24',t:'Desafio 60 Km — Volta à Ilha dos Frades',c:'outros'},
 {m:0,d:'29–31',s:'2026-01-29',e:'2026-01-31',t:'Regata Tour Salvador – Ilhéus',c:'regata'},
 {m:0,d:'31',s:'2026-01-31',e:'2026-01-31',t:'Yacht Fest Cat',c:'festival'},
 {m:0,d:'31',s:'2026-01-31',e:'2026-01-31',t:'Rally dos Mares',c:'outros'},

 {m:1,d:'02',s:'2026-02-02',e:'2026-02-02',t:'Remada de Iemanjá',c:'outros'},
 {m:1,d:'07',s:'2026-02-07',e:'2026-02-07',t:'1ª Etapa — Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:1,d:'21',s:'2026-02-21',e:'2026-02-21',t:'Circuito Volta ao Forte',c:'outros'},
 {m:1,d:'28',s:'2026-02-28',e:'2026-02-28',t:'1º Etapa do Ranking Baiano da Classe HPE 25 – AIC',c:'ranking'},

 {m:2,d:'01',s:'2026-03-01',e:'2026-03-01',t:'1º Etapa do Ranking Baiano da Classe HPE 25 – AIC',c:'ranking'},
 {m:2,d:'06–07',s:'2026-03-06',e:'2026-03-07',t:'Regata Salvador – Morro de São Paulo',c:'regata'},
 {m:2,d:'07–08',s:'2026-03-07',e:'2026-03-08',t:'Copa Flotilha 66',c:'copa'},
 {m:2,d:'14',s:'2026-03-14',e:'2026-03-14',t:'2ª Etapa CBVO 2026',c:'ranking'},
 {m:2,d:'15',s:'2026-03-15',e:'2026-03-15',t:'2ª Etapa — Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:2,d:'21',s:'2026-03-21',e:'2026-03-21',t:'Taça Comodoro Canoagem',c:'copa'},
 {m:2,d:'21–22',s:'2026-03-21',e:'2026-03-22',t:'2º Etapa do Ranking Baiano da Classe HPE 25 – A/C',c:'ranking'},
 {m:2,d:'21–22',s:'2026-03-21',e:'2026-03-22',t:'Taça Comodoro Vela — Baiano da Classe HPE 25',c:'copa'},
 {m:2,d:'28',s:'2026-03-28',e:'2026-03-28',t:'Regata Brancaccio (3ª etapa CBVO)',c:'regata'},
 {m:2,d:'28–29',s:'2026-03-28',e:'2026-03-29',t:'Copa Flotilha Iansã',c:'copa'},

 {m:3,d:'11',s:'2026-04-11',e:'2026-04-11',t:'Regata de Cotegipe',c:'regata'},
 {m:3,d:'11–12',s:'2026-04-11',e:'2026-04-12',t:'Taça Comodoro Canoagem',c:'copa'},
 {m:3,d:'11–12',s:'2026-04-11',e:'2026-04-12',t:'3º Etapa do Ranking Baiano da Classe HPE 25 – AIC',c:'ranking'},
 {m:3,d:'18–19',s:'2026-04-18',e:'2026-04-19',t:'Taça Comodoro Vela',c:'copa'},
 {m:3,d:'25',s:'2026-04-25',e:'2026-04-25',t:'Regata Tour Salvador – Mutá',c:'regata'},
 {m:3,d:'25–26',s:'2026-04-25',e:'2026-04-26',t:'Copa Aniversário',c:'copa'},
 {m:3,d:'25–26',s:'2026-04-25',e:'2026-04-26',t:'Stand Up Paddle — Baía de Todos os Santos',c:'outros'},
 {m:3,d:'26',s:'2026-04-26',e:'2026-04-26',t:'1ª Regata ECSC',c:'regata'},

 {m:4,d:'02',s:'2026-05-02',e:'2026-05-02',t:'Natação — 3ª Etapa Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:4,d:'09',s:'2026-05-09',e:'2026-05-09',t:'Regata das Mães',c:'regata'},
 {m:4,d:'16',s:'2026-05-16',e:'2026-05-16',t:'4ª Copa Vela — Baía de Todos os Santos',c:'copa'},
 {m:4,d:'16–17',s:'2026-05-16',e:'2026-05-17',t:'Copa Aniversário',c:'copa'},
 {m:4,d:'23',s:'2026-05-23',e:'2026-05-23',t:'Circuito Aniversário do Yacht Club',c:'outros'},
 {m:4,d:'30–31',s:'2026-05-30',e:'2026-05-31',t:'Copa Baía de Todos os Santos',c:'copa'},
 {m:4,d:'31',s:'2026-05-31',e:'2026-05-31',t:'Natação — 4ª Etapa Campeonato Baiano de Águas Abertas',c:'natacao'},

 {m:5,d:'04 ou 07',s:'2026-06-04',e:'2026-06-07',t:'Regata Travessia para AIC',c:'regata',tbd:true},
 {m:5,d:'04–06',s:'2026-06-04',e:'2026-06-06',t:'20º Taça Aleixo Belov (Classe HPE 25) e 5º Etapa do Ranking Baiano',c:'copa'},
 {m:5,d:'20',s:'2026-06-20',e:'2026-06-20',t:'6h de Dingue',c:'outros'},

 {m:6,d:'01–02',s:'2026-07-01',e:'2026-07-02',t:'Slalom Snipe Challenge',c:'outros'},
 {m:6,d:'11–12',s:'2026-07-11',e:'2026-07-12',t:'6º Etapa do Ranking Baiano da Classe HPE 25 – A/C',c:'ranking'},
 {m:6,d:'11',s:'2026-07-11',e:'2026-07-11',t:'IV Copa Z6 — Elas / AIC',c:'copa'},
 {m:6,d:'11',s:'2026-07-11',e:'2026-07-11',t:'Festival Náutico Maria Felipa — Vera Cruz',c:'festival'},
 {m:6,d:'11',s:'2026-07-11',e:'2026-07-11',t:'1º Etapa CBVO – FVOBA (Dia 25)',c:'ranking'},
 {m:6,d:'16',s:'2026-07-16',e:'2026-07-16',t:'Natação — 6ª Etapa Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:6,d:'22',s:'2026-07-22',e:'2026-07-22',t:'57ª Regata Aratu – Maragogipe',c:'regata'},
 {m:6,d:'23–26',s:'2026-07-23',e:'2026-07-26',t:'5ª Edição do Barco Show',c:'festival'},
 {m:6,d:'29–30',s:'2026-07-29',e:'2026-07-30',t:'Campeonato Baiano',c:'campeonato'},

 {m:7,d:'01–02',s:'2026-08-01',e:'2026-08-02',t:'7º Etapa do Ranking Baiano da Classe HPE 25',c:'ranking'},
 {m:7,d:'01–02',s:'2026-08-01',e:'2026-08-02',t:'Regata Salvador – Morro de São Paulo',c:'regata'},
 {m:7,d:'07–09',s:'2026-08-07',e:'2026-08-09',t:'Copa Flotilha 66',c:'copa'},
 {m:7,d:'08',s:'2026-08-08',e:'2026-08-08',t:'Copa Dia dos Pais — Canoagem',c:'copa'},
 {m:7,d:'08',s:'2026-08-08',e:'2026-08-08',t:'2ª Etapa — Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:7,d:'08',s:'2026-08-08',e:'2026-08-08',t:'Copa Dia dos Pais — Vela',c:'copa'},
 {m:7,d:'08',s:'2026-08-08',e:'2026-08-08',t:'Regata Marcílio Dias – CPBA',c:'regata'},
 {m:7,d:'15–16',s:'2026-08-15',e:'2026-08-16',t:'Taça Comodoro Canoagem',c:'copa'},
 {m:7,d:'15–16',s:'2026-08-15',e:'2026-08-16',t:'Copa Farol da Barra',c:'copa'},
 {m:7,d:'16',s:'2026-08-16',e:'2026-08-16',t:'Taça Comodoro Vela',c:'copa'},
 {m:7,d:'22',s:'2026-08-22',e:'2026-08-22',t:'Regata Aratu – Maragogipe (57 anos)',c:'regata'},
 {m:7,d:'29–30',s:'2026-08-29',e:'2026-08-30',t:'Desafio 40Km — Canoagem',c:'outros'},
 {m:7,d:'29–30',s:'2026-08-29',e:'2026-08-30',t:'Copa Flotilha Iansã',c:'copa'},
 {m:7,d:'29–30',s:'2026-08-29',e:'2026-08-30',t:'Campeonato Baiano da Classe Dingue',c:'campeonato'},

 {m:8,d:'03',s:'2026-09-03',e:'2026-09-03',t:'Campeonato Náutico Rosa e Vela',c:'campeonato'},
 {m:8,d:'05',s:'2026-09-05',e:'2026-09-05',t:'Regata de Casais – AIC',c:'regata'},
 {m:8,d:'06',s:'2026-09-06',e:'2026-09-06',t:'Natação — 7ª Etapa Campeonato Baiano de Águas Abertas',c:'natacao'},
 {m:8,d:'12–13',s:'2026-09-12',e:'2026-09-13',t:'8º Etapa do Ranking Baiano da Classe HPE 25',c:'ranking'},
 {m:8,d:'16–17',s:'2026-09-16',e:'2026-09-17',t:'Fórum Náutico Internacional ANB',c:'festival'},
 {m:8,d:'19',s:'2026-09-19',e:'2026-09-19',t:'Refeno – CIPE',c:'outros'},
 {m:8,d:'19–20',s:'2026-09-19',e:'2026-09-20',t:'Campeonato Baiano Vela',c:'campeonato'},
 {m:8,d:'26–27',s:'2026-09-26',e:'2026-09-27',t:'Campeonato Baiano Vela',c:'campeonato'},

 {m:9,d:'03–04',s:'2026-10-03',e:'2026-10-04',t:'9º Etapa do Ranking Baiano da Classe HPE 25 – AIC',c:'ranking'},
 {m:9,d:'1ª quinzena',s:'2026-10-01',e:'2026-10-15',t:'1º Festival de Mergulho',c:'festival',tbd:true},
 {m:9,d:'1ª quinzena',s:'2026-10-01',e:'2026-10-15',t:'4ª Copa de Vela — Baía de Todos os Santos',c:'copa',tbd:true},
 {m:9,d:'09–11',s:'2026-10-09',e:'2026-10-11',t:'Campeonato Baiano da Classe Windsurf',c:'campeonato'},
 {m:9,d:'16–18',s:'2026-10-16',e:'2026-10-18',t:'Natação — Circuito Open de Polo Aquático',c:'natacao'},
 {m:9,d:'17',s:'2026-10-17',e:'2026-10-17',t:'Copa Flotilha Albatroz',c:'copa'},
 {m:9,d:'17',s:'2026-10-17',e:'2026-10-17',t:'Regata da Primavera — Santa Cruz',c:'regata'},
 {m:9,d:'17–18',s:'2026-10-17',e:'2026-10-18',t:'Canoa Havaiana — Base Naval',c:'outros'},
 {m:9,d:'23',s:'2026-10-23',e:'2026-10-23',t:'Regata Aniversário do AIC',c:'regata'},
 {m:9,d:'24',s:'2026-10-24',e:'2026-10-24',t:'Regata de Aniversário do AIC',c:'regata'},
 {m:9,d:'24–25',s:'2026-10-24',e:'2026-10-25',t:'Campeonato Baiano',c:'campeonato'},
 {m:9,d:'30',s:'2026-10-30',e:'2026-10-30',t:'Regata Sergipe – Bahia — ICAJU',c:'regata'},
 {m:9,d:'31',s:'2026-10-31',e:'2026-10-31',t:'Campeonato Baiano da Classe HPE 25',c:'campeonato'},

 {m:10,d:'01',s:'2026-11-01',e:'2026-11-01',t:'Regata Sergipe – Bahia — ICAJU',c:'regata'},
 {m:10,d:'01–02',s:'2026-11-01',e:'2026-11-02',t:'Campeonato Baiano da Classe',c:'campeonato'},
 {m:10,d:'07',s:'2026-11-07',e:'2026-11-07',t:'Desafios dos Faróis de Canoagem / Brasileiro de Surfski',c:'outros'},
 {m:10,d:'07–08',s:'2026-11-07',e:'2026-11-08',t:'Copa Farol da Barra',c:'copa'},
 {m:10,d:'1ª quinzena',s:'2026-11-01',e:'2026-11-15',t:'3ª Feira Boat Show',c:'festival',tbd:true},
 {m:10,d:'1ª quinzena',s:'2026-11-01',e:'2026-11-15',t:'VI Salvador Canoagem',c:'outros',tbd:true},
 {m:10,d:'14',s:'2026-11-14',e:'2026-11-14',t:'Natação — TIS',c:'natacao'},
 {m:10,d:'14',s:'2026-11-14',e:'2026-11-14',t:'Regata Aratu – Salinas',c:'regata'},
 {m:10,d:'14',s:'2026-11-14',e:'2026-11-14',t:'Canoa Havaiana — Base Naval',c:'outros'},
 {m:10,d:'14–15',s:'2026-11-14',e:'2026-11-15',t:'Travessia Itaparica – Salvador',c:'outros'},
 {m:10,d:'15',s:'2026-11-15',e:'2026-11-15',t:'Natação — 3ª Etapa',c:'natacao'},
 {m:10,d:'21–22',s:'2026-11-21',e:'2026-11-22',t:'Copa Axé',c:'copa'},
 {m:10,d:'25–29',s:'2026-11-25',e:'2026-11-29',t:'Campeonato Brasileiro de Classe HPE 25 — AIC',c:'campeonato'},
 {m:10,d:'27–29',s:'2026-11-27',e:'2026-11-29',t:'Itaparica Wind / Brasileiro de Windsurf',c:'outros'},
 {m:10,d:'28',s:'2026-11-28',e:'2026-11-28',t:'Copa de Vela de Simões Filho',c:'copa'},

 {m:11,d:'01',s:'2026-12-01',e:'2026-12-01',t:'5ª Regata FCRB/ARS/CRP — Campeonato Baiano de Remo',c:'regata'},
 {m:11,d:'04–05',s:'2026-12-04',e:'2026-12-05',t:'Torneio de Pesca do YCB',c:'festival'},
 {m:11,d:'1ª quinzena',s:'2026-12-01',e:'2026-12-15',t:'2ª Procissão de Nossa Senhora de Guadalupe',c:'outros',tbd:true},
 {m:11,d:'10–12',s:'2026-12-10',e:'2026-12-12',t:'Regata Tour Salvador – Garapuá',c:'regata'},
 {m:11,d:'12',s:'2026-12-12',e:'2026-12-12',t:'Regata de Encerramento',c:'regata'},
 {m:11,d:'12–13',s:'2026-12-12',e:'2026-12-13',t:'Campeonato Baiano Vela',c:'campeonato'},
];

/* ---------------- state ---------------- */
const today = new Date(); today.setHours(0,0,0,0);
let activeCat = null;
let onlyUpcoming = false;
let searchTerm = '';

/* ---------------- helpers ---------------- */
function parseISO(str){ if(!str) return null; const [y,m,d]=str.split('-').map(Number); return new Date(y,m-1,d); }

function status(ev){
  if(ev.tbd && !ev.s) return 'tbd';
  const s = parseISO(ev.s), e = parseISO(ev.e || ev.s);
  if(e && today>e) return 'encerrado';
  if(s && e && today>=s && today<=e) return 'agora';
  if(s && today<s) return 'embreve';
  return 'tbd';
}
function statusLabel(st){
  return {embreve:'Em breve', agora:'Acontecendo agora', encerrado:'Encerrado', tbd:'Data a confirmar'}[st];
}
function fmtWhen(ev){
  return (ev.tbd ? ev.d + ' · ' : ev.d + ' de ') + MESES[ev.m];
}

/* ---------------- build chip filters ---------------- */
const chipRow = document.getElementById('chipRow');
function renderChips(){
  let html = `<button class="chip ${activeCat===null?'active':''}" data-cat="" style="--chip-color:var(--foam-dim)">Todos os eventos</button>`;
  for(const key in CATS){
    const cat = CATS[key];
    html += `<button class="chip ${activeCat===key?'active':''}" data-cat="${key}" style="--chip-color:${cat.color}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg>
      ${cat.label}</button>`;
  }
  chipRow.innerHTML = html;
  chipRow.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const c = btn.dataset.cat;
      activeCat = c === '' ? null : (activeCat===c ? null : c);
      renderChips(); renderAll();
    });
  });
}

/* ---------------- month quick nav ---------------- */
const monthNav = document.getElementById('monthNav');
function renderMonthNav(){
  monthNav.innerHTML = MESES.map((m,i)=>`<a href="#month-${i}" class="${i===today.getMonth()?'now':''}">${m.slice(0,3)}</a>`).join('');
}

/* ---------------- main render ---------------- */
const mainContent = document.getElementById('mainContent');
const emptyState = document.getElementById('emptyState');

function renderAll(){
  let visibleTotal = 0;
  let html = '';
  MESES.forEach((mesName, mi)=>{
    let items = EV.filter(ev=>ev.m===mi);
    if(activeCat) items = items.filter(ev=>ev.c===activeCat);
    if(searchTerm) items = items.filter(ev=>ev.t.toLowerCase().includes(searchTerm));
    if(onlyUpcoming) items = items.filter(ev=>status(ev)!=='encerrado');
    if(items.length===0) return;
    visibleTotal += items.length;

    html += `<section class="month-section" id="month-${mi}">
      <div class="month-head"><span class="idx">${String(mi+1).padStart(2,'0')}</span><h2>${mesName}</h2><div class="rule"></div></div>
      <div class="month-count">${items.length} evento${items.length>1?'s':''}</div>
      <div class="timeline">`;

    items.forEach(ev=>{
      const st = status(ev);
      const cat = CATS[ev.c];
      const isToday = st==='agora';
      const isPast = st==='encerrado';
      html += `<div class="event ${isToday?'today-marker':''} ${isPast?'is-past':''}" style="--dot-color:${cat.color}">
        <div class="event-grid">
          <div class="ev-date">${ev.tbd ? '<span class="tbd">'+ev.d+'</span>' : ev.d}</div>
          <div class="ev-body">
            <div class="ev-title">${ev.t}</div>
            <div class="ev-meta">
              <span class="tag" style="--tag-color:${cat.color}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg>${cat.label}</span>
              <span class="status ${st}">${statusLabel(st)}</span>
            </div>
            ${!isPast ? `<button class="notify-btn" data-title="${ev.t.replace(/"/g,'&quot;')}" data-when="${fmtWhen(ev)}" data-date="${ev.s || ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
              Avisar-me</button>` : ''}
          </div>
        </div>
      </div>`;
    });

    html += `</div></section>`;
  });

  mainContent.innerHTML = html;
  emptyState.classList.toggle('show', visibleTotal===0);

  mainContent.querySelectorAll('.notify-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>openModal(btn.dataset.title, btn.dataset.when, btn.dataset.date));
  });
}

/* ---------------- hero stats ---------------- */
function renderStats(){
  document.getElementById('statTotal').textContent = EV.length;
  document.getElementById('statRegatas').textContent = EV.filter(e=>e.c==='regata').length;
  const upcoming = EV.filter(e=>status(e)!=='encerrado');
  document.getElementById('statRestantes').textContent = upcoming.length;

  const sorted = [...EV].filter(e=>e.s).map(e=>({...e, sd:parseISO(e.s)})).sort((a,b)=>a.sd-b.sd);
  const next = sorted.find(e=> status(e)==='agora' || status(e)==='embreve');
  if(next){
    document.getElementById('nextName').textContent = next.t;
    const days = Math.round((parseISO(next.s)-today)/86400000);
    const when = status(next)==='agora' ? 'Acontecendo agora' : (days<=0 ? 'Começa hoje' : `em ${days} dia${days>1?'s':''} · ${fmtWhen(next)}`);
    document.getElementById('nextWhen').textContent = when;
  } else {
    document.getElementById('nextName').textContent = 'Temporada encerrada';
    document.getElementById('nextWhen').textContent = 'Até 2027!';
  }
}

/* ---------------- modal + toast ---------------- */
const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const modalWhen = document.getElementById('modalWhen');
function openModal(title, when, date){
  modalTitle.textContent = title;
  modalWhen.textContent = when;
  overlay.dataset.eventDate = date || '';
  overlay.classList.add('show');
  contactHint.style.color = '';
  document.getElementById('fName').focus();
}
function closeModal(){ overlay.classList.remove('show'); document.getElementById('notifyForm').reset(); updateContactField(); }
document.getElementById('closeModal').addEventListener('click', closeModal);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

/* dynamic contact field: WhatsApp number vs e-mail address */
const contactLabel = document.getElementById('contactLabel');
const contactInput = document.getElementById('fContact');
const contactHint = document.getElementById('contactHint');
const submitBtn = document.getElementById('submitBtn');
const whatsIcon = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
const mailIcon = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>';

function updateContactField(){
  const val = document.querySelector('input[name="channel"]:checked').value;
  if(val === 'whatsapp'){
    contactLabel.textContent = 'Seu número de WhatsApp';
    contactInput.type = 'tel';
    contactInput.placeholder = '(71) 90000-0000';
    contactHint.textContent = 'Vamos abrir o WhatsApp com o lembrete já escrito — é só apertar enviar.';
    submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${whatsIcon}</svg> Abrir WhatsApp com o lembrete`;
  } else {
    contactLabel.textContent = 'Seu e-mail';
    contactInput.type = 'email';
    contactInput.placeholder = 'voce@email.com';
    contactHint.textContent = 'Vamos abrir seu aplicativo de e-mail com o lembrete já escrito — é só apertar enviar.';
    submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${mailIcon}</svg> Abrir e-mail com o lembrete`;
  }
}
document.querySelectorAll('input[name="channel"]').forEach(r=>r.addEventListener('change', updateContactField));
updateContactField();

document.getElementById('notifyForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const channel = document.querySelector('input[name="channel"]:checked').value;
  const contact = contactInput.value.trim();
  const name = document.getElementById('fName').value.trim();
  const title = modalTitle.textContent;
  const when = modalWhen.textContent;
  const date = overlay.dataset.eventDate || '';

  if(channel === 'whatsapp'){
    const digits = contact.replace(/\D/g,'');
    if(digits.length < 10){ contactInput.focus(); contactHint.textContent = 'Digite um número válido, com DDD.'; contactHint.style.color = 'var(--coral)'; return; }
  }

  const originalBtn = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Enviando…';

  try{
    const res = await fetch('/.netlify/functions/subscribe', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, channel, contact, eventTitle:title, eventWhen:when, eventDate:date, website: document.getElementById('website').value })
    });

    if(res.status === 429){
      closeModal();
      showToast('Muitas tentativas', 'Você já pediu vários alertas recentemente. Aguarde um pouco e tente de novo.');
      submitBtn.disabled = false;
      updateContactField();
      return;
    }
    if(!res.ok) throw new Error('api-error');

    closeModal();
    showToast('Alerta ativado ✔', channel==='whatsapp'
      ? `Enviamos uma confirmação para o seu WhatsApp. Vamos te lembrar de novo perto de "${title}".`
      : `Enviamos uma confirmação para o seu e-mail. Vamos te lembrar de novo perto de "${title}".`);
  } catch(err){
    // A function de notificação ainda não está publicada/configurada nesta instância —
    // usamos o envio local (abre WhatsApp/e-mail do usuário) como alternativa imediata.
    sendViaClientFallback(channel, contact, title, when);
    closeModal();
  } finally{
    submitBtn.disabled = false;
    updateContactField();
  }
});

function sendViaClientFallback(channel, contact, title, when){
  const msg = `Lembrete náutico: ${title}\nQuando: ${when}\nCalendário de Eventos Náuticos 2026 - Secretaria Especial do Mar, Salvador.`;
  if(channel === 'whatsapp'){
    const digits = contact.replace(/\D/g,'');
    const phone = digits.length <= 11 ? '55' + digits : digits;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Servidor de notificações indisponível', 'Abrimos o WhatsApp no seu aparelho como alternativa — envie por lá.');
  } else {
    window.location.href = `mailto:${contact}?subject=${encodeURIComponent('Lembrete: '+title)}&body=${encodeURIComponent(msg)}`;
    showToast('Servidor de notificações indisponível', 'Abrimos seu app de e-mail como alternativa — envie por lá.');
  }
}

function showToast(title, msg){
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<b>${title}</b>${msg}`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='.3s'; setTimeout(()=>t.remove(),300); }, 4200);
}

/* ---------------- search / toggle ---------------- */
document.getElementById('searchInput').addEventListener('input', e=>{
  searchTerm = e.target.value.trim().toLowerCase();
  renderAll();
});
document.getElementById('onlyUpcoming').addEventListener('change', e=>{
  onlyUpcoming = e.target.checked;
  renderAll();
});

/* ---------------- top button ---------------- */
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', ()=>{ topBtn.classList.toggle('show', window.scrollY>600); });
topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ---------------- clock ---------------- */
document.getElementById('clockDate').textContent = today.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'}).toUpperCase();

/* ---------------- init ---------------- */
async function loadLiveEvents(){
  try{
    const res = await fetch('/.netlify/functions/get-events');
    if(!res.ok) throw new Error('sem dados ao vivo');
    const data = await res.json();
    if(Array.isArray(data.events) && data.events.length > 0){
      EV = data.events;
    }
  } catch(err){
    // função ainda não publicada/configurada nesta instância — segue com os dados fixos acima
    console.warn('Usando calendário local (get-events indisponível):', err.message);
  }
}

(async function init(){
  await loadLiveEvents();
  renderChips();
  renderMonthNav();
  renderStats();
  renderAll();
})();