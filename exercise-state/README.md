<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - State

In this exercise, we're going to extract state into a store like service to improve UX, 
remove need for state synchronization between components and make the app more scalable and maintainable.

- How to manually refresh state between independent components why is that a problem?
- What's the general idea of service based state management
- How to create a store like service
- How to extract most of the component state into the service
- How to make service state private and only expose limited well-defined public API
- How to perform async operations in the service
- How to prevent race conditions with rxMethod
- How to use service in component to access and update state

> Compared to where we left off we have already pre-generated the `ProductService` in order to be able
> to provide inline TODO descriptions


**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

## Discussion

* The `debounceTime` error masking and solution with `untracked`
* Why we should always wrap complex methods in the effects as untracked (their impl might change over time)
* Why should we keep some state in the components (router outlet state vs products), in general which state should be shared?

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- single test can be run with `npm t -- <part-of-the-test-file-name>`, eg `npm t -- product-list`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

