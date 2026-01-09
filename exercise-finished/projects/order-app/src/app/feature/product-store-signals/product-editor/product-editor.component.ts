import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatError, MatInput, MatLabel } from '@angular/material/input';

import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CardComponent } from '../../../ui/card/card.component';
import { CardStatusComponent } from '../../../ui/card-status/card-status.component';

import {
  EMPTY_PRODUCT_FORM_MODEL,
  ProductFormModel,
  ProductUpsert,
} from '../product.model';
import { Product } from '../product.model';
import { ProductStore } from '../product.store';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';
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

@Component({
  selector: 'my-org-product-editor',
  imports: [
    Field,
    MatIcon,
    MatInput,
    MatError,
    MatLabel,
    MatOption,
    MatButton,
    MatPrefix,
    MatSuffix,
    MatSelect,
    MatCheckbox,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #categoryService = inject(CategoryService);

  MONTHS = buildMonthNamesAndShortYear().reverse();

  store = inject(ProductStore);

  // from route params :productId
  productId = input<string | undefined>();
  #effectSyncSelectedProductId = effect(() => this.store.selectProduct(this.productId()));

  productFormModel = linkedSignal<ProductFormModel>(() => {
    const product = this.store.selectedProduct();
    return product ? this.#productToFormModel(product) : EMPTY_PRODUCT_FORM_MODEL;
  });

  #destroy = this.#destroyRef.onDestroy(() => {
    this.store.selectProduct(undefined);
    this.store.unsetEditorNewProductCreated();
  });

  form = form(this.productFormModel, (schema) => {
    disabled(schema, () => this.store.editorDisabled());

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
      const productId = this.productId();
      const product = this.#formModelToProduct(this.productFormModel());
      if (productId) {
        this.store.update({
          id: productId,
          ...product,
        });
      } else {
        this.store.create(product);
      }
    });
  }

  reset() {
    const product = this.store.selectedProduct();
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
