#\!/bin/bash

# Build script for M4K client

# curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
# sudo apt-get install -y nodejs
# sudo npm install -g npm@11.5.2
# sudo npm install -g pnpm

pnpm install

echo "Running type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "Type check failed. Aborting build."
    exit 1
fi

# echo "Running linter common..."
# npx eslint common/

# echo "Running linter src..."
# npx eslint src/

if [ $? -ne 0 ]; then
    echo "Linting failed. Aborting build."
    exit 1
fi

echo "Building for production..."
pnpm build

if [ $? -eq 0 ]; then
    echo "Build completed successfully\!"
else
    echo "Build failed\!"
    exit 1
fi
EOF < /dev/null