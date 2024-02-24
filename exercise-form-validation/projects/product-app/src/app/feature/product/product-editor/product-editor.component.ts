import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../core/category/category.service';
import { debounceTime } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { isNumberValidator } from '../../../core/validator/is-number.validator';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    // TODO 1: import ReactiveFormsModule
    RouterLink,
    MatIcon,
    MatIconButton,
    CardComponent,
    CardComponent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    MatLabel,
    MatMiniFabButton,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatButton,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  // TODO 2: inject FormBuilder service

  // TODO 11: inject CategoryService (form core)
  #formBuilder = inject(FormBuilder);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  // TODO 3: crate a new form property and initialize it with the formBuilder.group method
  form = this.#formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [<number | null>null, [Validators.required, isNumberValidator()]],
    quantity: [<number | null>null, [Validators.required, isNumberValidator()]],
    supplier: this.#formBuilder.group({
      name: ['', [Validators.required]],
      origin: ['', [Validators.required]],
    }),
    category: ['', [Validators.required]],
    pricePerMonth: this.#formBuilder.array([], [Validators.required, Validators.minLength(6)]),
  });
  categoryInputValue = toSignal(
    this.form.controls.category.valueChanges.pipe(debounceTime(250)),
    { initialValue: '' },
  );
  filteredCategoryOptions = computed(() => {
    return this.#categoryService.categories().filter((category) => {
      return category
        .toLowerCase()
        .includes(this.categoryInputValue()?.toLowerCase() ?? '');
    });
  });

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
  // (the Angular Reactive Forms are strongly typed since Angular v14 so we can just use . access)
  // let's use debounceTime(250) in the pipe to debounce the input value changes
  // let's provide empty string as an initial value for the signal

  // TODO 12: let's create a new computed signal called "filteredCategoryOptions"
  // it will use "categories" signal from CategoryService and "categoryInputValue" signal
  // and combine them to filter the categories based on the input value


  // TODO 14:  now we're going to implement form array for the price per month field
  // the form arrays have the most complex handling of all form control types
  // first let's add "pricePerMonth" field to the form group
  // and initialize it with the formBuilder.array method with empty array as the first argument

  // TODO 15: let's define a getter for the pricePerMonth field which will get it
  // with help of property access from the form controls and cast it to the FormArray type manually

  // TODO 16: let's add a new method called "addPricePerMonth" which will accept an optional price parameter
  // and will push a new FormControl to the pricePerMonth form array
  // the form control will be initialized with price or 0 if the price is not provided

  // TODO 17: let's add a new method called "removePricePerMonth" which will accept an index parameter
  // and will remove the form control from the pricePerMonth form array at the given index
  // using provided method of the FormArray type (try IDE code completion to get the correct reference)

  get pricePerMonth() {
    return this.form.controls.pricePerMonth as FormArray;
  }
  addPricePerMonth(price?: number) {
    this.pricePerMonth.push(
      this.#formBuilder.control(price ?? 0, [Validators.required, isNumberValidator()]),
    );
  }
  removePricePerMonth(index: number) {
    this.pricePerMonth.removeAt(index);
  }

  // TODO 22: let's add form validation to the form fields, each field is required
  // so we're going to add Validators.required (provided by Angular) to each field
  // we're going to use shorthand syntax which means the validators are passed
  // as an array and a second argument of each field ['', [/* here */]]
  // for the pricePerMonth field we're going to add Validators.required and Validators.minLength(6)
  // which means we have to provide at least 6 months of prices
  // in the "addPricePerMonth" method we're going to add required validator as well

  // TODO 25: let's use recently finished isNumberValidator in the price and quantity fields
  // as well as in each added pricePerMonth form control

  // TODO 28: let's add a new method called "save" which will be called when the form is submitted
  // we're going to mark all fields as touched to display validation errors (form has such method)
  // after that we're going to prepare an if block to check if form state is valid and leave it empty for now
   save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {

    }
   }
}
