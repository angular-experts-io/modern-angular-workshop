import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  form,
  FormField,
  hidden,
} from '@angular/forms/signals';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';

import { CardComponent } from '../../../ui/card/card.component';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

import { EMPTY_PRODUCT_FORM_MODEL } from '../product.model';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    RouterLink,
    FormField,
    MatIcon,
    MatLabel,
    MatInput,
    MatOption,
    MatSuffix,
    MatSelect,
    MatCheckbox,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatMiniFabButton,
    MatAutocompleteTrigger,
    CardComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  productFormModel = linkedSignal(() => EMPTY_PRODUCT_FORM_MODEL);

  form = form(this.productFormModel, (fieldTree) => {
    hidden(fieldTree.certificationType, {
      when: ({ valueOf }) => !valueOf(fieldTree.isCertified),
    });

    // TODO 1: import and use "required" validation helper and define it for
    // name, description, category, price and quantity fields, for each field also
    // pass in second options object with validation "message"
    // (in real projects, the message would contain translation key instead of user message)
    //
    //
    // TODO 4: add required also for supplier name and origin
    //
    //
    // TODO 6: add required validation for certificationType field,
    // BUT only when the isCertified checkbox is checked
    // the required options object accepts also "when" property which
    // should contain an arrow function returning boolean (check hidden condition for reference)
    //
    //
    // TODO 8: add validation for form array pricePerMonth to have at least 6 entries
    // use minLength validation helper
    //
    //
    // TODO 12: let's also validate EVERY item in the pricePerMonth array to be required
    // to achieve that, we have to define a new schema (we can define it inline)
    // let's create a new "const PricePerMonthSchema" which will use "schema" helper function
    // with generic type <number | null>
    // this matches the array items, where null represents an empty numeric input
    // the argument of "schema" helper will be the function
    // which receives "price" argument, then use the required validation helper on the price argument
    // with appropriate message
    // finally, use the "applyEach" helper function to apply the "PricePerMonthSchema"
    // to each item in the "fieldTree.pricePerMonth" array
    //
    //
    // TODO 14: custom validator, ensure that the "price" field is higher than 500
    // if category is "Coffee Machine" or "Coffee Grinder"
    // let's use "validate" helper function on "fieldTree.price" field
    // the second argument is an arrow function in which we can destructure
    // "value" and "valueOf" helper
    // inside the function, check if the category (using valueOf helper) is
    // either "Coffee Machine" or "Coffee Grinder" and the price value is
    // less than or equal to 500, if so, return an object with "kind" and "message" properties
    // otherwise return null
  });
  filteredCategoryOptions = computed(() =>
    this.#categoryService
      .categories()
      .filter((cat) =>
        cat.toLowerCase().includes(this.form.category().value().toLowerCase()),
      ),
  );

  addPricePerMonth() {
    this.form.pricePerMonth().value.update((prices) => [...prices, null]);
    // TODO 9: make sure that the field is marked as touched and dirty after adding new entry

  }

  removePricePerMonth(index: number) {
    this.form
      .pricePerMonth()
      .value.update((prices) => prices.filter((_, i) => i !== index));
    // TODO 10: make sure that the field is marked as touched and dirty after removing an entry

  }
}
