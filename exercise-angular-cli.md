<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Angular CLI

In this exercise were going to explore Angular CLI

- Learn how to execute Angular CLI commands and how to get and use`--help` for given command
- Create new Angular workspace
- Learn how to use Angular schematics
- Create application in the workspace
- Run the application (and options)
- Build the application (and options)
- Test the application (and options)
- Lint the application (and options)
- Analyze the application (bundle and dependency graph)
- Explore workspace configuration
- Add Prettier support
- Remove default placeholder content
- Add Angular Material component framework & Tailwind CSS

## TODO 1 - Learn how to use Angular CLI

1. Run `ng version` to  confirm version of your global Angular CLI (should be 15). If not, please update it using `npm i -g @angular/cli@latest`.
2. Run `ng version` command to see all the available Angular CLI commands
3. Try running `ng <some-command> --help` (please use `ng new --help`) as we're not in Angular workspace yet

## TODO 2 - Create new Angular workspace

1. Workspaces are created using `ng new` command, but before we execute it explore available options
2. Run `ng new exercise-angular-cli` command with options that disable the creation of an initial application `--create-application false`, sets `--style` to `scss` , enables `routing` and sets `prefix` to `my-org` and `--strict` for TypeScript strictness preset (hint: use `ng new --help` to see what are the exact options to achieve this)
3. Once done, explore the generated workspace folder in your console and inspect the generated files in your IDE (eg `cd exercise-angular-cli`)

## TODO 3 - Learn how to use Angular schematics

1. Once in an Angular workspace we can start using Angular schematics to scaffold code instead of writing it manually
2. Schematics are executed using`ng generate --help` (or `ng g --help`), running this command will give us list of all available schematics (hint: you might need to enable / disable Angular CLI anonymous stats reporting when running a command for the first time in a new workspace)
3. Similarly, to Angular CLI we can explore schematics option using `ng g <scheamtic-name> --help`

## TODO 4 - Create application in the workspace

1. Application in a workspace can be generated using Angular schematics
2. Explore options of `application` schematics using `--help` flag
3. Create an application with name `product-app` and following options: enabled `standalone`, `routing`, `scss` style and `my-org` prefix and `strict` TypeScript preset and **disabled** `ssg` (else you would need to decline the prompt)
4. Once done explore what was generated inside your IDE

## TODO 5 - Run the application

1. Once we created our application we can run it in two ways, first being `ng serve` (and second being `npm start`, check that script in the `package.json` file)
2. Open browser at `http://localhost:4200` to see the application running
3. Adjust the `start` script in the `package.json` file by adding `--open` flag, stop running app and restart it using `npm start`
4. Once running open your browsers DEV tools and explore the network tab about what kind of files represent the application and check their size (refresh application once the tab was opened)
5. Add new `start:prod` script to your `package.json` file and add both `--open` and `--configuration production` flags (`--prod` flag was used in previous versions), stop running app and restart it using `npm run start:prod`
6. Once running open your browsers DEV tools and explore the network tab about what kind of files represent the application and check their size

## TODO 6 - Build the application

1. Serving application is great for the development purposes, but we have to build artifacts to deploy to production
2. Build application using `ng build` (or `npm run build`, notice the `run` keyword, every script besides `start` and `test` have to use `run`)
3. Once done explore the `dist` folder
4. Add new `build:dev` script to your `package.json` file and add `--configuration development` flags, and build your application again using `npm run build:dev`
5. Once done explore the `dist` folder
6. What other difference besides the size of the files was between the DEV and the PROD mode and what is its purpose?
7. Explore options of `ng build` script using `--help` flag

## TODO 7 - Test the application

By default, Angular comes with Karma based testing out of the box, but it is possible to use Jest or other testing frameworks...
Angular now even comes with the official, but still experimental `Jest` support, but the main downside is that it doesn't 
support running of the individual tests in IDEs or with help of `-- file-pattern` flag, so we're going to use plain Jest with `jest-preset-angular` package.

