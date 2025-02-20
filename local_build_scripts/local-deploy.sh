#!/usr/bin/env bash

#############################
### This script takes two parameters:
###   1 (Required): The name of the sandbox you want to push to
###   2 (Optional): "auth" if you want to authenticate/create a connection to the sandbox
###                  Only necessary the first time you connect to the sandbox with sfdx
###
### INFO: This script assumes nvm and @salesforce/cli are installed
#############################


SF="./node_modules/.bin/sf"
SANDBOX=""

if [[ -z $1 ]]; then
  echo -e "Expected first argument to be sandbox name"
  exit;
else
  SANDBOX=$1
fi

# build using GoCD script
../gocd_scripts/build.sh skip_npm

# compress the build
cd ..
./compressBuild.sh

# lets us use the nvm commands
source "$HOME/.nvm/nvm.sh"
nvm install # use .nvmrc version

npm install

echo -e "using Node.js $(node --version) ==> $(which node)"

if [[ $2 == "auth" ]]; then
  # log in to a sandbox
  auth=("${SF}" auth device login --instance-url="https://interlochen--${SANDBOX}.sandbox.my.salesforce.com" --alias="${SANDBOX}")
  "${auth[@]}"
fi

# deploy to sandbox
deploy=("${SF}" project deploy start --target-org="${SANDBOX}" --metadata-dir="Salesforce/src")

echo -e "${deploy[@]}"

# NON-LOOPED DEPLOY
"${deploy[@]}"