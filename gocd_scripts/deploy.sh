#!/bin/bash

SF="../node_modules/.bin/sf"

if [[ -z ${SFDC_CONSUMER_KEY} ]]; then
  echo -e "Missing SFDC_CONSUMER_KEY environment variable"
fi

if [[ -z ${sfdcUser} ]]; then
  echo -e "Missing sfdcUser environment variable"
fi

if [[ -z ${DX_ENV} ]]; then
  echo -e "Missing DX_ENV environment variable"
fi

if [[ -z ${LOGIN_SERVER} ]]; then
  echo -e "Missing LOGIN_SERVER environment variable"
fi

if [[ -z ${KEY_FILE} ]]; then
  echo -e "Missing KEY_FILE environment variable"
fi

source "$HOME/.nvm/nvm.sh"
nvm install # use .nvmrc version
npm clean-install;

echo -e "\n===> SFDX Version <===\n"
version=("${SF}" --version)
"${version[@]}" # run the version command

echo -e "${SF} auth jwt grant --client-id=${SFDC_CONSUMER_KEY} --jwt-key-file=/home/wwadmin/certificates/${KEY_FILE} --username=${sfdcUser} --alias=${DX_ENV} --instance-url=${LOGIN_SERVER}"
auth=("${SF}" auth jwt grant --client-id="${SFDC_CONSUMER_KEY}" --jwt-key-file="/home/wwadmin/certificates/${KEY_FILE}" --username="${sfdcUser}" --alias="${DX_ENV}" --instance-url="${LOGIN_SERVER}")
"${auth[@]}" # run the auth command

echo -e "${SF} project deploy start --metadata-dir=Salesforce/src --target-org=${DX_ENV} --wait=60"
deploy=("${SF}" project deploy start --metadata-dir=Salesforce/src --target-org="${DX_ENV}" --wait=60)
"${deploy[@]}" # run the deploy command
