#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Generating Prisma Client...');

try {
  // Check if DATABASE_URL is set and valid
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.log('⚠️  DATABASE_URL not set or invalid, using dummy URL for generation');
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  }

  // Create a temporary .env file for Prisma
  const envContent = `DATABASE_URL="${process.env.DATABASE_URL}"`;
  fs.writeFileSync('.env.temp', envContent);

  try {
    // Generate Prisma client
    execSync('npx prisma generate --schema=./src/prisma/schema.prisma', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });

    console.log('✅ Prisma Client generated successfully');
  } finally {
    // Clean up temporary .env file
    if (fs.existsSync('.env.temp')) {
      fs.unlinkSync('.env.temp');
    }
  }

} catch (error) {
  console.error('❌ Prisma generation failed:', error.message);
  console.log('⚠️  Continuing with build...');
  process.exit(0); // Don't fail the build
}
