#!/bin/bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat <<EOT >> ~/.ssh/config
Host github.com
  HostName github.com
  User git
  IdentityFile $(pwd)/ssot/ssh/key.pem
  IdentitiesOnly yes
EOT
chmod 600 ~/.ssh/config
ssh-keyscan github.com >> ~/.ssh/known_hosts
