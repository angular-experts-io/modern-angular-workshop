import { RouterLink } from '@angular/router';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatInput, MatLabel } from '@angular/material/input';

import {
  isIntegerValidator,
  isNumberValidator,
} from '../../../core/validator/number.validator';
import { CardComponent } from '../../../ui/card/card.component';

import { ProductStore } from '../product.store';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatError,
    MatLabel,
    MatOption,
    MatButton,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatProgressSpinner,
    MatAutocompleteTrigger,
    CardComponent,
    ProductItemSkeletonComponent,
    ProductEditorSkeletonComponent,
    MatPrefix,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear();

  store = inject(ProductStore);

  // from route params :productId
  productId = input<string | undefined>();

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    supplier: ['', [Validators.required]],
    price: [<number | null>null, [Validators.required, isNumberValidator()]],
    pricePerMonth: this.formBuilder.array([]),
    quantity: [
      <number | null>null,
      [Validators.required, isIntegerValidator()],
    ],
  });
  categoryInputValue = toSignal(
    this.form.controls.category.valueChanges.pipe(
      debounceTime(250),
      startWith(''),
    ),
    { initialValue: '' },
  );
  filteredCategoryOptions = computed(() =>
    this.categoryService
      .categories()
      .filter((option) =>
        option
          .toLowerCase()
          .includes(this.categoryInputValue()?.toLowerCase() ?? ''),
      ),
  );

  constructor() {
    effect(
      () => {
        this.store.selectProduct(this.productId());
      },
      { allowSignalWrites: true },
    );
    effect(() => this.reset());
    effect(() => {
      this.store.editorLoading() ? this.form.disable() : this.form.enable();
    });
    this.destroyRef.onDestroy(() => this.store.selectProduct(undefined));
  }

  get pricePerMonth() {
    return this.form.controls.pricePerMonth as FormArray;
  }
  addPricePerMonth(price?: number) {
    this.pricePerMonth.push(
      new FormControl<number>(price ?? 0, [
        Validators.required,
        isNumberValidator(),
      ]),
    );
  }
  removePricePerMonth(index: number) {
    this.pricePerMonth.removeAt(index);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.store.selectedProduct()) {
        const productForUpdate = {
          ...this.store.selectedProduct(),
          ...this.form.getRawValue(),
        };
        console.log(this.form.getRawValue());
        delete productForUpdate.averagePrice;
        this.store.update(productForUpdate as any);
      }
    }
  }

  reset() {
    this.form.controls.pricePerMonth.clear();
    this.form.reset(this.store.selectedProduct() ?? {});
    if (this.store.selectedProduct()) {
      const pricePerMonth = this.store.selectedProduct()?.pricePerMonth;
      if (pricePerMonth) {
        [...pricePerMonth]
          .reverse()
          .forEach((price) => this.addPricePerMonth(price));
      }
    }
  }
}
