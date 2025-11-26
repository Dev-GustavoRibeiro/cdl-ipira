// Script para gerar o hash da senha do admin
// Execute: node scripts/generate-password-hash.js "sua_senha_aqui"
// Ou defina a variável de ambiente: ADMIN_PASSWORD="sua_senha" node scripts/generate-password-hash.js

const bcrypt = require('bcrypt');

// Obtém a senha via argumento de linha de comando ou variável de ambiente
const password = process.argv[2] || process.env.ADMIN_PASSWORD;
const saltRounds = 12; // Aumentado para maior segurança

if (!password) {
  console.error('\n========================================');
  console.error('ERRO: Nenhuma senha fornecida!');
  console.error('========================================');
  console.error('Uso: node scripts/generate-password-hash.js "sua_senha_aqui"');
  console.error('Ou: ADMIN_PASSWORD="sua_senha" node scripts/generate-password-hash.js');
  console.error('========================================\n');
  process.exit(1);
}

if (password.length < 8) {
  console.error('\n========================================');
  console.error('ERRO: Senha muito curta!');
  console.error('A senha deve ter no mínimo 8 caracteres.');
  console.error('========================================\n');
  process.exit(1);
}

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log('\n========================================');
    console.log('HASH DA SENHA GERADO:');
    console.log('========================================');
    console.log(hash);
    console.log('========================================\n');
    console.log('Copie este hash e use no script create-admin-user.sql\n');
  })
  .catch(err => {
    console.error('Erro ao gerar hash:', err);
    process.exit(1);
  });
