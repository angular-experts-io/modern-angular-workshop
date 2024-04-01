<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Forms state handling

In this exercise, we're going to explore how to implement Angular form state handling using an editor
approach which can be used to both create new and update existing items.

- How to integrate form with external data source (eg, API or store)
- How to handle create and edit modes
- How to submit the form and handle the response
- How to reset the form to its initial state
- How to prevent users from navigating away from the form with unsaved changes

> Compared to where we left off we have added a couple of new components and services to streamline
> implementation of this exercise...

- **product-editor-skeleton** component that displays skeleton UI version of editor while the item is being loaded,
- **card-status** component to display statuses like error or success in a nicer way
- **dialog-confirm** pattern which comes with a service which allows us to open a confirm dialog and get notified about the result of the user interaction.

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the Working directories to match the current exercise to prevent false positive errors and warnings.

# Discussion

* The form array controls in the template use `track control.value`, changing numeric value of one of them and hitting reset leads to an issue, why? and how can we solve it?
* Why our guard is not really a guard, just a custom logic, and we're using inline functional guard in the route config instead?

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- single test can be run with `npm t -- <part-of-the-test-file-name>`, eg `npm t -- product-list`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

