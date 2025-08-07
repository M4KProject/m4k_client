#!/bin/bash

# Git pull and submodule sync script
echo "Pulling latest changes..."
git pull

echo "Syncing submodule URLs..."
git submodule sync

echo "Initializing and updating submodules..."
git submodule update --init --recursive

echo "Sync complete!"