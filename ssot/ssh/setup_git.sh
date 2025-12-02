#!/bin/bash
computerName=$(hostname);
chmod 600 ./key.pem;
eval "$(ssh-agent -s)";
ssh-add ssot/ssh/key.pem;
git init;
git config user.name "${computerName}";
echo "${computerName}" >> ./hello.txt;
git add ./hello.txt;
git commit -m "feat(setup): initial commit from ${computerName}"