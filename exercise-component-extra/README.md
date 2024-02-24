<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Component extra, 3rd party libs, lazy loading, animations, ...

In this exercise, we're going to explore how to use components from non-Angular
3rd party libraries and by doing so explore additional concepts like view children
or content projection as well as lazy loading of heavy components and animations.

- How to implement wrapper components for 3rd party libraries
- How to lazy load heavy components using `@defer`
- How to implement and use Angular animations
- How to run logic outside of Angular change detection

> Compared to where we left off we have added a couple of things, namely, we have added the helper change detection
> counter in the toolbar (left side) which will be important to demonstrate some of the concepts in this exercise.
> Besides we have added a date helper in `core/util/` folder which will be used to generate mock year month combinations
> for the chart component. And we have also pre-generated the chart component itself in order to be able
> to specify TODO items for the exercise. (Normally we would generate it using Angular Schematics IDE integration)

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**


## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

