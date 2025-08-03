#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npm run prisma:generate

echo "Applying database migrations..."
npm run prisma:migrate:deploy

echo "Building the app..."
npm run build