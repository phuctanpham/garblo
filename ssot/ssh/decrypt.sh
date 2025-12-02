#!/bin/bash
gpg --quiet --batch --yes --decrypt --passphrase="$(cat ./passphare.txt)" --output ./key.pem ./key.gpg