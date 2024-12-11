<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Form validation

In this exercise, we're going to explore how to implement Angular form validation

- How to implement form validation
- How to use built in and custom validators
- How to add validation on various levels (eg, form control vs from array)
- How to display validation errors
- How to display form validation errors on submit
- How to remove validation errors with reset

> Compared to where we left off we have added a `number.validator.ts` file 
> in the `core/validator/` folder with a validator stub in order to provide TODO items for the exercise

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the Working directories to match the current exercise to prevent false positive errors and warnings.

## Discussion

* The "contract" between the `required` and every other validator
* Why do we have to "call" `()` some validators and not others?
* Why do we always want to define custom validators as a factory function? (vs a property similar to `Validators.required`)
* What happens if you use `type="submit"` button and then try to `reset()` the form?
* What to keep in mind when validating dynamically added fields (form arrays)?

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- single test can be run with `npm t -- <part-of-the-test-file-name>`, eg `npm t -- product-list`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

