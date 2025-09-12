#!/bin/bash

# Build script for Vercel deployment
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=./src/prisma/schema.prisma

# Build Next.js application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
