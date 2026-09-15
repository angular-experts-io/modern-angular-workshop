import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import {
  applyEach,
  disabled,
  FormField,
  form,
  hidden,
  minLength,
  required,
  submit,
  schema,
} from '@angular/forms/signals';
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

@Component({
  selector: 'my-org-product-editor',
  imports: [
    FormField,
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

  form = form(this.productFormModel, (fieldTree) => {
    disabled(fieldTree, () => this.store.editorDisabled());

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

  addPricePerMonth(price: number | null = null) {
    this.form.pricePerMonth().value.update((prices) => [...prices, price]);
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
    return {
      name: formModel.name,
      description: formModel.description,
      category: formModel.category,
      supplier: formModel.supplier,
      price: formModel.price ?? 0,
      quantity: formModel.quantity ?? 0,
      pricePerMonth: formModel.pricePerMonth.map((price) => price ?? 0),
      certificationType: formModel.isCertified ? formModel.certificationType : null,
    };
  }
}
