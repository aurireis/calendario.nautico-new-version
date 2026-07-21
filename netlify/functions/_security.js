// netlify/functions/_security.js
//
// Helpers de segurança usados pelas outras functions:
// - validação/sanitização de entrada (evita injeção de cabeçalho de e-mail,
//   payloads gigantes, e-mails/telefones inválidos)
// - limitador de taxa (rate limit) baseado em Netlify Blobs, pra impedir que
//   alguém use o formulário público como disparador de spam em massa
//   (o que estouraria a cota do Gmail e/ou os créditos da Twilio)

const { blobStore } = require('./_store');

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

// remove quebras de linha e caracteres de controle — impede injeção de
// cabeçalhos (ex: "vitima@x.com\nBcc: lista@spam.com") em campos usados
// em e-mails, e limita o tamanho pra evitar payloads abusivos
function sanitizeText(input, maxLen = 200) {
  return String(input ?? '')
    .replace(/[\r\n\t\0]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(str) {
  return EMAIL_RE.test(String(str || '').trim()) && str.length <= 200;
}

function isValidBrPhoneDigits(str) {
  const digits = String(str || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function isValidISODate(str) {
  return !str || /^\d{4}-\d{2}-\d{2}$/.test(str);
}

// pega o IP do visitante nos headers que a Netlify costuma repassar
function clientIp(event) {
  const h = event.headers || {};
  return h['x-nf-client-connection-ip'] || h['client-ip'] || (h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

// Limitador de taxa simples: no máximo `limit` ações por `windowMs` para a
// mesma `key` (ex: mesmo e-mail, mesmo IP). Retorna true se DENTRO do
// limite (ação permitida), false se estourou.
async function checkRateLimit(key, limit, windowMs) {
  const store = blobStore('nautico-ratelimit');
  const safePrefix = 'rl-' + Buffer.from(key).toString('base64url').slice(0, 120);
  const now = Date.now();
  const cutoff = now - windowMs;
  const requestKey = `${safePrefix}:${now}:${Math.random().toString(36).slice(2, 8)}`;

  // Marca cada requisição com chave única para não perder incrementos em paralelo.
  await store.set(requestKey, String(now));

  const { blobs } = await store.list({ prefix: `${safePrefix}:` });
  let count = 0;

  for (const blob of blobs) {
    const parts = blob.key.split(':');
    const ts = Number(parts[1]);
    if (Number.isFinite(ts) && ts >= cutoff) {
      count += 1;
      continue;
    }

    // Limpeza oportunista: não falha a requisição se apagar item antigo der erro.
    try {
      await store.delete(blob.key);
    } catch {
      // noop
    }
  }

  return count <= limit;
}

module.exports = { sanitizeText, isValidEmail, isValidBrPhoneDigits, isValidISODate, clientIp, checkRateLimit };
