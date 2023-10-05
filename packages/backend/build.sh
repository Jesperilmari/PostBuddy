#!/bin/bash

set -e

# Build the backend
npm run build
echo "Build complete"

# Copy package json
cp package.json dist/package.json

# Install production dependencies


npm install --prefix ./dist --omit=dev

zip -r backend.zip dist