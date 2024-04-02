<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Components

In this exercise we're going to explore how to use components in Angular to display state (data) to the user and how to handle user interaction like clicks to trigger changes in the state.

- How to store state in components
- How to display state in the template
- How to handle user interaction


> Compared to where we left off we have added a
> a little bit of HTML markup in the `ProductListComponent` (root component 
> of the product lazy feature), `product.model.ts` with `Product` interface and mock 
> product data in the `products.mock.ts` file


Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.

## TODO 1 - Navigation

Before we get started, it can be a good idea to adjust Eslint IDE settings, especially the `Working directories` to match the current exercise to prevent false positive errors and warnings.

Let's start with something simple, we're going to extract navigation as a data structure (wrapped in an Angular Signal)
and use it to display navigation items in the template.

1. In the `main-layout.component.ts` file, create a new property `navigation` and assign it an array of navigation items for both `home` and `product` features. Each navigation object should have two properties, `route` and `label`.
2. In the `main-layout.component.html` file, we're going to remove the hard-coded navigation items 
3. In the `main-layout.component.html` file, we're going to use the `navigation` property to display navigation items using the new `@for` control flow statement, keep in mind that `@for` requires a mandatory `track` expression, what would be a good unique identifier for each navigation item? What are the advantages of this approach compared to `*ngFor` directive? (3 main advantages)
4. Let's refactor the `navigation` property to use Angular Signal instead of just plain data, in general we want to store state in signals because that way we are writing future-proof logic which will make it easier to embrace signals based components once they are released.
   
In general, static data could still be stored in plain properties, but in real life application, it's easy to imagine that navigation could be adjusted based on user roles (purchased subscription, ...) so it's better to start with signals from the beginning as there is little downside to doing so...


## TODO 2 - Product list

Let's display a list of products in the `product-list.component.html` template.
The exercise comes with a mocked data set of products stored in the `products.mock.ts` 
file and an `Product` interface stored in the `product.model.ts` file, in practice 
we would create the model file to describe data we're receiving from the backend API endpoint.

1. Let's create a couple of signals in the `product-list.component.ts` file to store array of products `Product[]` (or `undefined`), loading state `boolean` and error state `string` (or `undefined`).
2. Let's set the value of `products` signal to the mocked data set from the `products.mock.ts` file.
3. In the `product-list.component.html` file, let's display the list of products (just render their name in a `<p>` tag) with the help of `@for` control flow statement.
4. We should be able to see a list of product names in the running app (`npm start`)

## TODO 3 - Product item

1. Let's create a `product-item` component in the `product` feature using Angular Schematics (IDE integration), click on `product` lazy feature folder and run **Angular Schematics...**
2. In the `product-item.component.ts` define `product` property as a **required** Angular Signals based `input` which accepts `Product` type
3. In the `product-item.component.html` lets add the following markup
```html 
<div class="p-4 bg-white rounded-lg shadow-sm">
    
</div>
```
4. Inside the `<div>`, display product name as `h4` (what is the `product` in this case, how do we have to access its value?)
5. Back in the `product-list.component.html`, let's replace the `<p>` which we used to display product name with the newly created product item component, always try to use self-closing tags (as it's a standalone component, we have to make sure that it's the part of current template context which belongs to and is managed by the product list component)
6. Make sure to pass `product` to the product item component using standard `[someInput]` binding 
7. Let's verify that everything works in the running app, it should look like a bunch of cards displaying product names
8. Let's display some additional data in the product item component like `description` and `price` (we can use basic `<p>` tags for the moment)
9. The `Product` object also contains `pricePerMonth` array of multiple prices, we're going to use it to calculate `averagePrice` (an example of **derived** state)
10. Before signals, we would achieve this by creating a new `averagePrice` property, and then in the `ngOnChanges` lifecycle hook,  we would calculate and assign its value any time the product changes, let's do that quickly, and then we're going to refactor it to use signals instead (average price can be rounded with `toFixed(2)`)
11. Let's re-define `averagePrice` as a `computed` signal and calculate this way instead!
12. Now we have to update the `product-item.component.html` to display the `averagePrice` as signal instead of plain property
13. Try to use new computed signal based `averagePrice` as a plain property in the template (`{{ averagePrice }}`), and check out the output in the terminal where you run `npm start`, what is the error message and why is it happening?
14. Let's validate that everything works as expected in the running app

The `computed` signals are the best way to create derived state in Angular, and we should always use them instead of plain properties, especially when the derived state is based on other signals as it's a future-proof way to write components which will make it easier to embrace signals based components once they are released.

## TODO 4 - Basic interaction

Now we're going to add some basic interaction to the product list component, 
we're going to mock the loading / loaded flow which is going to happen based 
on performing backend requests in an actual application.

