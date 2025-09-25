#!/bin/bash

cd "${dirname $0}"

npm run format

cd ./common
git add .
git commit -m "$1"
git push

cd ../
git add .
git commit -m "$1"
git push