1. Remove Karma with `npm un karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter`
2. Install Jest and related packages `npm i -D jest jest-environment-jsdom jest-preset-angular @types/jest`
3. In the `projects/product-app/` add `jest.config.js` file with the following content
```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', 'jest-canvas-mock'],
  globalSetup: 'jest-preset-angular/global-setup',
};
```
4. In the `projects/product-app/` add `jest.setup.ts` file with the following content
```typescript
import 'jest-preset-angular/setup';
```
5. In the `package.json` file adjust `test` script to `jest --config projects/product-app/jest.config.js`
6. Try the setup by running `npm t` and see the tests pass
7. Adjust your `test:watch` script in `package.json` with `npm run test -- --watch` content
8. Try running `npm run test:watch` and see the tests running in watch mode, try some of the proivded controls like `p` or `q`
9. Try breaking a test by changing `toEqual('product-app');` in the `app.component.spec.ts` to something else and see the test fail
10. Check out the new test output and try changing tests a couple of times
11. (Optional) Set up E2E (end-to-end) tests using `ng add @cypress/schematic` and agree to the CLI prompts. 
    1. Once done, add the `"configFile": "projects/customer-admin-app/cypress.config.ts",` in the `projects.customer-admin-app.architect.e2e.options` in the `angular.json` file. 
    2. After that add `specPattern: '**/cypress/e2e/**/*.cy.ts',` and `supportFile: '**/cypress/support/e2e.ts',` to the `e2e` property of the `projects/customer-admin-app/cypress.config.ts` file. 
    3. Then adjust `"extends": "../tsconfig.json",` to `"extends": "../tsconfig.app.json",` in the `projects/customer-admin-app/cypress/tsconfig.json` file. 
    4. Finally, run `ng e2e` and try to fix first out-of-the-box test.

### Continuous Integration testing
It usually makes sense to create dedicated `ci` npm script in package json which will execute all the tests when project is built in the CI environment, such a command can look like `"ci": "ng lint && ng test && ng build"`...

## TODO 8 - Lint application
1. Try to run `ng lint` what happens?
2. Proceed with offered installation of the `eslint`. Once done, run `ng lint` again and check out the new output

## TODO 9 - Analyze application

Analyzing application can come in handy when debugging produced bundle size...

1. Install `webpack-bundle-analyzer` and `source-map-explorer` as a dev dependency (`npm i -D`)
2. Add `analyze` script to your `package.json` file which will run `ng build` with `--stats-json --output-hashing none` flags
3. Extend the command with `&& webpack-bundle-analyzer ./dist/customer-admin-app/stats.json`
4. Run the `analyze` command and explore the website in opened tab (try checking "Show content of concatenated modules" checkbox)
5. Add `analyze:precise` script to your `package.json` file which will run `ng build` with `--source-map --output-hashing none` flags
6. Extend the command with `&& source-map-explorer dist/customer-admin-app/*.js --html dist/customer-admin-app/source-map-explorer/index.html`
7. Run the `analyze:precise` command and open the `dist/customer-admin-app/source-map-explorer/index.html` file in your browser

### Troubleshooting (only in case you encountered problems)

On MS Windows machines without GitBash, WSL or cygwin it might NOT be possible to use `&&` to chain commands in the npm scripts
In that case we have to install `npm i -D npm-run-all` package and change our `analyze` script to look like this...

```json
{
  "scripts": {
    "analyze": "npm-run-all analyze:*",
    "analyze:stats": "ng build --stats-json",
    "analyze:open": "webpack-bundle-analyzer ./dist/customer-admin-app/stats.json"
  }
}
```

## TODO 10 - Explore workspace configuration

Our workspace setup is pretty much done, let's see how it looks like and what can be configured...

