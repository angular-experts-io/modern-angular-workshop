import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  applyEach,
  disabled,
  Field,
  form,
  hidden,
  minLength,
  required,
  SchemaPathTree,
  submit,
} from '@angular/forms/signals';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';

import { CardComponent } from '../../../ui/card/card.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

import { ProductService } from '../product.service';
import {
  EMPTY_PRODUCT_FORM_MODEL,
  Product,
  ProductFormModel,
  ProductUpsert,
} from '../product.model';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'my-org-product-editor',
  imports: [
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
    Field,
    MatCheckbox,
    MatSelect,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #productService = inject(ProductService);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string | undefined>();
  productResource = httpResource<Product>(() =>
    this.productId() ? `/products/${this.productId()}` : undefined,
  );

  error = linkedSignal(() => this.productResource.error()?.message);
  saving = signal(false);
  isNewProductCreated = signal(false);
  disabled = computed(
    () => this.saving() || this.productResource.isLoading() || this.isNewProductCreated(),
  );
  productFormModel = linkedSignal<ProductFormModel>(() =>
    this.productResource.hasValue()
      ? this.#productToFormModel(this.productResource.value())
      : EMPTY_PRODUCT_FORM_MODEL,
  );

  form = form(this.productFormModel, (schema) => {
    disabled(schema, () => this.disabled());

    required(schema.name, { message: 'Name is required' });
    required(schema.description, { message: 'Description is required' });
    required(schema.category, { message: 'Category is required' });

    required(schema.price, { message: 'Price is required' });

    required(schema.supplier.name, { message: 'Supplier name is required' });
    required(schema.supplier.origin, { message: 'Supplier origin is required' });

    required(schema.quantity, { message: 'Quantity is required' });

    hidden(schema.certificationType, ({ valueOf }) => !valueOf(schema.isCertified));
    required(schema.certificationType, {
      message: 'Certification type is required when certified',
      when: ({ valueOf }) => valueOf(schema.isCertified),
    });

    minLength(schema.pricePerMonth, 6, {
      message: 'At least 6 months of price per month is required',
    });

    function PricePerMonthSchema(price: SchemaPathTree<number>) {
      required(price, { message: 'Price per month is required' });
    }
    applyEach(schema.pricePerMonth, PricePerMonthSchema);
  });
  filteredCategoryOptions = computed(() =>
    this.#categoryService
      .categories()
      .filter((option) =>
        option.toLowerCase().includes(this.form.category().value().toLowerCase() ?? ''),
      ),
  );

  addPricePerMonth(price?: number, isUserInteraction = true) {
    this.form.pricePerMonth().value.update((prices) => [...prices, price ?? 0]);
    if (isUserInteraction) {
      this.form.pricePerMonth().markAsTouched();
      this.form.pricePerMonth().markAsDirty();
    }
  }

  removePricePerMonth(index: number) {
    this.form
      .pricePerMonth()
      .value.update((prices) => prices.filter((_, i) => i !== index));
    this.form.pricePerMonth().markAsTouched();
    this.form.pricePerMonth().markAsDirty();
  }

  save() {
    submit(this.form, async () => {
      this.error.set(undefined);
      this.saving.set(true);
      const productId = this.productId();
      try {
        const productUpsert = this.#formModelToProduct(this.productFormModel());
        if (productId) {
          await this.#productService.update({
            id: productId,
            ...productUpsert,
          });
        } else {
          await this.#productService.create(productUpsert);
          this.isNewProductCreated.set(true);
        }
      } catch (error: unknown) {
        this.error.set(
          error instanceof HttpErrorResponse ? error.message : 'Something went wrong',
        );
      } finally {
        this.saving.set(false);
      }
    });
  }

  reset() {
    const product = this.productResource.value();
    this.form().reset(
      product ? this.#productToFormModel(product) : EMPTY_PRODUCT_FORM_MODEL,
    );
  }

  close() {
    this.#router.navigate(this.productId() ? ['../../'] : ['../'], {
      relativeTo: this.#route,
    });
  }

  #productToFormModel(product: Product): ProductFormModel {
    return {
      ...product,
      isCertified: product.certificationType !== null,
    };
  }

  #formModelToProduct(formModel: ProductFormModel): ProductUpsert {
    const { isCertified, certificationType, ...rest } = formModel;
    return {
      ...rest,
      certificationType: isCertified ? certificationType : null,
    };
  }
}
