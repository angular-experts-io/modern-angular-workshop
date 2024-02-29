<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Routing and Navigation (19 TODOs)

In this exercise, we're going to explore how to implement routing and navigation in Angular application
with a focus on best practices like deep linking (reflecting relevant app state to URL) and UX
concerns (using router state to parametrize parts of the UI).

- How to set up routing features
- How to define useful helper routes like (redirect for main lazy feature and wildcard route)
- How to define new routes and capture dynamic parameters
- How to use additional `router-outlet` to implement nested routing
- How to use `routeLink` to navigate between routes
- How to use directives related to `routerLink` like `routerLinkActive` to parametrize UI and improve UX
- How to navigate programmatically
- How to access and use route parameters and router state
- How to reflect UI state into url and back

> Compared to where we left off we have pre-generated the "product-detail" component using Angular Schematics
> in the `product/` lazy feature folder, so it is possible to provide TODO steps for that component.
> In practice we would generate it with ease using Angular Schematics IDE integration.

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**


## Discussion

* Route definitions nesting and various UIs (replace in view, nest in view, ...)
* Why and how order of route definitions matters (catch all route, product routes)?
* Angular template variables and `exportAs` directive interaction
* Why did we need to define a signal for `routerOutlet` `isActivated` state instead of binding to it directly?
* Signal input / route path params / route data / resolver precedence
* Signal input vs constructor time
* Order of Signals `effect` execution (URL state synchronization, first read, the update)

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

