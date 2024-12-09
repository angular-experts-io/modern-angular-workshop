import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import {
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
import {
  MatFormField,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatError, MatInput, MatLabel } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';

import {
  isIntegerValidator,
  isNumberValidator,
} from '../../../core/validator/number.validator';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CardComponent } from '../../../ui/card/card.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';

import { Product } from '../product.model';
import { ProductStore } from '../product.store';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatError,
    MatLabel,
    MatOption,
    MatButton,
    MatPrefix,
    MatSuffix,
    MatFormField,
    MatIconButton,
    MatMiniFabButton,
    MatAutocomplete,
    MatProgressSpinner,
    MatAutocompleteTrigger,
    CardComponent,
    ProductEditorSkeletonComponent,
    CardStatusComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #formBuilder = inject(FormBuilder);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  store = inject(ProductStore);

  // from route params :productId
  productId = input<string | undefined>();

  form = this.#formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    supplier: this.#formBuilder.group({
      name: ['', [Validators.required]],
      origin: ['', [Validators.required]],
    }),
    price: [<number | null>null, [Validators.required, isNumberValidator()]],
    pricePerMonth: this.#formBuilder.array(
      [],
      [Validators.required, Validators.minLength(6)],
    ),
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
  filteredCategoryOptions = computed(() => {
    // unwrapping signal here means computed is guaranteed to
    // be marked as dirty on this signal change even if there are 0 categories in array
    const categoryInputValue = this.categoryInputValue();
    return this.#categoryService
      .categories()
      .filter((option) =>
        option.toLowerCase().includes(categoryInputValue?.toLowerCase() ?? ''),
      );
  });

  constructor() {
    effect(() => {
      this.store.selectProduct(this.productId());
    });
    effect(() => this.reset());
    effect(() => {
      this.store.editorDisabled() ? this.form.disable() : this.form.enable();
    });
    this.#destroyRef.onDestroy(() => {
      this.store.selectProduct(undefined);
      this.store.unsetEditorNewProductCreated();
    });
  }

  addPricePerMonth(price?: number) {
    this.form.controls.pricePerMonth.push(
      new FormControl<number>(price ?? 0, [
        Validators.required,
        isNumberValidator(),
      ]),
    );
    this.form.controls.pricePerMonth.markAsTouched();
    this.form.controls.pricePerMonth.markAsDirty();
  }

  removePricePerMonth(index: number) {
    this.form.controls.pricePerMonth.removeAt(index);
    this.form.controls.pricePerMonth.markAsTouched();
    this.form.controls.pricePerMonth.markAsDirty();
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.store.selectedProduct()) {
        const productForUpdate = {
          ...this.store.selectedProduct(),
          ...this.form.getRawValue(),
        };
        delete productForUpdate.averagePrice;
        this.store.update(productForUpdate as unknown as Product);
      } else {
        this.store.create(this.form.getRawValue() as unknown as Product);
      }
      this.form.markAsPristine();
    }
  }

  reset() {
    this.form.controls.pricePerMonth.clear();
    this.form.reset(this.store.selectedProduct() ?? {});
    if (this.store.selectedProduct()) {
      const pricePerMonth = this.store.selectedProduct()?.pricePerMonth;
      if (pricePerMonth) {
        [...pricePerMonth].forEach((price) => this.addPricePerMonth(price));
      }
    }
  }

  close() {
    this.#router.navigate(this.productId() ? ['../../'] : ['../'], {
      queryParamsHandling: 'merge',
      relativeTo: this.#route,
    });
  }
}
