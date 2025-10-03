#!/bin/bash

cd "${dirname $0}"

npm run format

cd ./common
git add .
git commit -m "$1"
sleep 1
git push

sleep 1

cd ../
git add .
git commit -m "$1"
sleep 1
git push