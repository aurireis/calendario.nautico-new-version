# Calendário de Eventos Náuticos 2026 — notificações via Gmail (SMTP) e WhatsApp

Este pacote tem o site (`index.html` + `styles/` + `scripts/` + `assets/`) e
duas Netlify Functions que enviam a notificação de verdade quando alguém
clica em "Avisar-me":

- `netlify/functions/subscribe.js` → dispara a confirmação na hora (e-mail
  pelo Gmail via SMTP, WhatsApp via Twilio) e guarda a inscrição.
- `netlify/functions/send-reminders.js` → roda 1x por dia sozinha e manda um
  lembrete pra quem tem evento no dia seguinte.

**Eu não tenho como gerar sua senha de app nem mexer na sua conta Google
por você** — isso só pode ser feito por quem tem acesso à conta. Segue o
passo a passo.

## 1. Ativar a verificação em 2 etapas na conta Gmail que vai enviar os e-mails

Senha de app só existe se a verificação em 2 etapas estiver ligada:
https://myaccount.google.com/security → "Verificação em duas etapas" → ativar.

## 2. Gerar a senha de app

1. Acesse https://myaccount.google.com/apppasswords (login na conta que vai
   enviar os e-mails)
2. Dê um nome, ex: "Calendário Náutico"
3. O Google mostra uma senha de 16 letras (tipo `abcd efgh ijkl mnop`) —
   **copie ela na hora**, o Google não mostra de novo depois.
4. **Não cole essa senha no chat comigo nem em nenhum lugar público.** Ela
   vai direto no painel do Netlify, no passo 4 abaixo.

## 3. Publicar no Netlify

Suba esta pasta inteira (não só o `index.html`) pro Netlify — arrastando a
pasta no painel, ou conectando um repositório Git. O `netlify.toml` já diz
pro Netlify onde estão as functions e agenda o lembrete diário.

## 4. Configurar as variáveis de ambiente no Netlify

No painel do site: **Site settings → Environment variables**, adicione:

| Nome                    | Valor                                          |
|-------------------------|-------------------------------------------------|
| `GMAIL_USER`            | o e-mail Gmail que vai enviar (ex: `avisos@gmail.com`) |
| `GMAIL_APP_PASSWORD`    | a senha de app de 16 letras gerada no passo 2   |
| `TWILIO_ACCOUNT_SID`    | do painel da Twilio (WhatsApp)                  |
| `TWILIO_AUTH_TOKEN`     | do painel da Twilio                             |
| `TWILIO_WHATSAPP_FROM`  | ex: `whatsapp:+14155238886`                     |
| `NETLIFY_SITE_ID`       | ID do site no Netlify (necessário fora do runtime padrão) |
| `NETLIFY_BLOBS_TOKEN`   | token dedicado com escopo mínimo para Netlify Blobs |

Depois é só clicar em **Deploy** de novo pra aplicar. Se por enquanto vocês
só quiserem e-mail funcionando, pode deixar as 3 variáveis do Twilio de
fora — a parte de e-mail funciona sozinha.

Se existir `NETLIFY_API_TOKEN` legado no ambiente, ele é usado apenas como
fallback. O recomendado é manter somente `NETLIFY_BLOBS_TOKEN`.

## 5. Testar

Abra o site publicado (não o arquivo local — as functions só rodam depois
de publicadas no Netlify), clique em "Avisar-me" num evento, escolha
"E-mail", preencha e envie. Se `GMAIL_USER`/`GMAIL_APP_PASSWORD` estiverem
certos, o e-mail chega em segundos, geralmente na Caixa de Entrada
(verifique a aba "Promoções"/Spam na primeira vez).

Se algo estiver faltando ou errado, o site não trava: ele automaticamente
volta pro modo alternativo (abre o app de e-mail ou o WhatsApp Web do
próprio visitante com a mensagem pronta), então a função de "avisar-me"
nunca fica quebrada pro usuário final.

## Limites do Gmail (importante saber)

Uma conta Gmail comum tem limite de cerca de **500 e-mails por dia** via
SMTP. Para um calendário de eventos isso costuma ser mais que suficiente,
mas se o volume crescer bastante vale migrar pra um serviço dedicado de
envio (Resend, SendGrid, Amazon SES) — a estrutura do código já separa bem
essa parte (`buildTransporter()` em `subscribe.js`), então trocar depois é
uma mudança pequena.

## Segurança — o que foi reforçado

- **XSS corrigido (dashboard e site público)**: valores vindos do backend e do
  formulário público agora passam por escape antes de entrar via `innerHTML`,
  impedindo execução de HTML/JS injetado tanto no painel quanto no site aberto.
- **Validação de entrada**: e-mail e telefone são validados por formato antes
  de qualquer envio; textos são limpos de quebras de linha/caracteres de
  controle (evita injeção de cabeçalho de e-mail) e truncados a um tamanho
  máximo.
- **Rate limiting resistente a concorrência**: cada requisição gera um registro
  próprio no Blob (sem contador compartilhado get→set), reduzindo bypass por
  corrida em chamadas paralelas. Limites: 5 pedidos/h por contato, 20/h por IP
  e 8 tentativas de login/15 min por IP.
- **Honeypot**: um campo invisível no formulário público captura robôs
  simples sem precisar de captcha visível.
- **Comparação de senha em tempo constante** no dashboard (evita ataques de
  timing para descobrir a senha por tentativa e erro).
- **Validação no backend também para o admin**: mesmo autenticado, um evento
  salvo passa por checagem de mês/categoria/formato de data — defesa em
  profundidade.
- **Cabeçalhos HTTP de segurança** (`netlify.toml`): `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Content-Security-Policy`, `Strict-Transport-Security`, e `noindex` +
  `no-store` específicos pro dashboard.
- **Segredos nunca no código**: já coberto antes — tudo via variável de
  ambiente, `.gitignore` protegendo qualquer `.env` local.

## Sobre o lembrete de véspera

`send-reminders.js` roda uma vez por dia (agendado no `netlify.toml`) e
verifica, entre todas as inscrições guardadas, quem tem evento amanhã —
e manda o lembrete automaticamente, sem precisar de mais nenhuma ação sua.

## Dashboard administrativo (`/dashboard.html`)

Depois de publicado, o painel fica em `https://seu-site.netlify.app/dashboard.html`.
Por ele dá pra:

- Ver estatísticas gerais (eventos cadastrados, inscrições de lembrete, etc.)
- **Adicionar, editar e excluir eventos** do calendário — sem mexer em código
- Ver e remover as inscrições de lembrete (quem pediu pra ser avisado de quê)

O acesso é protegido por senha. Adicione mais esta variável de ambiente no
Netlify (mesmo lugar das outras):

| Nome              | Valor                                      |
|-------------------|---------------------------------------------|
| `ADMIN_PASSWORD`  | uma senha forte, só de vocês, pro dashboard  |

**Importante:**
- O dashboard tem a tag `<meta name="robots" content="noindex, nofollow">`
  pra não aparecer em buscas do Google, mas a URL não é secreta por si só —
  quem souber o link chega na tela de login. A senha é a única proteção.
- Assim que o site vira "dinâmico" (eventos vindo do Blob via dashboard),
  o `scripts/scripts.js` do site público tenta buscar os eventos mais
  recentes automaticamente; se a function não estiver disponível por
  qualquer motivo, ele cai de volta na lista fixa que já vem no arquivo,
  então o site nunca fica com a tela em branco.
