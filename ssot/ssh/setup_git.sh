#!/bin/bash
computerName=$(hostname);
git init;
git config user.name "${computerName}";
echo "${computerName}" >> ./hello.txt;
git add ./hello.txt;
git commit -m "feat(setup): initial commit from ${computerName}"