1. In the `product-list.component.ts` file set the value of `loading` signal to `true` and `products` signal to `undefined` (we're going to simulate the loading state)
2. In the `product-list.component.html` file, let's  use `@if` and `@else` control flow statements to display "Loading..." when `loading` signal is `true` and the list of products when `loading` signal is `false`
3. The running app should display "Loading..." 
4. Let's add a button before the `@if` (eg with `mat-raised-button` directive, mind tpl ctx) which is going to call method `mockLoadData()` when user clicks `(click)`. Add `[color]="'primary'"` to that button to make it blue.
5. Let's define the `mockLoadData()` method in the `product-list.component.ts` file, which is going to set the value of `loading` signal to `true` and then we're going to add `setTimeout` (eg with delay 1s) and inside we're going to set `products` signal to `[]` (empty array) and `loading` to `false`
6. In the running application, we're going to see the "Loading..." and after a click and short delay we won't see anything. Previously, we would solve it with another `@if` to show an empty state if we loaded an empty collection of products, but now there is a better way!
7. Add `@empty` after the closing `}` of the `@for` ( in the similar way the `@if` and `@else` are working) to define an empty state which says "No products found..." and try it in the running application again
8. Let's update the logic in the `setTimeout` to set the value of `products` signal to the mocked products instead of empty array `[]` and try it in the running app again
9. (Optional) Use the `error` signal to simulate error state and display it in the template using `@if`, what would be the appropriate place in template, when does it make sense to display error in regard to loading state and the list of products?

## TODO 5 - Communication between components

Now we're going to turn our focus back to the product item component to implement
a basic example of communication between components

1. In the `product-item.component.ts` file, let's define a new property `remove` and initialize it with a new signals based output (`output<string>()`)
2. In the `product-item.component.html` file, let's add a button with `mat-icon-button` directive and `mat-icon` component (use `delete` icon) (mind tpl ctx)
3. With the button ready, let's define a `(click)` handler which is going to call `emit` method of the `remove` output with an appropriate argument (we want to emit product `id` which is a `string`)
4. Back in the `product-list.component.html` file, let's add a `(remove)` event binding (this might show error in IDE as signals based outputs are very new, but it will compile just fine) to the product item component and call `removeProduct` method with `$event` as an argument. The `$event` is a special keyword that is used to access the value emitted by the output (or a native DOM event in case of binding for native DOM events like `click` or `keydown`)
5. In the `product-list.component.ts` file, let's define the `removeProduct` method (what argument will it receive?) which is going to remove the product from the `products` signal array, use the `update` method and perform the removal in an immutable way (we don't want to mutate the original array)
6. Let's verify that everything works as expected in the running app, we should be able to remove products from the list by clicking the trash icon (refreshing page will refresh our test data)
7. Removing all products should display the empty state we've implemented previously

## TODO 6 - Product list filtering (client side)

Let's add a basic client-side filtering to the product list component

1. In the `product-list.component.ts` Let's define `showFilter` signals based boolean flag and initialize it to `false`
2. In the `product-list.component.html` file, let's add a button with `mat-mini-fab` directive and `mat-icon` component (use `filter_list` icon) (mind tpl ctx) after the `<h2>Prouct list</h2>` heading
3. With button ready, define `color` attribute and use the current value of the `showFilter` signal to conditionally set the color to `accent` or `primary` using an inline ternary expression (eg `condition ? a : b`). We want to use `accent` color when the filter is active!
4. Let's define a `(click)` handler for the button which is going to toggle the value of the `showFilter` signal, the logic is so trivial and isolated we're going to implement it inline in the template `(click)` handler (we could always create a real component method if the logic is more complex, or we want to re-use it in multiple places in the template)
5. Let's add a new `@if` control flow block in the `product-list.component.html` between the heading and the actual product list (after the `div` which holds the `h2` and the newly created `button`) and bind it to the current value of the `showFilter` signal
6. Inside the `@if` block, let's add following markup (always mind tpl ctx and try to use IDE to help you with the imports)
```html
<div class="mb-8">
    <mat-form-field class="w-full">
        <mat-label>Fulltext search</mat-label>
        <input type="text" matInput>
    </mat-form-field>
</div>
```
7. Let's define `query` signal in the `product-list.component.ts` file, with an empty string as the initial value. 
8. Let's bind it to previously created input field in the template using `[(ngModel)]` directive (mind tpl ctx) 
9. Let's add a new `keydown` event handler on the input field which is going to set `query` to an empty string when user presses `escape`, the specific key can be specified using `event-name.event-subtype` syntax (separator is `.`) 
10. Verify that everything works as expected in the running app, we should be able to toggle the filter and see the input field when it's active, write some query and clear it by pressing `escape` key
11. Create new `filteredProducts` as a `computed` signal which is going to filter the `products` signal based on the `query` signal by checking if the product `name` includes the `query` (use `toLowerCase` to make it case-insensitive), if `products` are `undefined`, just return `undefined`
12. Use filtered products in the `@for` control flow statement instead of the `products` signal and verify that everything works as expected in the running app, we should be able to filter the list of products based on the query
13. Add `<mat-hint>` in the `<mat-form-field>` to display the number of **filtered products / total available products**, multiple approaches are possible, does it make sense to wrap it with additional `@if` block? and if so why?

## Congratulations!
### You have successfully finished the exercise!
Make sure to remember (or write down) any questions you might have
and ask them as that way everyone learns even more!

## Discussion

* Why we should store all our state as Angular signals? (What is the only exception to this rule?)
* What are the 3 main advantages of using `@for` instead of `*ngFor` directive?
* What is the main advantage of using `input.require` signals based component inputs?
* When accessing signals vs plain properties, what help does Angular compiler provide when we make a mistake?
* What is the non-obvious advantage of using Angular signals in regard to Angular API surface, especially lifecycle hooks?
* What's the best (easiest) way to manage template context when using IDE like WebStorm or IDEA?

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run test:watch`
- single test can be run with `npm t -- <part-of-the-test-file-name>`, eg `npm t -- product-list`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item
