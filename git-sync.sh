#!/bin/bash

cd "${dirname $0}"

npm run format

cd ./pocketbase-lite/fluxio
git add .
git commit -m "sync"
sleep 1
git pull
git push

sleep 1

cd ../
git add .
git commit -m "sync"
sleep 1
git pull
git push

sleep 1

cd ../common
git add .
git commit -m "sync"
sleep 1
git pull
git push

sleep 1

cd ../
git add .
git commit -m "sync"
sleep 1
git pull
git push