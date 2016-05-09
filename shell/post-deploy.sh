#!/bin/bash
#set -e

export PATH="$PWD/node_modules/.bin:$PATH"
export NVM_NODEJS_ORG_MIRROR="http://npm.sankuai.com/dist/node"
export NODEJS_ORG_MIRROR="http://npm.sankuai.com/dist/node"
export NODE_ENV="production"

source /usr/local/nvm/nvm.sh
nvm install v0.12.5
nvm use v0.12.5
npm version

pm25 kill
pm25 interact 070b11334168a426 09547eef3a8a9676
pm25 start processes.json
