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

## Important preparation

1. Setup IDE **markdown plugin** to with custom CSS to improve exercise description readability. In `Settings -> Languages & Frameworks -> Markdown` in the `Custom CSS` section, we're going to add `li {padding: 10px 0; }` and Apply / Save
2. Setup IDE to run prettier with key shortcut (usually `CTRL ALT SHIFT P` in Webstorm / `SHIFT ALT F` in VS Code)
3. Setup IDE expand to level 1, 2, 3, 4, 5 keyboard shortcuts (`Settings -> KeyMap -> search "level"`, eg `CTRL ALT SHIFT 1`, `2`, ...)
4. Setup IDE shortcut to refresh workspace (from disk, useful when CLI creates / changes files in the workspace)
5. Setup IDE shortcut to run Angular Schematics (usually `CTRL ALT SHIFT S`)
6. Eslint working in the IDE (may need manual setup and selecting of the `working directory`)
7. (part of exercise) Pre-configure most commonly used schematics like `component`, `directive`, ...
8. NPM troubleshooting, try to run `npm i <package-name> --registry https://registry.npmjs.org` in case package installation fails

## TODO 1 - Learn how to use Angular CLI

0. Confirm that there is at least Node.js `22.12` (or `24.0`) or above installed by running `node -v` in the console
1. Run `ng version` to confirm the version of your global Angular CLI (should be **21**). If not, please update it using `npm i -g @angular/cli@latest`.
2. Run `ng help` command to see all the available Angular CLI commands
3. Try running `ng <some-command> --help` (please use `ng new --help`) as we're not in Angular workspace yet

## TODO 2 - Create new Angular workspace

1. Workspaces are created using `ng new` command, but before we execute it explore available options
2. Run `ng new exercise-angular-cli` command **with options** that disable the creation of an initial application `--create-application false` and `--strict` for TypeScript strict mode
3. Make sure to answer all the prompts (eg config for your favorite AI tooling)
4. Once done, explore the generated workspace folder in your console and inspect the generated files in your IDE (eg `cd exercise-angular-cli`)

## TODO 3 - Learn how to use Angular schematics and configure sane defaults

1. Once in an Angular workspace, we can start using Angular schematics to scaffold code instead of writing it manually
2. Schematics are executed using`ng generate --help` (or `ng g --help`), running this command will give us list of all available schematics (hint: you might need to enable / disable Angular CLI anonymous stats reporting when running a command for the first time in a new workspace)
3. Similarly, to Angular CLI we can explore schematics option using `ng g <scheamtic-name> --help`

## TODO 4 - Create application in the workspace

1. Application in a workspace can be generated using Angular schematics
2. Explore options of `application` schematics using `--help` flag
3. (read whole before executing anything) Create an application with name `product-app` and the following options: enabled `routing`, `scss` style, `my-org` prefix, **disabled** `ssr` and `--file-name-style-guide 2016` (this will preserve classic file naming convention with `.component.ts` suffixes instead of just `app.ts`) , **make sure to use IDE schematics integration instead of CLI**, hint: you can type `--` to see all the available options in the IDE, also you can resize the IDE schematics dialog to see all the options at once!
4. Once done, run `npm ci` and explore what was generated inside your IDE
5. Notice that the **zoneless** is now enabled by default and doesn't need to be provided (`main.ts`, `app.config.ts` files)

## TODO 5 - Run the application

1. Once we created our application we can run it in two ways, first being `ng serve` (and second being `npm start`, check that script in the `package.json` file)
2. Open browser at `http://localhost:4200` to see the application running
3. Adjust the `start` script in the `package.json` file by adding `--open` flag, stop running app and restart it using `npm start`
4. Make a change at the beginning of the `app.component.html` file and see the change reflected in the browser

## TODO 6 - Build the application

1. Serving application is great for development purposes, but for production, we have to build and optimize it to get the best performance 
2. Build application using `ng build` (or `npm run build`, notice the `run` keyword, every script besides `start` and `test` have to use `run`)
3. Once done explore the `dist` folder
4. Add new `build:dev` script to your `package.json` file and add `--configuration development` flags, and build your application again using `npm run build:dev` (look into `angular.json` file and see what options are applied when we use `development` configuration)
5. Once done explore the `dist` folder
6. What other difference besides the size of the files was between the DEV and the PROD mode ,4and what is its purpose?
7. Explore options of `ng build` script using `--help` flag

## TODO 7 - Test the application

From version 21, Angular comes with modern Vitest testing out of the box, but it is possible to use Jest or other testing frameworks...
 

1. In the `package.json` file adjust `test` script to `ng test --watch false`
2. Try the setup by running `npm t` and see the tests pass
3. In the `package.json` file add new `test:watch` script with `ng test` command
4. Try the setup by running `npm run test:watch` and see the tests running in watch mode, try using `h` key and subfilter watched tests using `t` and providing a test name pattern, eg `title`
5. Try breaking a test by changing `toEqual('Hello, order-app');` in the `app.component.spec.ts` to something else and see the test fail
6. Try running `npm t -- --ui` and accept installing of the `@vitest/ui` package, and once done, re-run the command, it should open the Vitest UI in the browser (in WSL2 it might not work out of the box, yuu might need to open WSL2 based Chrome and paste the URL)

