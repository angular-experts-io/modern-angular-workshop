import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Component,
  computed,
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
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, startWith, switchMap, tap } from 'rxjs';

import { CardComponent } from '../../../ui/card/card.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import {
  isIntegerValidator,
  isNumberValidator,
} from '../../../core/validator/number.validator';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    MatButton,
    MatError,
    MatInput,
    MatLabel,
    MatOption,
    MatPrefix,
    MatSuffix,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatMiniFabButton,
    MatProgressSpinner,
    MatAutocompleteTrigger,
    CardComponent,
    CardStatusComponent,
    ProductEditorSkeletonComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string | undefined>();
  error = signal<string | undefined>(undefined);
  loading = signal<boolean>(false);
  loadingShowSkeleton = signal<boolean>(true);
  isNewProduct = signal<boolean>(false);
  isNewProductCreated = signal<boolean>(false);
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
      switchMap((id) => {
        if (!id) {
          this.loadingShowSkeleton.set(false);
          this.isNewProduct.set(true);
          return [undefined];
        }
        this.isNewProduct.set(false);
        return this.productService.findOne(id).pipe(
          catchError((error) => {
            this.error.set(error.message);
            return [undefined];
          }),
        );
      }),
      tap(() => this.loadingShowSkeleton.set(false)),
    ),
  );

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    supplier: this.formBuilder.group({
      name: ['', [Validators.required]],
      origin: ['', [Validators.required]],
    }),
    price: [<number | null>null, [Validators.required, isNumberValidator()]],
    pricePerMonth: this.formBuilder.array(
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
    effect(() => this.reset(this.product()));
    effect(() => (this.disabled() ? this.form.disable() : this.form.enable()));
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
      this.loading.set(true);
      if (this.isNewProduct()) {
        this.productService
          .create(this.form.value as unknown as Product)
          .pipe(
            tap(() => {
              this.loading.set(false);
              this.isNewProductCreated.set(true);
              this.form.markAsPristine();
            }),
            catchError((error) => {
              this.error.set(error.message);
              return [undefined];
            }),
          )
          .subscribe();
      } else {
        this.productService
          .update({
            ...this.form.value,
            id: this.productId(),
          } as unknown as Product)
          .pipe(
            tap(() => this.loading.set(false)),
            catchError((error) => {
              this.error.set(error.message);
              return [undefined];
            }),
          )
          .subscribe(() => this.form.markAsPristine());
      }
    }
  }

  reset(product?: Product) {
    this.pricePerMonth.clear();
    if (product) {
      this.form.reset(product);
      product?.pricePerMonth?.forEach((price) => this.addPricePerMonth(price));
    } else {
      this.form.reset({});
    }
  }

  close() {
    this.router.navigate(this.productId() ? ['../../'] : ['../'], {
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }
}
