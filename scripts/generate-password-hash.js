// Password hash generator
// Run with: node generate-password-hash.js yourPassword

const crypto = require('crypto');

const PASSWORD_SALT = "dailyjournal"; // Same salt as in auth.ts

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + PASSWORD_SALT)
    .digest('hex');
}

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument');
  process.exit(1);
}

console.log('Generated hash for your password:');
console.log(hashPassword(password));
console.log('\nInstructions:');
console.log('1. Copy this hash');
console.log('2. Replace the SECURE_PASSWORD_HASH value in src/services/auth.ts');
console.log('3. Also update ADMIN_USERNAME if you want to change it');
console.log('4. NEVER share your original password with anyone');
