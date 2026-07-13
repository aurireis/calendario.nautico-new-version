// netlify/functions/get-events.js
//
// Endpoint PÚBLICO (sem senha) que devolve a lista de eventos em JSON.
// Usado pelo site (scripts.js) e pelo dashboard. Na primeira execução em
// produção, se o Blob "nautico-events" ainda estiver vazio, ele é semeado
// com os dados de _events-seed.js.

const { getStore } = require('@netlify/blobs');
const { EV: SEED_EVENTS, MESES } = require('./_events-seed');

exports.handler = async () => {
  try {
    const store = getStore('nautico-events');
    let data = await store.get('all', { type: 'json' });

    if (!data || !Array.isArray(data) || data.length === 0) {
      // primeira execução: semeia o Blob com os dados iniciais
      data = SEED_EVENTS.map((ev, i) => ({ id: `seed-${i}`, ...ev }));
      await store.setJSON('all', data);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ events: data, meses: MESES }),
    };
  } catch (err) {
    console.error('Erro ao buscar eventos:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Falha ao carregar eventos.' }) };
  }
};
