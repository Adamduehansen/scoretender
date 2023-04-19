import {
  Application,
  Context,
  Router,
} from 'https://deno.land/x/oak@v12.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { load } from 'https://deno.land/std@0.184.0/dotenv/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0';
import { Database } from './supabase.ts';

const configData = await load();

const supabaseUrl = configData['SUPABASE_URL'];
const supabaseKey = configData['SUPABASE_KEY'];

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function getAllScores(context: Context) {
  const { data, error } = await supabase.from('score').select('*');
  console.log(data);
  console.log(error);

  context.response.body = data;
}

async function addScore(context: Context) {
  const { name, score } = await context.request.body().value;

  const { data, error } = await supabase
    .from('score')
    .insert([{ name: name, score: score }]);

  console.log(data);
  console.log(error);

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
app.use(router.routes());

const port = Number(configData['PORT']);

if (isNaN(port)) {
  throw new Error('Port environment variable is not a number!');
}

console.log(`Running server on port ${port}...`);
await app.listen({
  port: Number(port),
});
