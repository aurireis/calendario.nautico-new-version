console.log("TESTE: A função iniciou!");
const { getStore } = require('@netlify/blobs');
// netlify/functions/subscribe.js
//
// Recebe a inscrição feita no modal "Avisar-me", grava num Netlify Blob
// (para o lembrete automático de véspera, disparado por send-reminders.js)
// e manda uma confirmação IMEDIATA por e-mail (Gmail SMTP via Nodemailer)
// ou WhatsApp (Twilio).
//
// Variáveis de ambiente necessárias (Netlify > Site settings > Environment variables):
//   GMAIL_USER             -> o e-mail do Gmail que vai disparar as mensagens
//   GMAIL_APP_PASSWORD     -> a SENHA DE APP gerada em myaccount.google.com/apppasswords
//                             (NÃO é a senha normal da conta — precisa ter a verificação
//                             em 2 etapas ativada pra gerar essa senha de app)

//
// Proteções aplicadas aqui (importante ler se for alterar este arquivo):
//   - todo texto vindo do visitante passa por sanitizeText() antes de ser usado
//     em qualquer lugar (evita injeção de cabeçalho de e-mail e payloads gigantes)
//   - e-mail e telefone são validados por formato antes de disparar qualquer envio
//   - rate limit por contato: no máximo 5 pedidos de alerta por hora para o
//     mesmo e-mail/telefone, e 20 por hora por IP — impede que alguém abuse
//     do formulário público pra transformar sua conta Gmail/Twilio num
//     disparador de spam em massa
//   - campo "website" é um honeypot: bots que preenchem campos escondidos
//     automaticamente caem nele; humanos nunca veem nem preenchem esse campo

const nodemailer = require('nodemailer');
const twilio = require('twilio');

const store = getStore({
  name: 'nautico-subscriptions',
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_API_TOKEN
});
const { sanitizeText, isValidEmail, isValidBrPhoneDigits, isValidISODate, clientIp, checkRateLimit } = require('./_security');

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
  const channel = payload.channel;
  const contact = sanitizeText(payload.contact, 200);
  const eventTitle = sanitizeText(payload.eventTitle, 200);
  const eventWhen = sanitizeText(payload.eventWhen, 100);
  const eventDate = isValidISODate(payload.eventDate) ? payload.eventDate : null;

  if (!name || !contact || !channel || !eventTitle) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Dados incompletos.' }) };
  }
  if (channel !== 'email' && channel !== 'whatsapp') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Canal inválido.' }) };
  }
  if (channel === 'email' && !isValidEmail(contact)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'E-mail inválido.' }) };
  }
  if (channel === 'whatsapp' && !isValidBrPhoneDigits(contact)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Número de WhatsApp inválido.' }) };
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
    if (channel === 'email') {
      const transporter = buildTransporter();
      await transporter.sendMail({
        from: `"Calendário Náutico 2026" <${process.env.GMAIL_USER}>`,
        to: contact,
        subject: `Alerta ativado: ${eventTitle}`,
        text: confirmMsg,
      });
    } else {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const digits = contact.replace(/\D/g, '');
      const phone = digits.length <= 11 ? `55${digits}` : digits; // assume Brasil se vier sem DDI
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:+${phone}`,
        body: confirmMsg,
      });
    }

    // 2) guarda a inscrição para o lembrete automático de véspera (se a data do evento é conhecida)
    if (eventDate) {
      const store = getStore({
        name: 'nautico-subscriptions',
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_API_TOKEN
      });
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
