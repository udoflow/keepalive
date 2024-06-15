const Koa = require('koa');
const axios = require('axios');

const app = new Koa();
const timer = {};

let endpoints = [];
try {
  endpoints = JSON.parse(process.env.ENDPOINTS);
} catch (e) {
  console.error('Failed to parse ENDPOINTS env var:', e);
  process.exit(1);
}

if (!Array.isArray(endpoints) || endpoints.some(e => typeof e !== 'string')) {
  console.error('ENDPOINTS env var must be a stringified JSON list of strings');
  process.exit(1);
}

app.use(async (ctx, next) => {
  console.log('got')
  await next();

  // Set a timer to send empty requests to each endpoint 9 minutes later
  timer[ctx.request.ip] = setTimeout(async() => {
    await Promise.all(endpoints.forEach(endpoint => axios.get(endpoint)))
    console.log('sent')
  }, 9 * 60 * 1000); // 9 minutes
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});