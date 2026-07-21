const { blobStore } = require('./_store');
// netlify/functions/subscribe.js
//
// Recebe a inscrição feita no modal "Avisar-me", grava num Netlify Blob
// (para o lembrete automático de véspera, disparado por send-reminders.js)
// e manda uma confirmação IMEDIATA por e-mail (Gmail SMTP via Nodemailer)
//
// Variáveis de ambiente necessárias (Netlify > Site settings > Environment variables):
//   GMAIL_USER             -> o e-mail do Gmail que vai disparar as mensagens
//   GMAIL_APP_PASSWORD     -> a SENHA DE APP gerada em myaccount.google.com/apppasswords
//                             (NÃO é a senha normal da conta — precisa ter a verificação
//                             em 2 etapas ativada pra gerar essa senha de app)

const nodemailer = require('nodemailer');

const store = blobStore('nautico-subscriptions');
const { sanitizeText, isValidEmail, isValidISODate, clientIp, checkRateLimit } = require('./_security');

function buildTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
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

  // honeypot: campo invisível que só um robô preencheria
  if (payload.website) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const name = sanitizeText(payload.name, 100);
  const channel = 'email'; // Forçado para e-mail, WhatsApp removido
  const contact = sanitizeText(payload.contact, 200);
  const eventTitle = sanitizeText(payload.eventTitle, 200);
  const eventWhen = sanitizeText(payload.eventWhen, 100);
  const eventDate = isValidISODate(payload.eventDate) ? payload.eventDate : null;

  if (!name || !contact || !eventTitle) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Dados incompletos.' }) };
  }
  
  if (!isValidEmail(contact)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'E-mail inválido.' }) };
  }

  // rate limit: por contato (evita spamar a mesma pessoa) e por IP (evita bot em massa)
  const okContact = await checkRateLimit(`contact:${contact.toLowerCase()}`, 5, 60 * 60 * 1000);
  const okIp = await checkRateLimit(`ip:${clientIp(event)}`, 20, 60 * 60 * 1000);
  if (!okContact || !okIp) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Muitas solicitações. Tente novamente mais tarde.' }) };
  }

  const confirmMsg = `Olá, ${name}! Seu alerta para "${eventTitle}" (${eventWhen}) foi ativado. ` +
    `Vamos te avisar de novo perto da data. — Calendário de Eventos Náuticos 2026, Secretaria Especial do Mar.`;

  try {
    // 1) envia a confirmação imediata
    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"Calendário Náutico 2026" <${process.env.GMAIL_USER}>`,
      to: contact,
      subject: `Alerta ativado: ${eventTitle}`,
      text: confirmMsg,
    });

    // 2) guarda a inscrição para o lembrete automático de véspera (se a data do evento é conhecida)
    if (eventDate) {
      const store = blobStore('nautico-subscriptions');
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await store.setJSON(id, {
        name, channel, contact, eventTitle, eventWhen, eventDate,
        sent: false,
        createdAt: new Date().toISOString(),
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Erro ao notificar:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Falha ao enviar a notificação.' }) };
  }
};