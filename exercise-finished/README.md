<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Finished

* This exercise contains working (reference) implementation of all previous exercises
* Always try to solve exercises by yourself to learn the most about Angular
* Try not to use it too much 😉


## How to use exercises

- every exercise folder should be installed using `pnpm install --frozen-lockfile`
- every exercise can and **should be started** using `pnpm start` to run the app
- every exercise can start tests in watch mode using `pnpm run test:watch`
- single test can be run with `pnpm test --include "**/*<part-of-the-test-file-name>*.spec.ts"`, eg `pnpm test --include "**/product-list.component.spec.ts"`
- every exercise has its own `README.md` file with additional description of the given exercise

## API (backend) requests

- the `pnpm start` starts both frontend and simple backend which serves `db.json` file (as CRUD json API)
- performing backend requests will change content of that file
- the content can be "reset" by comping content from `db-backup.json` file into `db.json` file
- the content can be "reset" by performing git rollback on the `db.json` file
