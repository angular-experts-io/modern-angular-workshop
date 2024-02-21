<img height="60" src="https://angularexperts.io/assets/images/logo/angular-experts.svg">

# Modern Angular Workshop

by [@tomastrajan](https://twitter.com/tomastrajan) from [AngularExperts.io](https://angularexperts.io)

# Welcome to exercise - Components

In this exercise were going to explore how to use components in Angular to display state (data) to the user and how to handle user interaction like clicks to trigger changes in the state.

- How to store state in components
- How to display state in the template
- How to handle user interaction

## TODO 1 - Navigation

Let's start with something simple, we're going to extract navigation as a data structure (wrapped in an Angular Signal)
and use it to display navigation items in the template.

1. In the `main-laout.component.ts` file, create a new property `navigation` and assign it an array of navigation items for both `home` and `product` features. The object should have two properties, `route` and `label`.
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

## TODO 4 - Product item

1. Let's create a `product-item` component in the `product` feature using Angular Schematics (IDE integration), click on `product` lazy feature folder and run **Angular Schematics...**
2. In the `product-item.component.ts` define `product` property as a **required** Angular Signals based `input` which accepts `Product` type
3. In the `product-item.component.html` lets add the following markup
```html 
<div class="p-4 bg-white rounded-lg shadow-sm">
    
</div>
```
4. Inside the `<div>`, display product name as `h4` (what is the `product` in this case, how do we have to access its value?)
5. Back in the `product-item.component.html`, let's replace the `<p>` which we used to display product name with the newly created product item component, always try to use self-closing tags (as it's a standalone component, we have to make sure that it's the part of current template context which belongs to and is managed by the product list component)
6. Make sure to pass `product` to the product item component using standard `[someInput]` binding 
7. Let's verify that everything works in the running app, it should look like a bunch of cards displaying product names
8. Let's display some additional data in the product item component like `description` and `price` (we can use basic `<p>` tags for the moment)
9. The `Product` object also contains `pricePerMonth` array of multiple prices, we're going to use it to calculate `averagePrice` (an example of **derived** state)
10. Before signals, we would achieve this by creating a new `averagePrice` property, and then in the `ngOnChanges` lifecycle hook,  we would calculate and assign its value any time the product changes, let's do that quickly, and then we're going to refactor it to use signals instead (average price can be rounded with `toFixed(2)`)
11. Let's re-define `averagePrice` as a `computed` signal and calculate this way instead!
12. Now we have to update the `product-item.component.html` to display the `averagePrice` as signal instead of plain property
13. Let's validate that everything works as expected in the running app

The `computed` signals are the best way to create derived state in Angular, and we should always use them instead of plain properties, especially when the derived state is based on other signals as it's a future-proof way to write components which will make it easier to embrace signals based components once they are released.

## TODO 3 - Basic interaction

Now we're going to add some basic interaction to the product list component, 
we're going to mock the loading / loaded flow which is going to happen based 
on performing backend requests in an actual application.

1. In the `product-list.component.ts` file set the value of `loading` signal to `true` and `products` signal to `undefined` (we're going to simulate the loading state)
2. In the `product-list.component.html` file, let's  use `@if` and `@else` control flow statements to display "Loading..." when `loading` signal is `true` and the list of products when `loading` signal is `false`
3. The running app should display "Loading..." 
4. Let's add a button before the `@if` (eg with `mat-raised-button` directive, mind tpl ctx) which is going to call method `mockLoadData()` when used clicks `(click)`
5. Let's define the `mockLoadData()` method in the `product-list.component.ts` file, which is going to set the value of `loading` signal to `true` and then we're going to add `setTimeout` (eg with delay 1s) and inside we're going to set `products` signal to `[]` (empty array) and `loading` to `false`
6. In the running application, we're going to see the "Loading..." and after a click and short delay we won't see anything. Previously, we would solve it with another `@if` to show an empty state if we loaded an empty collection of products, but now there is a better way!
7. Add `@empty` after the closing `}` of the `@for` ( in the similar way the `@if` and `@else` are working) to define an empty state which says "No products found..." and try it in the running application again
8. Let's update the logic in the `setTimeout` to set the value of `products` signal to the mocked products instead of empty array `[]` and try it in the running app again

## TODO 5 - Inter component communication

Now we're going to turn our focus back to the product item component to implement
a basic example of inter component communication

1.

## TODO 6 - Product list filtering (client side)

## How to use exercises

- every exercise folder should be installed using `npm ci`
- every exercise can and **should be started** using `npm start` to run the app
- every exercise can start tests in watch mode using `npm run watch`
- every exercise has its own `README.md` file with additional description of the given exercise
- every exercise project contains ordered `TODO` in the readme and `// TODO` comments inside the source code (eg `// TODO 2: description`) which should be followed to complete the given exercise
- you can always search for `// TODO`, or `<!-- TODO` or check `README.md` for the next TODO item
