import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import {
  disabled,
  hidden,
  form,
  minLength,
  validate,
  required,
  applyEach,
  FormField,
  FormRoot,
  schema,
} from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { CardComponent } from '../../../ui/card/card.component';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';

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
    FormRoot,
    MatIcon,
    MatInput,
    MatLabel,
    MatError,
    MatSelect,
    MatSuffix,
    MatButton,
    MatOption,
    MatCheckbox,
    MatFormField,
    MatIconButton,
    MatAutocomplete,
    MatMiniFabButton,
    MatAutocompleteTrigger,
    CardComponent,
    CardStatusComponent,
    ProductEditorSkeletonComponent,
    MatProgressSpinner,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #categoryService = inject(CategoryService);
  #productApiService = inject(ProductApiService);

  MONTHS = buildMonthNamesAndShortYear().reverse();
  error = linkedSignal(() => this.productResource.error()?.message);
  isNewProductCreated = signal(false);
  disabled = computed(
    () =>
      this.form().submitting() ||
      this.productResource.isLoading() ||
      this.isNewProductCreated(),
  );

  productId = input<string | undefined>();
  // TODO 24: (Optional): move the editor's product data access into ProductService
  // reuse selectedProductId and selectedProduct from the previous optional step
  // keep productFormModel, form, validation, submission.action and form().submitting() in this component
  // derive the editable model from the selected product with linkedSignal and #productToFormModel
  // adapt reset() and the loading/error bindings to the service's selected-product state
  // keep the empty model for creation and the last saved product for resetting an edit
  // move create/update API calls into service methods and await them in submission.action
  // after successful mutations, refresh shared list state and the selected product used by reset()
  // preserve the existing reset-after-update and isNewProductCreated behavior
  productResource = httpResource<Product>(() => {
    const productId = this.productId();
    return productId ? `/products/${productId}` : undefined;
  });
  productFormModel = linkedSignal(() =>
    this.productResource.hasValue()
      ? this.#productToFormModel(this.productResource.value())
      : EMPTY_PRODUCT_FORM_MODEL,
  );

  form = form(
    this.productFormModel,
    (fieldTree) => {
      disabled(fieldTree, { when: () => this.disabled() });

      hidden(fieldTree.certificationType, {
        when: ({ valueOf }) => !valueOf(fieldTree.isCertified),
      });

      required(fieldTree.name, { message: 'Product name is required' });
      required(fieldTree.description, { message: 'Description is required' });
      required(fieldTree.category, { message: 'Category is required' });
      required(fieldTree.price, { message: 'Price is required' });
      required(fieldTree.quantity, { message: 'Quantity is required' });

      required(fieldTree.supplier.name, { message: 'Supplier name is required' });
      required(fieldTree.supplier.origin, { message: 'Supplier origin is required' });

      required(fieldTree.certificationType, {
        message: 'Certification type is required',
        when: ({ valueOf }) => valueOf(fieldTree.isCertified),
      });

      minLength(fieldTree.pricePerMonth, 6, {
        message: 'At least 6 months of prices are required',
      });

      const PricePerMonthSchema = schema<number | null>((price) => {
        required(price, { message: 'Price per month is required' });
      });
      applyEach(fieldTree.pricePerMonth, PricePerMonthSchema);

      validate(fieldTree.price, ({ value, valueOf }) => {
        const category = valueOf(fieldTree.category);
        const price = value();
        if (
          (category === 'Coffee Machine' || category === 'Coffee Grinder') &&
          price !== null &&
          price <= 500
        ) {
          return {
            kind: 'priceTooLowForCategory',
            message: 'Price must be higher than 500 for selected category',
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async () => {
          this.error.set(undefined);
          try {
            const productId = this.productId();
            const productUpsert = this.#formModelToProduct(this.productFormModel());
            if (productId) {
              await this.#productApiService.update({ ...productUpsert, id: productId });
              this.productResource.reload();
              this.reset();
            } else {
              await this.#productApiService.create(productUpsert);
              this.isNewProductCreated.set(true);
            }
          } catch (error: unknown) {
            this.error.set(
              error instanceof HttpErrorResponse ? error.message : 'Something went wrong',
            );
          }
        },
      },
    },
  );
  filteredCategoryOptions = computed(() =>
    this.#categoryService
      .categories()
      .filter((cat) =>
        cat.toLowerCase().includes(this.form.category().value().toLowerCase()),
      ),
  );

  addPricePerMonth() {
    this.form.pricePerMonth().value.update((prices) => [...prices, null]);
    this.form.pricePerMonth().markAsTouched();
    this.form.pricePerMonth().markAsDirty();
  }

  removePricePerMonth(index: number) {
    this.form
      .pricePerMonth()
      .value.update((prices) => prices.filter((_, i) => i !== index));
    this.form.pricePerMonth().markAsTouched();
    this.form.pricePerMonth().markAsDirty();
  }

  reset() {
    this.form().reset(
      this.productResource.hasValue()
        ? this.#productToFormModel(this.productResource.value())
        : EMPTY_PRODUCT_FORM_MODEL,
    );
  }
  close() {
    return this.#router.navigate(this.productId() ? ['../..'] : ['..'], {
      relativeTo: this.#route,
    });
  }
  #productToFormModel(product: Product): ProductFormModel {
    return { ...product, isCertified: product.certificationType !== null };
  }
  #formModelToProduct(formModel: ProductFormModel): ProductUpsert {
    const { isCertified, certificationType, ...rest } = formModel;
    return {
      ...rest,
      certificationType: isCertified ? certificationType : null,
      quantity: rest.quantity!,
      price: rest.price!,
      pricePerMonth: rest.pricePerMonth as number[],
    };
  }
}
