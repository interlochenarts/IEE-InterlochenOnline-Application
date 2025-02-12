#!/bin/bash

NG_CLI_VERSION=17

if [[ -z ${NVM_VERSION} ]]; then
  NVM_VERSION=0.40.1
fi

cd ..;

# lets us use the nvm commands
source "$HOME/.nvm/nvm.sh"

# check if nvm is installed. If not, install it.
if [ ! -f "$HOME/.nvm/nvm.sh" ] || [ "${NVM_VERSION}" != "$(nvm --version)" ]; then
    # May need to be updated with the latest nvm release
    curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh" | bash
fi

nvm install # use .nvmrc version

if [[ $1 != "skip_npm" ]]; then
  # get our dependencies
  echo -e "===> npm install <===\n"
  npm clean-install;
fi

# check for angular-cli and install if not found
if ! command -v ng &>/dev/null; then
  echo -e "\n===> Installing @angular/cli <===\n"
  npm install -g @angular/cli@$NG_CLI_VERSION
fi

echo -e "\n===> Compiling... <===\n"
ng build --configuration production --aot --output-hashing=none
