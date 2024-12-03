<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Backend API communication (16 TODOs)

In this exercise were going to explore how to communicate with a backend API using
`HttpClient` and how to create a simple backend service to encapsulate the communication logic.

- How to setup `HttpClient`
- How to create a backend service
- How to load data in the component (and disadvantages of doing so)
- How to "subscribe" to backend without subscription or async pipe data using Angular Signals RxJs interop package
- How to use Angular interceptors
- When to unsubscribe manually (`takeUntilDestroyed` pattern)

> Compared to where we left off, we have removed some of the mocks we provided earlier and introduced
> two new UI components, card and chip which are going to make our UI look a bit more interesting.
> Make sure to check their implementation in the `ui/` folder, they are pretty simple and self-explanatory.

**Search for the  `TODO <index>:`, eg `TODO 1:`  items in the code itself by searching the `projects` folder using IDE or text editor search functionality**

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.

## Explored topics, APIs and syntax

- Javascript private fields with `#` prefix
- `inject()` based dependency injection
- Injectable scoping to a lazy loaded feature (lazy injector) vs root injector
- Typescript generics for typing of the HttpClient responses
- `toSignal` for subscription-less RxJs streams
- `toObservable` for preventing race conditions when using signals
- Declarative approach (to loading data in the component)
- Http client request params
- RxJs flattening operators and error handling
- Interceptors and environments

## TODO 4 - Backend API service

1. Create a new `product-api` service in the `product` feature folder using Angular Schematics (IDE integration)
2. Make sure to remove `providedIn: 'root'` from the `@Injectable` decorator and provide the service in the lazy feature `providers: []` array instead (hint: we're using route based lazy features)
3. Add private `httpClient` property which will inject the `HttpClient` service using the modern `inject()` based approach
4. Create a `find` method which is going to use `httpClient.get`  method to fetch the data from the backend API
5. The API url is `http://localhost:4300/api/products` and the response is going to be an array of products so please **provide it as a generic type** of the `get` method to make sure our application is strongly typed
6. Next `TODO` item will be in the `product-list.component.ts` file

## Discussion

* RxJs error handling with `catchError` (nested streams)
* Generics (`httpClient.get`) and inference
* UX optimization, blinking loading spinner
* Using `toSignal` (injection context, reactive context)
* Client-side vs server-side filtering
* Refreshing of declarative signal / stream data is suboptimal (service / store)
* Why is it "ok" to `.subscribe()` on the remove call (difference between CUD and R)
* The future of "simple" data loading (without NgRx) with `rxResource` (developer preview)

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item

