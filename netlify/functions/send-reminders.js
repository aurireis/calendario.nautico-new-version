// netlify/functions/send-reminders.js
//
// Scheduled Function (roda 1x por dia, ver netlify.toml).
// Lê todas as inscrições salvas por subscribe.js e manda o lembrete
// para quem tem evento no dia seguinte. Depois marca como enviado
// e limpa inscrições de eventos já bem passados.

const nodemailer = require('nodemailer');
const { getStore } = require('@netlify/blobs');

function buildTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

exports.handler = async () => {
  const store = getStore({
    name: 'nautico-subscriptions',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_API_TOKEN
  });
  
  const { blobs } = await store.list();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const transporter = buildTransporter();
  let sentCount = 0;

  for (const b of blobs) {
    const sub = await store.get(b.key, { type: 'json' });
    if (!sub || sub.sent || !sub.eventDate) continue;

    const eventDate = new Date(`${sub.eventDate}T00:00:00`);
    const diffDays = Math.round((eventDate - today) / 86400000);

    // manda o lembrete exatamente 1 dia antes do evento
    if (diffDays === 1) {
      const message = `📅 Lembrete: "${sub.eventTitle}" é amanhã (${sub.eventWhen})! ` +
        `Calendário de Eventos Náuticos 2026 — Secretaria Especial do Mar, Salvador.`;
      
      try {
        // Envio exclusivo por e-mail
        if (sub.channel === 'email') {
          await transporter.sendMail({
            from: `"Calendário Náutico 2026" <${process.env.GMAIL_USER}>`,
            to: sub.contact,
            subject: `Amanhã: ${sub.eventTitle}`,
            text: message,
          });
          
          // Marca como enviado apenas após o sucesso do e-mail
          await store.setJSON(b.key, { ...sub, sent: true });
          sentCount++;
        }
      } catch (err) {
        console.error('Falha ao enviar lembrete para', b.key, err);
      }
    }

    // remove inscrições de eventos encerrados há mais de 3 dias (limpeza)
    if (diffDays < -3) {
      await store.delete(b.key);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, sent: sentCount }) };
};