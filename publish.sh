#!/bin/bash

# Git pull and submodule sync script
echo "Pulling latest changes..."
git pull

echo "Syncing submodule URLs..."
git submodule sync

echo "Initializing and updating submodules..."
git submodule update --init --recursive

echo "Sync complete!"

echo "Install dependencies..."
pnpm install

rm -rf publish_old
mkdir -p publish
mkdir -p publish_old
mv publish/* publish_old

echo "Building for production..."
pnpm build

mv dist/* publish