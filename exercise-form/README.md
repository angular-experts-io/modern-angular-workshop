<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Form 

In this exercise, we're going to explore how to define and display Angular forms using reactive forms approach

- How to implement form using Angular Reactive Forms
- How to implement nested from controls, form groups and form arrays
- How to react to form value changes (eg list of options or dependent fields)

> Compared to where we left off we have added a
> **category** service which provides list of categories as a
> simple array of strings exposed as signal

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the Working directories to match the current exercise to prevent false positive errors and warnings.

## Discussion

* Why do we have to provide generic type for fields initialized with `null`
* We should always keep in mind that we need to group nested form controls (groups and arrays) using a dedicated directive
* What is the issue with string based form control / group / array directives used in the template
* What happens if we implement a button without a `type` attribute in a form

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- single test can be run with `npm t -- <part-of-the-test-file-name>`, eg `npm t -- product-list`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

