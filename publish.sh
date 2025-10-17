#!/bin/sh
set -eu

rm -rf dist

npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "Type check failed. Aborting build."
    exit 1
fi

npm run build

POD=$(kubectl get pods -l app=m4k-shared-data-editor -n m4k -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ -z "$POD" ]; then
    echo "❌ No pod found to access shared volume"
    exit 1
fi

kubectl cp "./dist/." "m4k/$POD:/shared/pocketbase/pb_public/."
