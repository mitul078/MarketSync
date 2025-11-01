#!/usr/bin/env node

/**
 * Generate a secure JWT secret key
 * Run: node generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generate a 64-character random hexadecimal string
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Generated JWT Secret:\n');
console.log(jwtSecret);
console.log('\n✅ Copy this to your .env file as JWT_SECRET\n');
console.log('📝 Example .env entry:');
console.log(`JWT_SECRET=${jwtSecret}\n`);




