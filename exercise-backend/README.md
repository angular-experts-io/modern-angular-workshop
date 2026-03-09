<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Backend API communication (17 TODOs)

In this exercise were going to explore how to communicate with a backend API using
`HttpClient` and how to create a simple backend service to encapsulate the communication logic.

- How to setup `HttpClient`
- How to create a backend service
- How to load data in the component with `httpResource` (and the disadvantages of doing so)
- How to use Angular interceptors

> Compared to where we left off, we have removed some of the mocks we provided earlier and introduced
> two new UI components, card and chip, which are going to make our UI look a bit more interesting.
> Make sure to check their implementation in the `ui/` folder, they are pretty simple and self-explanatory.

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.

## Explored topics, APIs and syntax

- JavaScript private fields with `#` prefix
- `inject()` based dependency injection
- Injectable scoping to a lazy loaded feature (lazy injector) vs root injector
- TypeScript generics for typing of the HttpClient responses
- `toSignal` for subscription-less RxJs streams
- `toObservable` for preventing race conditions when using signals
- Declarative approach (to loading data in the component)
- `httpResource` based declarative data fetching
- `linkedSignal` based derived and writtable state
- `HttpClient` based requests
- RxJs flattening operators and error handling
- Interceptors and environments

**IMPORTANT - the todo items of this are in the code itself (as comments)**

## Discussion

* RxJs error handling with `catchError` (nested streams)
* Generics (`httpResource`) and inference
* UX optimization, blinking loading spinner
* Using `toSignal` (injection context, reactive context)
* Client-side vs server-side filtering
* Refreshing of declarative signal / stream data is suboptimal (service / store)
* Why is it "ok" to `.subscribe()` on the remove call (difference between CUD and R)
* The future of "simple" data loading (without NgRx) with `httpResource` (developer preview), implicit behavior and how to debounce?

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

