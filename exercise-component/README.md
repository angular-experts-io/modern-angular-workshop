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
3. In the `main-layout.component.html` file, we're going to use the `navigation` property to display navigation items using the new `@for` control flow syntax, keep in mind that `@for` requires a mandatory `track` expression, what would be a good unique identifier for each navigation item? What are the advantages of this approach compared to `*ngFor` directive? (3 main advantages)
4. Let's refactor the `navigation` property to use Angular Signal instead of just plain data, in general we want to store state in signals because that way we are writing future-proof logic which will make it easier to embrace signals based components once they are released.
   
In general, static data could still be stored in plain properties, but in real life application, it's easy to imagine that navigation could be adjusted based on user roles / purchased subscription / ...) so it's better to start with signals from the beginning as there is little downside to doing so...



## TODO 2 - Product list

Let's display a list of products in the `product-list.component.html` template.
The exercise comes with a mocked data set of products stored in the `products.mock.ts` 
file and an `Product` interface stored in the `product.model.ts` file, in practice 
we would create the model file to describe data we're receiving from the backend API endpoint.

1. Let's create a couple of signals in the `product-list.component.ts` file to store array of products `Product[]` (or `undefined`), loading state `boolean` and error state `string` (or `undefined`).
2. Let's set the value of `products` signal to the mocked data set from the `products.mock.ts` file.
3. In the `product-list.component.html` file, let's display the list of products (just render their name) with the help of `@for` control flow syntax.


## TODO 4 - Product item

## TODO 3 - Basic interaction

## TODO 5 - Product list filtering (client side)
