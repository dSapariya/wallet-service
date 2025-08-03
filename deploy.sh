#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

npm install -g @nestjs/cli

nest --version

echo "Generating Prisma client..."
npm run prisma:generate

echo "Applying database migrations..."
npm run prisma:migrate:deploy

export PORT=3000

echo "Building the app..."
npm run build   