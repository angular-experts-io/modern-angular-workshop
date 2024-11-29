#!/usr/bin/env zsh

# in fish, execute with zsh update.sh

find . -type d -name "exercise*" -maxdepth 1 | while read d; do
   cd $d && pwd &&  ng update @angular/{cli,cdk,core,material,router,forms,animations}@18 @ngrx/{signals,operators}@18  @angular-eslint/schematics@18 jest-preset-angular@14.3.3 && cd ..
done

# General Angular Update
# npm ci && ng update @angular/cli @angular/core @angular/material @angular-eslint/schematics --force

# Angular 12 -> 13
# npm un tslint
# rm -f tslint.json
# rm -f projects/customer-admin-app/tslint.json
# npm ci
# ng update @angular/cli @angular/core --force
# npm run format:write
# echo 'Y' | ng add @angular-eslint/schematics
# npm un protractor
# rm -rf projects/customer-admin-app/e2e
