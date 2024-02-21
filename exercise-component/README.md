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


## TODO 2 - Product List

