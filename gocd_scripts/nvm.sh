#!/bin/bash

cd ..;

# check if nvm is installed. If not, install it.
if [ ! -f "$HOME/.nvm/nvm.sh" ]; then
    # May need to be updated with the latest nvm release
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
fi

# lets us use the nvm commands
source "$HOME/.nvm/nvm.sh"
nvm install 15

# get our dependencies
npm install;
npm install --save-dev;
