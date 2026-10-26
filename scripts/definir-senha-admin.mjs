// Define uma nova senha para um usuário do Supabase Auth (ex.: o administrador do painel).
// A senha é digitada aqui, sem aparecer na tela, e vai direto para o Supabase: não fica em arquivo nem no histórico.
// Uso (na raiz do projeto): pnpm admin:senha admin@exemplo.com.br   (ou o nome de usuário, ex.: nome.do.usuario)
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { parseEnv } from 'node:util';
import { createClient } from '@supabase/supabase-js';

// Lê só o .env.local deste projeto: variáveis já exportadas no terminal (de outro projeto ou ambiente) não valem aqui,
// para a senha não ser trocada no Supabase errado
let env;
try {
  env = parseEnv(readFileSync(new URL('../.env.local', import.meta.url), 'utf8'));
} catch {
  console.error('Não foi possível ler o .env.local na raiz do projeto.');
  process.exit(1);
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env.local.');
  process.exit(1);
}

const identifier = (process.argv[2] || '').trim().toLowerCase();
if (!identifier) {
  console.error('Informe o e-mail ou o nome de usuário. Ex.: pnpm admin:senha admin@exemplo.com.br');
  process.exit(1);
}

let projectHost;
try {
  projectHost = new URL(url).host;
} catch {
  console.error('NEXT_PUBLIC_SUPABASE_URL do .env.local não é uma URL válida.');
  process.exit(1);
}
console.log(`Projeto Supabase: ${projectHost}`);

function ask(prompt, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: Boolean(process.stdin.isTTY) });
    let answered = false;
    // A pergunta é escrita antes de silenciar: silenciar tudo também apagava a pergunta (o readline redesenha a linha)
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
    };
    // Ctrl+C / Ctrl+D: sai com aviso claro em vez de deixar a pergunta pendente
    rl.on('SIGINT', () => {
      process.stdout.write('\nCancelado. Nada foi alterado.\n');
      process.exit(130);
    });
    rl.on('close', () => {
      if (answered) return;
      process.stdout.write('\nEntrada encerrada antes da resposta. Nada foi alterado.\n');
      process.exit(1);
    });
    rl.question(prompt, (answer) => {
      answered = true;
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
    muted = hidden; // daqui em diante o que é digitado não aparece
  });
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

// O login aceita e-mail ou app_metadata.username (mesma regra de app/api/admin/auth/route.ts)
let user = null;
for (let page = 1; page <= 10 && !user; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error('Não foi possível listar os usuários:', error.message);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.toLowerCase() === identifier || String(u.app_metadata?.username ?? '').toLowerCase() === identifier) ?? null;
  if (data.users.length < 200) break;
}
if (!user) {
  console.error(`Nenhum usuário com o e-mail ou nome de usuário "${identifier}".`);
  process.exit(1);
}

console.log(`Usuário: ${user.email}${user.app_metadata?.username ? ` (usuário: ${user.app_metadata.username})` : ''}, papel: ${user.app_metadata?.role ?? 'nenhum'}`);
if (user.app_metadata?.role !== 'admin') console.log('Atenção: esta conta não tem papel de administrador; o painel vai recusar o login.');

const password = await ask('Nova senha (não aparece enquanto digita; tecle Enter no fim): ', true);
if (password.length < 8 || password.length > 128) {
  console.error('A senha precisa ter de 8 a 128 caracteres. Nada foi alterado.');
  process.exit(1);
}
if ((await ask('Repita a nova senha: ', true)) !== password) {
  console.error('As senhas não conferem. Nada foi alterado.');
  process.exit(1);
}

const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
if (error) {
  console.error('O Supabase recusou a senha:', error.message);
  process.exit(1);
}
console.log('Senha alterada. Entre no painel com o e-mail ou o nome de usuário e a senha nova.');
