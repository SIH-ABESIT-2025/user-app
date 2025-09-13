#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🗄️  Setting up database...');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set, skipping database setup');
    process.exit(0);
  }

  // Create a temporary .env file for Prisma
  const envContent = `DATABASE_URL="${process.env.DATABASE_URL}"`;
  fs.writeFileSync('.env.temp', envContent);

  try {
    // Push the schema to create tables
    console.log('📊 Pushing Prisma schema to database...');
    execSync('npx prisma db push --schema=./src/prisma/schema.prisma --accept-data-loss', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });

    console.log('✅ Database setup completed successfully');
  } finally {
    // Clean up temporary .env file
    if (fs.existsSync('.env.temp')) {
      fs.unlinkSync('.env.temp');
    }
  }

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('⚠️  Continuing with build...');
  process.exit(0); // Don't fail the build
}
