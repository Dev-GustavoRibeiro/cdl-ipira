// Script para gerar o hash da senha do admin
// Execute: node scripts/generate-password-hash.js

const bcrypt = require('bcrypt');

const password = '@CdlIpira@2026!';
const saltRounds = 10;

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
  });