### (optional) TODO 7 - e2e testing
1. Set up E2E (end-to-end) tests using `ng e2e` and choosing the `playwrigth` option, then accept installing Playwright browsers.
2. **TROUBLESHOOTING**: if the installation fails, try running `npx playwright install-deps`
3. Once done, run `ng e2e --ui` to see the E2E tests running in the browser, they will fail
4. Fix the test in `e2e/example.spec.ts` and re-run the E2E tests to see them pass

## TODO 8 - Lint application
1. Try to run `ng lint` what happens?
2. Proceed with offered installation of the `angular-eslint`. 
3. Once done, run `ng lint` again and check out the new output 
4. Try adding `<button>Test</button>` to the `app.component.html` and run `ng lint` again
5. There won't be any linting error reported, but using buttons without `type` attribute is a bad practice (accidental form submission) so let's add a new lint rule to prevent it
6. The add `"@angular-eslint/template/button-has-type": "error"` (into the `rules` object) into overrides for `.html` files in the **root** `eslint.config.js` file
7. Run `ng lint` again and see the new error Fix the error by adding `type="button"` to the button and run `ng lint` again

### Continuous Integration testing
It usually makes sense to create dedicated `ci` npm script in `package.json` which will execute all the tests when project is built in the CI environment, such a command can look like `"ci": "npm run lint && npm run test &&  npm run build"`...

## TODO 9 - Analyze application

Analyzing the application can come in handy when debugging produced bundle size...

