#!/bin/bash
gpg --quiet --batch --yes --decrypt --passphrase="$(cat ssot/ssh/passphare.txt)" --output ssot/ssh/key.pem ssot/ssh/key.gpg