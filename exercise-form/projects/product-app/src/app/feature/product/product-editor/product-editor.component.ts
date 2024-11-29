import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';

import { CardComponent } from '../../../ui/card/card.component';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    // TODO 1: import ReactiveFormsModule
    RouterLink,
    MatError,
    MatInput,
    MatLabel,
    MatIcon,
    MatSuffix,
    MatButton,
    MatFormField,
    MatIconButton,
    MatMiniFabButton,
    CardComponent,
    CardComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  // TODO 2: inject FormBuilder service

  // TODO 11: inject CategoryService (form core)

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  // TODO 3: crate a new form property and initialize it with the formBuilder.group method

  // TODO 5: in the form group define basic fields for the product, use array shorthand syntax
  // "name", "description" as strings, initialize them with empty string
  // "price", "quantity" as numbers, initialize them as null (prefix with generic type <number|null>

  // TODO 7: let's add a new form field called "supplier" and initialize it
  // with the nested form group using the formBuilder.group method
  // the nested form group will have two fields, "name" and "origin" as strings

  // TODO 9: let's add an additional field called "category" and initialize it with an empty string

  // TODO 10: let's define new signal called "categoryInputValue"
  // and define it with help of toSignal method which is going to subscribe
  // to the valueChanges of the category control of the form (try to use IDE code completion to get the correct reference)
  // (hint: form has controls property which allows to access the form controls by their names)
  // (the Angular Reactive Forms are strongly typed since Angular v14 so we can just use . access)
  // let's use debounceTime(250) in the pipe to debounce the input value changes
  // let's provide empty string as an initial value for the signal

  // TODO 12: let's create a new computed signal called "filteredCategoryOptions"
  // it will use "categories" signal from CategoryService and "categoryInputValue" signal
  // and combine them to filter the categories based on the input value

  // TODO 14:  now we're going to implement form array for the price per month field (multiple values)
  // the form arrays have the most complex handling of all form control types
  // first let's add "pricePerMonth" field to the form group
  // and initialize it with the formBuilder.array method with empty array as the first argument

  // TODO 15: let's add a new method called "addPricePerMonth" which will accept an optional price parameter
  // and will push a new FormControl to the pricePerMonth form array
  // the form control will be initialized with price or 0 if the price is not provided

  // TODO 16: let's add a new method called "removePricePerMonth" which will accept an index parameter
  // and will remove the form control from the pricePerMonth form array at the given index
  // using provided method of the FormArray type (try IDE code completion to get the correct reference)
}
