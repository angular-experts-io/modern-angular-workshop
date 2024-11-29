import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    RouterLink,
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
    CardStatusComponent,
    ProductItemSkeletonComponent,
    ProductEditorSkeletonComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productService = inject(ProductService);

  // from route params :productId
  productId = input<string | undefined>();

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
    effect(
      () => {
        this.productService.updateSelectedProductId(this.productId());
      },
      { allowSignalWrites: true },
    );
    effect(() => this.reset());
    effect(() => {
      this.productService.editorDisabled()
        ? this.form.disable()
        : this.form.enable();
    });
    this.destroyRef.onDestroy(() => {
      this.productService.updateSelectedProductId(undefined);
      this.productService.updateEditorNewProductCreated(false);
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
      if (this.productService.selectedProduct()) {
        const productForUpdate = {
          ...this.productService.selectedProduct(),
          ...this.form.getRawValue(),
        };
        delete productForUpdate.averagePrice;
        this.productService.update(productForUpdate as unknown as Product);
      } else {
        this.productService.create(
          this.form.getRawValue() as unknown as Product,
        );
      }
      this.form.markAsPristine();
    }
  }

  reset() {
    this.form.controls.pricePerMonth.clear();
    this.form.reset(this.productService.selectedProduct() ?? {});
    if (this.productService.selectedProduct()) {
      const pricePerMonth =
        this.productService.selectedProduct()?.pricePerMonth;
      if (pricePerMonth) {
        [...pricePerMonth].forEach((price) => this.addPricePerMonth(price));
      }
    }
  }

  close() {
    this.router.navigate(this.productId() ? ['../../'] : ['../'], {
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }
}
