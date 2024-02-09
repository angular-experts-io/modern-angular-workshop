<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome! 🤗

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can be started using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run watch` (jest) or you can also start the test directly from your IDE.
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `// TODO` comments inside the source code (eg `// TODO 1: description`) which should be followed to complete the given exercise


## Reference solution
You can always compare your solution with the `exercise-finished` project which contains
working solution for every previous exercise


## How to use test in "watch" mode

- run `npm run watch` which will start tests in watch mode, so they will re-run any time you make changes to your code
- use `describe.only` or `it.only` to run just one test suite (or one test)


## API (backend) requests

- the `npm start` starts both frontend and simple backend which serves `db.json` file (as CRUD json API)
- performing backend requests will change content of that file
- the content can be "reset" by comping content from `db-backup.json` file into `db.json` file
- the content can be "reset" by performing git rollback on the `db.json` file
