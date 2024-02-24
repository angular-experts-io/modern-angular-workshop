<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Forms and validation

In this exercise, we're going to explore how to use Angular forms and validation to create a simple form with validation and error handling.

- How to implement form using Angular Reactive Forms
- How to implement nested from controls, form groups and form arrays
- How to react to form value changes (eg list of options or dependent fields)
- How to implement form validation using built-in and custom validators
- How to display form validation errors on submit
- How to reset the form to its initial state
- How to integrate form with external data source (eg, API or store)
- How to prevent users from navigating away from the form with unsaved changes

> Compared to where we left off we have added a couple of new components and services to stramline
> implementation of this exercise...

- **product-editor-skeleton** component that displays skeleton UI version of editor while the item is being loaded,
- **card-status** component to display statuses like error or success in a nicer way
- **dialog-confirm** pattern which comes with a service which allows us to open a confirm dialog and get notified about the result of the user interaction.
- **category** service which provides list of categories as a simple array of strings exposed as signal

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**


## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

