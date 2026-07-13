// netlify/functions/admin.js
//
// Endpoint PROTEGIDO usado só pelo dashboard.html. Toda requisição precisa
// mandar a senha certa no corpo (campo "password"), comparada com a
// variável de ambiente ADMIN_PASSWORD.
//
// Variável de ambiente necessária:
//   ADMIN_PASSWORD -> senha escolhida por vocês para acessar o dashboard
//                      (defina em Netlify > Site settings > Environment variables)
//
// Ações suportadas (campo "action" no corpo JSON):
//   "login"               -> só valida a senha
//   "list-events"         -> devolve todos os eventos
//   "save-event"          -> cria (sem id) ou atualiza (com id) um evento
//   "delete-event"        -> remove um evento pelo id
//   "list-subscriptions"  -> devolve todas as inscrições de lembrete + estatísticas
//   "delete-subscription" -> remove uma inscrição pelo key
//
// Proteções aplicadas aqui:
//   - limite de tentativas: no máximo 8 tentativas de senha por IP a cada
//     15 minutos, pra dificultar um ataque de força bruta contra ADMIN_PASSWORD
//   - comparação de senha em tempo constante (evita ataques de timing)
//   - todo evento salvo passa por validação de mês/categoria/data antes de
//     ir pro banco, mesmo vindo de quem já está autenticado (defesa em
//     profundidade — um admin comprometido não consegue gravar lixo/HTML
//     bruto no banco que alimenta o site público)

const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');
const { sanitizeText, isValidISODate, clientIp, checkRateLimit } = require('./_security');

const VALID_CATS = ['regata', 'copa', 'campeonato', 'ranking', 'natacao', 'festival', 'outros'];

function unauthorized(msg) {
  return { statusCode: 401, body: JSON.stringify({ error: msg || 'Senha incorreta.' }) };
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido.' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido.' }) };
  }

  const { password, action } = payload;

  if (!process.env.ADMIN_PASSWORD) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ADMIN_PASSWORD não configurada no servidor.' }) };
  }

  // limita tentativas de senha por IP, antes mesmo de checar se ela está certa
  const ip = clientIp(event);
  const withinLimit = await checkRateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
  if (!withinLimit) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }) };
  }

  if (!password || !timingSafeEqual(password, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  try {
    if (action === 'login') {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'list-events') {
      const store = getStore('nautico-events');
      const data = (await store.get('all', { type: 'json' })) || [];
      return { statusCode: 200, body: JSON.stringify({ events: data }) };
    }

    if (action === 'save-event') {
      const store = getStore('nautico-events');
      const data = (await store.get('all', { type: 'json' })) || [];
      const raw = payload.event || {};

      const month = Number(raw.m);
      const cat = raw.c;
      const title = sanitizeText(raw.t, 200);
      const dateLabel = sanitizeText(raw.d, 40);

      if (!Number.isInteger(month) || month < 0 || month > 11) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Mês inválido.' }) };
      }
      if (!VALID_CATS.includes(cat)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Categoria inválida.' }) };
      }
      if (!title) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Título do evento é obrigatório.' }) };
      }
      if (!isValidISODate(raw.s) || !isValidISODate(raw.e)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Data inválida (use o formato AAAA-MM-DD).' }) };
      }

      const incoming = {
        id: raw.id || undefined,
        m: month,
        c: cat,
        t: title,
        d: dateLabel || '—',
        s: raw.s || null,
        e: raw.e || raw.s || null,
        tbd: !!raw.tbd,
      };

      if (incoming.id) {
        const idx = data.findIndex(e => e.id === incoming.id);
        if (idx === -1) return { statusCode: 404, body: JSON.stringify({ error: 'Evento não encontrado.' }) };
        data[idx] = { ...data[idx], ...incoming };
      } else {
        incoming.id = `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        data.push(incoming);
      }

      await store.setJSON('all', data);
      return { statusCode: 200, body: JSON.stringify({ ok: true, events: data }) };
    }

    if (action === 'delete-event') {
      const store = getStore('nautico-events');
      const data = (await store.get('all', { type: 'json' })) || [];
      const filtered = data.filter(e => e.id !== payload.id);
      await store.setJSON('all', filtered);
      return { statusCode: 200, body: JSON.stringify({ ok: true, events: filtered }) };
    }

    if (action === 'list-subscriptions') {
      const store = getStore('nautico-subscriptions');
      const { blobs } = await store.list();
      const subs = [];
      for (const b of blobs) {
        const sub = await store.get(b.key, { type: 'json' });
        if (sub) subs.push({ key: b.key, ...sub });
      }
      subs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      const stats = {
        total: subs.length,
        email: subs.filter(s => s.channel === 'email').length,
        whatsapp: subs.filter(s => s.channel === 'whatsapp').length,
        pendentes: subs.filter(s => !s.sent).length,
      };
      return { statusCode: 200, body: JSON.stringify({ subscriptions: subs, stats }) };
    }

    if (action === 'delete-subscription') {
      const store = getStore('nautico-subscriptions');
      await store.delete(payload.key);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Ação desconhecida.' }) };
  } catch (err) {
    console.error('Erro no admin:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Falha ao processar a solicitação.' }) };
  }
};
