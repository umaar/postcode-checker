#!/bin/bash

# for glitch deployments

node -e "process.exit(parseInt(process.version.split('.')[0].replace('v', '')) < 15)"

if [ $? -eq 1 ]; then
	echo "Installing new node"
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	export NVM_DIR="/app/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
	nvm --version
	nvm install 15.2.0
	nvm use node
fi