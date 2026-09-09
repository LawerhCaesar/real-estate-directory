import { randomBytes, scryptSync } from 'node:crypto';

let password = process.argv.slice(2).join(' ');
if (!password && !process.stdin.isTTY) {
  for await (const chunk of process.stdin) password += chunk;
  password = password.trimEnd();
}

if (password.length < 12) {
  console.error('Provide a password of at least 12 characters through standard input.');
  process.exit(1);
}

const salt = randomBytes(16);
const digest = scryptSync(password, salt, 64);
console.log(`scrypt$${salt.toString('base64url')}$${digest.toString('base64url')}`);
