import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { debounceTime } from 'rxjs';

import { CardComponent } from '../../../ui/card/card.component';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    MatLabel,
    MatError,
    MatInput,
    MatOption,
    MatSuffix,
    MatButton,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatMiniFabButton,
    MatAutocompleteTrigger,
    CardComponent,
    CardComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  #formBuilder = inject(FormBuilder);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  form = this.#formBuilder.group({
    name: [''],
    description: [''],
    price: [<number | null>null],
    quantity: [<number | null>null],
    supplier: this.#formBuilder.group({
      name: [''],
      origin: [''],
    }),
    category: [''],
    pricePerMonth: this.#formBuilder.array([]),
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

  addPricePerMonth(price?: number) {
    this.form.controls.pricePerMonth.push(this.#formBuilder.control(price ?? 0));
  }
  removePricePerMonth(index: number) {
    this.form.controls.pricePerMonth.removeAt(index);
  }

  // TODO 1: let's add form validation to the form fields, each field is required
  // so we're going to add Validators.required (provided by Angular) to each field
  // we're going to use shorthand syntax which means the validators are passed
  // as second argument (which is an array of validators) of each field ['', [/* here */]]
  // for the pricePerMonth field we're going to add Validators.required and Validators.minLength(6)
  // which means we have to provide at least 6 months of prices
  // in the "addPricePerMonth" method we're going to add required validator as well

  // TODO 5: let's use recently finished isNumberValidator in the price field
  // as well as in each added pricePerMonth form control (not the array itself)

  // TODO 6: let's use recently finished isIntegerValidator and add it to the quantity field

  // TODO 10: let's add a new method called "save" which will be called when the form is submitted
  // we're going to mark all fields as touched to display validation errors (form has such method)
  // after that we're going to prepare an if block to check if form state is valid and console.log the form value

  // TODO 12: let's add a new method called "reset" which will be called when user clicks on reset button
  // we're going to call reset method on the form and pass an empty object to reset the form to its initial state
  // (in following exercise, we're going to learn how to reset form to a specific state)
}