1. Open `angular.json` file in the workspace root, it represents the main descriptor and configuration of the whole workspace
2. Depending on your IDE, try to collapse `projects` property
3. Our workspace currently has only one project (`customer-admin-app`), a single workspace can host multiple apps and libraries, in case we have multiple projects we can specify which one we want to build, test or serve it using `--project` flag so for example we could use `ng build --project some-other-app`
4. Inside of `customer-admin-app` you can find `architect` property with `build` property and finally `configuration` property, here you can see what options are applied by default with the `production` configuration (it is possible to define your own custom configurations which then can be activated using `--configuration <my-config>` flag when running commands)
5. Find `budgets` in the `build` configuration, this feature enables your build to fail if the size of the bundle crosses specified threshold, try to set it lower and run `npm run build` to see it fail... (hint: reduce warning to 0.1mb and error to 0.2mb for the `initial` bundle type) After that, revert the budget to default values to prevent your build from failing in the future.
6. Explore the `cli` property at the bottom of the file. Depending on your completion of previous optional tasks for eslint / cypress you might see `schematicCollections` property which contains an array of registered schematics collections. Make sure that the `@schematics/angular` is the first item of this array if it exists.
7. Explore the `schematics` property of the `customer-admin-app`, here you can set schematics defaults so let's say if you always wanted to use components with inline templates instead of separate HTML file you could specify it here instead of always writing `ng generate component some-component --inline-template`
8. Try to use code completing (of your IDE) inside of schematics configuration and you should get hints about all the available options. Notice that the configuration is per schematics collection so if you switched your first collection to `"@cypress/schematic"` then you would need to set options for that schematics too.
9. Configure schematic options for generating components to always use "OnPush" change detection strategy and try to generate a new example component `ng g c example`, then see the `OnPush` flag set in the generated component.

## TODO 11 - Add Prettier support

Prettier is amazing frontend tooling package which enables an autoformatting of your source code and lets you focus on developing features instead!

1. Install `prettier` as a dev dependency `npm i -D`
2. Create `.prettierrc` file in the workspace root and add the following content

```json
{
  "singleQuote": true,
  "printWidth": 100,
  "htmlWhitespaceSensitivity": "ignore"
}
```

3. Try to go to any source file in the `customer-admin-app`, (eg `app.component.ts`) and break formatting, then depending on IDE try to run prettier

   - Intellij IDEA - press `CTRL ALT SHIFT P` (check your plugins if it doesn't work...)
   - VS Code - install prettier extension, and then it should be available with `SHIFT ALT F`

4. Add `format:write` script to your `package.json` file with `prettier \"projects/**/*.{ts,scss,json,html,js}\" --write` content
5. Add `format:test` script to your `package.json` file with `prettier \"projects/**/*.{ts,scss,json,html,js}\" --list-different` content
6. Try running the `format:test` followed by the `format:write` and again followed by `format:test`, all the errors should be gone!

## TODO 12 - Remove default placeholder content
As we might have noticed, running freshly generated application comes with some default content which
gives us some pointers about the next steps. That being said we need to get rid of it to start developing our own features.

1. Open the `app.component.html` file and delete all its content.
2. Add `<h1>{{title}} app is running!</h1>` instead
3. Open the `app.component.spec.ts` file and change `compiled.querySelector('.content span')` to `compiled.querySelector('h1')`
4. Try to run tests using `npm test`


## TODO 13 - Add Angular Material component framework

Angular Material is the "official" component framework developed by the Angular team and open source collaborators, as such 
it represents a great starting point for developing beautiful Angular applications ( alternative options being other 3rd party component frameworks or your own custom framework, but that takes LOTS of time, skill and dedication...)

Setting up Angular Material is relatively simple and includes a couple of steps and choices to be made on the way...

Luckily, Angular CLI and Angular Schematics support automation of this process using `ng add` command!

1. Run `ng add --help` to see available options, the `collection` stands for the package to be added and in our case that will be `@angular/material`
2. Run `ng add @angular/material`, the package will be installed and the Angular Schematics will prompt us for some required options that we didn't provide with the command
3. Choose `Custom` theme
4. Confirm setup of global Angular Material typography styles
5. Confirm include and enable Angular Material browser animations
6. Once done, the command line will inform us about what changes have been made by running the `ng add` schematics, let's explore these files...
    * `app.module.ts` - the `BrowserAnimationModule` was added
    * `index.html` - schematics added links to fonts used by Angular Material and the `mat-typography` class on the `<body>` tag
    * `styles.scss` - large custom theme setup was added automatically including hints how to adjust it further!
    
7. All this setup executed seamlessly with the power of Angular Schematics, pretty epic! Remember, many popular 3rd party libraries come with the `ng add` support simplifying the setup and usage dramatically!
8. Run application using `npm start` to see how `mat-typography` affected the fonts


# Great! We have set up nice Angular workspace and are ready for the development!
