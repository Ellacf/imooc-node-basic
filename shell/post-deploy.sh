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
pm25 interact 056147cb0b76621b 0a9b46b7b35348d9
pm25 start processes.json
