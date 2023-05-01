// import {
//   createClient,
//   Context,
//   Router,
//   Application,
//   oakCors,
//   green,
// } from './deps.ts';
// import { create } from 'supabase';
import { green } from 'fmt/colors.ts';
import { createClient } from 'supabase';
import { Context, Router, Application } from 'oak';
import { oakCors } from 'cors';
import { Database } from './supabase.ts';
import 'https://deno.land/std@0.185.0/dotenv/load.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_KEY');

if (supabaseUrl === undefined) {
  throw new Error(
    'Supabase URL could not be loaded from environment variables.'
  );
}

if (supabaseKey === undefined) {
  throw new Error(
    'Supabase key could not be loaded from environment variables.'
  );
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function getAllScores(context: Context) {
  const { data, error } = await supabase.from('score').select('*');

  console.log(error);

  context.response.body = data;
}

async function addScore(context: Context) {
  const { name, score } = await context.request.body().value;

  const { error } = await supabase
    .from('score')
    .insert([{ name: name, score: score }]);

  console.log({ error });

  context.response.status = 201;
}

const router = new Router();
router.get('/', (context) => {
  context.response.body = 'Hello, World!';
});

router.get('/score', getAllScores);
router.post('/score', addScore);

const app = new Application();
app.use(oakCors());
app.use(async (context, next) => {
  await next();
  const { method, url } = context.request;
  const logMessage = green(`${method} ${url}`);
  console.log(logMessage);
});
app.use(router.routes());

const port = Number(Deno.env.get('PORT'));

if (isNaN(port)) {
  throw new Error('Port environment variable is not a number!');
}

console.log(`Running server on port ${port}...`);
await app.listen({
  port: Number(port),
});
