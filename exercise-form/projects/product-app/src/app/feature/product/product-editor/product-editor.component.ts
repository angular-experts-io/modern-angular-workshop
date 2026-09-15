import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    CardComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  // TODO 7: inject CategoryService (form core)

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  // TODO 3: create a new "productFormModel" property and initialize it with linkedSignal
  // with an arrow function which returns "EMPTY_PRODUCT_FORM_MODEL"

  // TODO 4: create a new "form" property and initialize it with the Angular Signals "form"
  // factory which accepts the "productFormModel", this will give us type-safe access to all
  // form properties in the template (from @angular/forms/signals package)


  // TODO 17: let's implement a conditional field with the help of Angular Signals "hidden" method
  // for the "certificationType" which will be a dropdown that we will show only if user clicks
  // on a checkbox bound to "isCertified" field
  // first, let's add an arrow function with "fieldTree" argument to the "form(this.productFormModel)"
  // then in the function, use the "hidden" Angular Signals forms method which
  // accepts a field which should be shown conditionally ( "certificationType" ) and an arrow function
  // where we can destructure the "valueOf" helper function from its argument
  // then we want to make sure to hide certificationType when isCertified is false
  // hint: we can access both fields from "fieldTree.<field-name>

  // TODO 8: now we're going to implement "category" field as a typeahead
  // let's first create a new computed signal called "filteredCategoryOptions"
  // it will use "categories" signal from CategoryService and value signal of the category
  // form field (FieldState) to filter the "categories" signal value from the form (toLowerCase())
  // this will demonstrate the distinction between form fieldTree (form.category)
  // vs form field state (instance) ( form.category().value())

  // TODO 11:  now we're going to implement form array for the price per month field (multiple values)
  // the form arrays have the most complex handling of all form field types
  // let's add a new method called "addPricePerMonth", then inside of it we will
  // get access to the form.pricePerMonth() instance and use its ".value" (signal) update (method)
  // which is a standard signal method to add additional new price to the array ("null")

  // TODO 14: let's add a new method called "removePricePerMonth" which will accept an index parameter
  // and will remove the form field from the pricePerMonth form array at the given index
  // the removal will work in a very similar way to previously created "addPricePerMonth"

}
