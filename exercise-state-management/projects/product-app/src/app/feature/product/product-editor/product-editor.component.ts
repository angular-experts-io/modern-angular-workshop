import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import {
  applyEach,
  disabled,
  FormField,
  form,
  hidden,
  minLength,
  required,
  schema,
  submit,
} from '@angular/forms/signals';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
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

import {
  EMPTY_PRODUCT_FORM_MODEL,
  Product,
  ProductFormModel,
  ProductUpsert,
} from '../product.model';
import { ProductApiService } from '../product-api.service';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    FormField,
    MatIcon,
    MatButton,
    MatError,
    MatInput,
    MatLabel,
    MatOption,
    MatPrefix,
    MatSuffix,
    MatSelect,
    MatCheckbox,
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
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #productApiService = inject(ProductApiService);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string | undefined>();

  // TODO 24: (Optional): try to move state into the product service
  // (hint: we want to have a service based selectedProductId and selectedProduct signals)
  // (these signal derive the product from the original product list already managed by the product service)
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

  form = form(this.productFormModel, (fieldTree) => {
    disabled(fieldTree, () => this.disabled());

    required(fieldTree.name, { message: 'Name is required' });
    required(fieldTree.description, { message: 'Description is required' });
    required(fieldTree.category, { message: 'Category is required' });

    required(fieldTree.price, { message: 'Price is required' });

    required(fieldTree.supplier.name, { message: 'Supplier name is required' });
    required(fieldTree.supplier.origin, { message: 'Supplier origin is required' });

    required(fieldTree.quantity, { message: 'Quantity is required' });

    hidden(fieldTree.certificationType, ({ valueOf }) => !valueOf(fieldTree.isCertified));
    required(fieldTree.certificationType, {
      message: 'Certification type is required when certified',
      when: ({ valueOf }) => valueOf(fieldTree.isCertified),
    });

    minLength(fieldTree.pricePerMonth, 6, {
      message: 'At least 6 months of price per month is required',
    });

    const PricePerMonthSchema = schema<number | null>((price) => {
      required(price, { message: 'Price per month is required' });
    });
    applyEach(fieldTree.pricePerMonth, PricePerMonthSchema);
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
          await this.#productApiService.update({
            id: productId,
            ...productUpsert,
          });
          this.productResource.reload();
        } else {
          await this.#productApiService.create(productUpsert);
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
