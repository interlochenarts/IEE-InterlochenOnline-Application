#!/bin/bash

NODE_VERSION=14
NG_CLI_VERSION=13.3.2

cd ..;

# check if nvm is installed. If not, install it.
if [ ! -f "$HOME/.nvm/nvm.sh" ]; then
    # May need to be updated with the latest nvm release
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
fi

# lets us use the nvm commands
source "$HOME/.nvm/nvm.sh"
nvm install $NODE_VERSION

# get our dependencies
echo -e "===> npm install <===\n"
npm install sfdx-cli;

if [[ -z "${SFDC_CONSUMER_KEY}" ]]; then
  echo -e "Missing SFDC_CONSUMER_KEY environment variable"
fi

if [[ -z "${sfdcUser}" ]]; then
  echo -e "Missing sfdcUser environment variable"
fi

if [[ -z "${DX_ENV}" ]]; then
  echo -e "Missing DX_ENV environment variable"
fi

if [[ -z "${LOGIN_SERVER}" ]]; then
  echo -e "Missing DX_ENV environment variable"
fi

if [[ -z "${KEY_FILE}" ]]; then
  echo -e "Missing KEY_FILE environment variable"
fi

echo -e "===> SFDX Update <===\n"
sfdx update

echo -e "===> SFDX Deploy <===\n"
sfdx -v

echo -e "sfdx force:auth:jwt:grant -i${SFDC_CONSUMER_KEY} -f/home/wwadmin/certificates/${KEY_FILE} -u${sfdcUser} -a${DX_ENV} -rhttps://${LOGIN_SERVER}.salesforce.com"
sfdx force:auth:jwt:grant -i${SFDC_CONSUMER_KEY} -f/home/wwadmin/certificates/${KEY_FILE} -u${sfdcUser} -a${DX_ENV} -rhttps://${LOGIN_SERVER}.salesforce.com

echo -e "sfdx force:mdapi:deploy -dSalesforce/src -u${DX_ENV} -w60"
sfdx force:mdapi:deploy -dSalesforce/src -u${DX_ENV} -w60
