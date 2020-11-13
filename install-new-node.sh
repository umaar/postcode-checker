#!/bin/bash

# for glitch deployments

if [[ -n "${PROJECT_DOMAIN}" ]]; then
	echo "Installing new node"
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	export NVM_DIR="/app/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
	nvm --version
	nvm install 15.2.0
	nvm use node
fi