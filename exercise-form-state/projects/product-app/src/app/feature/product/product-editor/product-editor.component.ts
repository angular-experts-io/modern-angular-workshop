import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatInput } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CategoryService } from '../../../core/category/category.service';
import { isIntegerValidator, numberValidator } from '../../../core/validator/number.validator';
import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatLabel,
    MatError,
    MatSuffix,
    MatButton,
    MatOption,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatMiniFabButton,
    MatAutocompleteTrigger,
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
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [<number | null>null, [Validators.required, numberValidator()]],
    quantity: [<number | null>null, [Validators.required, isIntegerValidator()]],
    supplier: this.#formBuilder.group({
      name: ['', [Validators.required]],
      origin: ['', [Validators.required]],
    }),
    category: ['', [Validators.required]],
    pricePerMonth: this.#formBuilder.array(
      [],
      [Validators.required, Validators.minLength(6)],
    ),
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

  get pricePerMonth() {
    return this.form.controls.pricePerMonth as FormArray;
  }
  addPricePerMonth(price?: number) {
    this.pricePerMonth.push(
      this.#formBuilder.control(price ?? 0, [
        Validators.required,
        numberValidator(),
      ]),
    );
  }
  removePricePerMonth(index: number) {
    this.pricePerMonth.removeAt(index);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {

    }
  }

  reset() {
    this.form.reset();
  }
}
