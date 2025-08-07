#!/bin/bash

# Build script for M4K client
echo "Running type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "Type check failed. Aborting build."
    exit 1
fi

echo "Running linter common..."
npx eslint common/

echo "Running linter src..."
npx eslint src/

if [ $? -ne 0 ]; then
    echo "Linting failed. Aborting build."
    exit 1
fi

echo "Building for production..."
pnpm build

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
else
    echo "Build failed!"
    exit 1
fi