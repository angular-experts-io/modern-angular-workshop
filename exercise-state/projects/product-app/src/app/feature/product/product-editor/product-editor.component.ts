import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, switchMap, tap } from 'rxjs';

import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CategoryService } from '../../../core/category/category.service';
import {
  isIntegerValidator,
  numberValidator,
} from '../../../core/validator/number.validator';
import { CardComponent } from '../../../ui/card/card.component';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';
import { ProductApiService } from '../product-api.service';
import { Product } from '../product.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';

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
    ProductEditorSkeletonComponent,
    MatProgressSpinner,
    CardStatusComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #formBuilder = inject(FormBuilder);
  #categoryService = inject(CategoryService);
  #productApiService = inject(ProductApiService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  // from route param
  productId = input<string | undefined>();

  // TODO 24: (optional): try to move state into the product service
  // (hint: we want to have a service based selectedProductId and selectedProduct signals)
  // (these signal derive the product from the original product list already managed by the product service)
  error = signal<string | undefined>(undefined);
  loading = signal(false);
  loadingShowSkeleton = signal(true);
  isNewProduct = signal(false);
  isNewProductCreated = signal(false);
  disabled = computed(
    () =>
      this.loading() ||
      this.loadingShowSkeleton() ||
      this.isNewProductCreated(),
  );
  product = toSignal(
    toObservable(this.productId).pipe(
      tap(() => {
        this.loadingShowSkeleton.set(true);
        this.error.set(undefined);
      }),
      switchMap((productId) => {
        if (productId === undefined) {
          this.isNewProduct.set(true);
          return [undefined];
        } else {
          this.isNewProduct.set(false);
          return this.#productApiService.findOne(productId).pipe(
            catchError((error) => {
              this.error.set(error.message ?? error.toString());
              return [undefined];
            }),
          );
        }
      }),
      tap(() => {
        this.loadingShowSkeleton.set(false);
      }),
    ),
  );

  form = this.#formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [<number | null>null, [Validators.required, numberValidator()]],
    quantity: [
      <number | null>null,
      [Validators.required, isIntegerValidator()],
    ],
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

  constructor() {
    effect(() => this.reset(this.product()));
    effect(() => (this.disabled() ? this.form.disable() : this.form.enable()));
  }

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
      this.loading.set(true);
      if (this.isNewProduct()) {
        this.#productApiService
          .create(this.form.value as unknown as Product)
          .pipe(
            tap(() => {
              this.loading.set(false);
              this.isNewProductCreated.set(true);
              this.form.markAsPristine();
            }),
            catchError((error) => {
              this.error.set(error.message ?? error.toString());
              return [];
            }),
          )
          .subscribe();
      } else {
        this.#productApiService
          .update({
            ...this.form.value,
            id: this.productId() as string,
          } as unknown as Product)
          .pipe(
            tap(() => {
              this.loading.set(false);
              this.form.markAsPristine();
            }),
            catchError((error) => {
              this.error.set(error.message ?? error.toString());
              return [];
            }),
          )
          .subscribe();
      }
    }
  }

  reset(product?: Product) {
    this.pricePerMonth.clear();
    if (product === undefined) {
      this.form.reset({});
    } else {
      this.form.reset(product);
      if (product.pricePerMonth) {
        product.pricePerMonth?.forEach((price) => this.addPricePerMonth(price));
      }
    }
  }

  close() {
    this.#router.navigate(this.productId() ? ['../..'] : ['..'], {
      queryParamsHandling: 'merge',
      relativeTo: this.#route,
    });
  }
}
