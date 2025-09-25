#!/bin/bash

cd "${dirname $0}"

npm run format

cd ./common
git add .
git commit -m 'auto'
git push

cd ../
git add .
git commit -m 'auto'
git push