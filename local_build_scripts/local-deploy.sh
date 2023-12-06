#!/usr/bin/env bash

#############################
### This script takes two parameters:
###   1: The name of the sandbox you want to push to
###   2 (Optional): "auth" if you want to authenticate/create a connection to the sandbox
###                  Only necessary the first time you connect to the sandbox with sfdx
#############################

SANDBOX=""

if [[ -z $1 ]]; then
  echo -e "Expected first argument to be sandbox name"
  exit;
else
  SANDBOX=$1
fi

# Assumes nvm and @salesforce/cli are installed

# build using GoCD script
../gocd_scripts/build.sh

# compress the build
cd ..
./compressBuild.sh

if [[ $2 == "auth" ]]; then
  # log in to a sandbox
  sf org login web --instance-url="https://interlochen--${SANDBOX}.sandbox.my.salesforce.com" --alias="${SANDBOX}"
fi

# deploy to sandbox
sf project deploy start --target-org="${SANDBOX}" --metadata-dir="Salesforce/src"
