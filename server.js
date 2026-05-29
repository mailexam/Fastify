require('dotenv').config();

const Fastify = require('fastify');
const { sendTest } = require('./mail');

const host = process.env.HTTP_HOST || '127.0.0.1';
const port = Number(process.env.HTTP_PORT || 3000);

const app = Fastify({ logger: true });

app.post('/mail/test', async (request) => {
  const { to, subject, text } = request.body ?? {};

  await sendTest({ to, subject, text });

  return { status: 'ok' };
});

app.setErrorHandler((err, request, reply) => {
  request.log.error(err);
  reply.status(500).send({ error: err.message });
});

const start = async () => {
  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
