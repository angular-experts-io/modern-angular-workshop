#!/usr/bin/env zsh

find . -type d -name "exercise*" -maxdepth 1 | while read d; do
   cd $d && pwd && ng update @angular/cli @angular/core @angular/material @angular-eslint/schematics --force  && cd ..
done

# Angular 12 -> 13
# npm un tslint
# rm -f tslint.json
# rm -f projects/customer-admin-app/tslint.json
# ng update @angular/cli @angular/core --force
# npm run format:write
# echo 'Y' | ng add @angular-eslint/schematics
# npm un protractor
# rm -rf projects/customer-admin-app/e2e
