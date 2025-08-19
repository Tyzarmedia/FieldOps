const bcrypt = require('bcrypt');

const hashedPassword = '$2b$10$8K1p.fhUWfnWNKf6XKzcyOOL3v3Z9jGmz5OZ8n9E0M8Wt1q2s3t4u5';

// Test common passwords
const testPasswords = ['password123', 'password', '123456', 'admin', 'test'];

console.log('Testing passwords against hash:', hashedPassword);

testPasswords.forEach(async (password) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    console.log(`Password "${password}": ${result ? 'MATCH' : 'no match'}`);
  } catch (error) {
    console.log(`Password "${password}": ERROR -`, error.message);
  }
});

// Also try generating a proper hash for password123
bcrypt.hash('password123', 10).then(hash => {
  console.log('\nProper hash for "password123":', hash);
});