1. Install `npm install -D esbuild-visualizer source-map-explorer http-server`
2. Add `"analyze": "ng build --stats-json --output-hashing none --named-chunks && esbuild-visualizer --template treemap --metadata dist/product-app/stats.json --filename dist/product-app/analyse/index.html && http-server -o -c-1 ./dist/product-app/analyse/"` to your `package.json` file
3. Try to run the `analyze` command and explore the website in opened tab
4. Add `"analyze:sme": "ng build --source-map --output-hashing none --named-chunks && source-map-explorer dist/product-app/browser/*.js --html dist/product-app/sme/index.html && http-server -o -c-1 ./dist/product-app/sme/"`
5. Try to run the `analyze:sme` command and explore the website in opened tab
6. Another way is to upload `stats.json` file to official [Esbuild Bundle Analyzer](https://esbuild.github.io/analyze/) website and explore the bundle size there
7. Try **new bundle analyzer by Kevin Kreuzer called HawkEye** by running `npx @angular-experts/hawkeye init`, we're using multi project workspace so we have to provide correct name of the application we've generated previously, once finished, explore the `package.json` file and run the newly added hawkeye npm script (see the exact script name in the file)

## TODO 10 - Workspace configuration & budgets

Our workspace setup is pretty much done, let's see what it looks like and what can be configured...

1. Open `angular.json` file in the exercise workspace root, it represents the main descriptor and configuration of the whole workspace
2. Depending on your IDE, try to collapse `projects` property
3. Our workspace currently has only one project (`product-app`), a single workspace can host multiple apps and libraries, in case we have multiple projects we can specify which one we want to build, test or serve it using `--project` flag so for example we could use `ng build --project some-other-app`
4. Inside of `product-app` you can find `architect` property with `build` property and finally `configuration` property, here you can see what options are applied by default with the `production` configuration (it is possible to define your own custom configurations which then can be activated using `--configuration <my-config>` flag when running commands)
5. Find `budgets` in the `build` configuration, this feature enables your build to fail if the size of the bundle crosses specified threshold, try to set it lower and run `npm run build` to see it fail... (hint: reduce warning to `0.05mb` and error to `0.1mb` for the `initial` bundle type) After that, revert the budget to default values to prevent your build from failing in the future.


## TODO 11 - Angular Schematics 

1. Explore the `cli` property at the bottom of the `angular.json` file. Depending on your completion of previous optional tasks for eslint / cypress you might see `schematicCollections` property which contains an array of registered schematics collections. Make sure that the `@schematics/angular` is the first item of this array if it exists.
2. Explore the `schematics` property of the `product-app`, here you can set schematics defaults so let's say if you always wanted to use components with inline templates instead of separate HTML file you could specify it here instead of always writing `ng generate component some-component --inline-template`
3. Try to use code completing (of your IDE) inside of the schematics configuration, and you should get hints about all the available options. Notice that the configuration is per schematics collection so if you switched your first collection to `"@cypress/schematic"` then you would need to set options for that schematics too.
4. Configure schematic options for generating components to always generate components with **"OnPush"** change detection strategy and **display block** as a default `:host` style, then try to generate a new example component with IDE schematics integration (or by running `ng g c example` in the CLI), then see the `OnPush` flag set in the generated component as well as `:host` styles.
5. Then delete the component
6. Running schematics in CLI is great, but in real projects, the paths may get long and tedious to type correctly, that's why it's much better to run schematics with the help of IDE integration, for example in Webstorm (and IDEA), it is possible to right-click a folder, select `New` and `Angular Schematic` and then select the schematic you want to run. 
7. Try to run `component` schematic using this method and see how it's much easier to use than typing the command in the terminal
8. It can be a **great idea to bind `Angular Schematics` command to a dedicated key shortcut in the IDE** (eg `CTRL ALT SHIFT S`) to make its use even more seamless!

## TODO 12 - Add Prettier support

Prettier is an amazing frontend tooling package that enables an autoformatting of your source code and lets you focus on developing features instead!

1. Install `prettier` as a dev dependency `npm i -D`
2. Create `.prettierrc` file in the current exercise workspace root and add the following content

```json
{
  "singleQuote": true
}
```

3. Try to go to any source file in the `product-app`, (eg `app.component.ts`) and break formatting, then depending on IDE try to run prettier

   - Intellij IDEA - press `CTRL ALT SHIFT P` (check your plugins and configuration if it doesn't work...)
   - VS Code - install prettier extension, and then it should be available with `SHIFT ALT F`

4. Add `format:write` script to your `package.json` file with `prettier \"projects/**/*.{ts,scss,json,html,js}\" --write` content (careful with the escaped quotes, copying and pasting might not work correctly) 
5. Add `format:test` script to your `package.json` file with `prettier \"projects/**/*.{ts,scss,json,html,js}\" --list-different` content
6. Try running the `format:test` followed by the `format:write` and again followed by `format:test`, all the errors should be gone!

## TODO 13 - Remove default placeholder content (as of Angular 20, broken skip for now, we deleted the app.ts file)
As we might have noticed, running freshly generated application comes with some default content which
gives us some pointers about the next steps. That being said we need to get rid of it to start developing our own features.

1. Open the `app.component.html` file and delete all its content.
2. Add `<h1>{{title}} app is running!</h1>` instead
3. Open the `app.component.spec.ts` file and change the test to expect correct string based on our latest change as the `h1` content...
4. Try to run tests using `npm test`


## TODO 14 - Add Angular Material component framework

Angular Material is the "official" component framework developed by the Angular team and open source collaborators, as such 
it represents a great starting point for developing beautiful Angular applications ( alternative options being other 3rd party component frameworks or your own custom framework, but that takes LOTS of time, skill and dedication...)

Setting up Angular Material is relatively simple and includes a couple of steps and choices to be made on the way...

Luckily, Angular CLI and Angular Schematics support automation of this process using `ng add` command!

1. Run `ng add --help` to see available options, the `collection` stands for the package to be added and in our case that will be `@angular/material`
2. Run `ng add @angular/material`, the package will be installed and the Angular Schematics will prompt us for some required options that we didn't provide with the command
3. Choose `Azure/Blue` theme
4. Confirm setup of global Angular Material typography styles
5. Confirm include and enable Angular Material browser animations
6. Once done, the command line will inform us about what changes have been made by running the `ng add` schematics, let's explore these files...
    * `index.html` - font link to the Roboto font was added
    * `styles.scss` - theme configuration
7. In the `app.config.ts` add `provideAnimationsAsync()` to the `providers` array, this will enable Angular Material animations in the application

8. Run application using `npm start` to see how Angular Material already affected the application typography and styles
9. Let's install Tailwind CSS dependencies with `npm install -D tailwindcss@3 postcss autoprefixer`
10. And run `npx tailwind init`, after that, add `'./projects/product-app/**/*.{html,ts}',` in the `content: []` array  of the generated `tailwind.config.js` file
11. Now we need to enable Tailwind classes by adding following to the start of the `styles.scss` file (global styles)...
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

// Tailwind CSS workarounds (for Angular Material)
.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field
  .mdc-notched-outline__notch {
  border-right-style: hidden;
}
```
12. Tailwind CSS is amazing for the creation of responsive layouts and has lots of great helpers for layouts, sizing, ...
13. Try to use Tailwind classes like `!text-4xl` and `text-blue-700` on the `<h1>` tag in the `app.component.html` file and see the changes in the browser

### Great! We have set up a nice Angular workspace and are ready for the development!

## Discussion

* Why do we generate workspace with `--create-application false` and what are the benefits of this approach?
* What's the difference between bundle files produced by the build in production and development mode (besides the size) and what is the purpose of it?
* What's the best way to pass additional arguments to existing npm scripts? (to avoid duplication)
* What is the purpose of the `budgets` specified in the `angular.json` file and why should we always use them?
* What's the difference between root `styles.scss` file, `styles` array in the `angular.json` file and `styleUrls` property in the component metadata?
* What's the main advantage of using schematics in the IDE instead of CLI?
