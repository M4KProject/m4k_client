#!/bin/bash

# Build script for M4K client

# Check if npx is available, install if not
if ! command -v npx &> /dev/null; then
    echo "npx not found. Installing npm and npx..."
    
    # Check if we can install Node.js/npm
    if command -v apt-get &> /dev/null; then
        # Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo yum install -y nodejs npm
    else
        echo "Cannot automatically install Node.js. Please install it manually."
        exit 1
    fi
    
    # Verify installation
    if ! command -v npx &> /dev/null; then
        echo "Failed to install npx. Please install Node.js manually."
        exit 1
    fi
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

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