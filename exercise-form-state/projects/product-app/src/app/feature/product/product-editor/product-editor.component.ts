import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import {
  hidden,
  form,
  minLength,
  validate,
  submit,
  required,
  applyEach,
  FormField,
  schema,
} from '@angular/forms/signals';
import {RouterLink } from '@angular/router';
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

import { CardComponent } from '../../../ui/card/card.component';
import { CategoryService } from '../../../core/category/category.service';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

import { EMPTY_PRODUCT_FORM_MODEL } from '../product.model';

@Component({
  selector: 'my-org-product-editor',
  imports: [
    RouterLink,
    FormField,
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
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  // TODO 1: inject Router and ActivatedRoute
  #categoryService = inject(CategoryService);

  // TODO 21: inject ProductApiService

  MONTHS = buildMonthNamesAndShortYear().reverse();

  // TODO 8: define new error state as a linkedSignal which will return the
  // message of the productResource error message (if exists, else undefined)

  // TODO 10: define saving signal initialized to false

  // TODO 13: define isNewProductCreated signal initialized to false

  // TODO 14: define disabled computed which will be true if
  // saving is true OR productResource is loading OR isNewProductCreated is true

  productId = input<string | undefined>();

  // TODO 3: implement productResource using httpResource with generic type Product
  // the arrow function will return the endpoint string if productId signal has a value
  // otherwise it will return undefined to avoid making the request

  // TODO 5: adjust the productFormModel linkedSignal in a way that it returns the
  // productResource value (transformed to ProductFormModel) if the resource has a value
  // otherwise it will return the EMPTY_PRODUCT_FORM_MODEL (as before)
  productFormModel = linkedSignal(() => EMPTY_PRODUCT_FORM_MODEL);

  form = form(this.productFormModel, (fieldTree) => {
    // TODO 16: use "disabled" Signals form helper to disable the whole form
    // based on the "disabled" computed defined earlier

    hidden(fieldTree.certificationType, ({ valueOf }) => !valueOf(fieldTree.isCertified));

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
        price && price <= 500
      ) {
        return {
          kind: 'priceTooLowForCategory',
          message: 'Price must be higher than 500 for selected category',
        };
      }
      return null;
    });
  });
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

  save() {
    submit(this.form, async () => {
      // TODO 22: set "error" to undefined, "saving" to true
      // retrieve productId from signal and store in variable
      // transform the productFormModel to ProductUpsert using our previously implemented
      // #formModelToProduct method and store in variable
      //
      // TODO 23: based on the presence of productId, call the appropriate
      // method on the injected ProductApiService
      // for update (if productId exists), spreading the "id" and the "productUpsert" object
      // make sure to call "productResource.reload()" to update the resource for reset behavior
      // and then call component "reset" method to remove touch / dirty states
      //
      // for create (if productId does not exist), passing the productUpsert object
      //
      // TODO 24: wrap the above logic in try-catch block
      // in catch, error type will be unknown, check if error is instance of HttpErrorResponse
      // if so, set error signal to error.message, otherwise set to generic "Something went wrong"
      // in finally, set saving to false
      //
      // TODO 25: in the create "if" branch, after successful creation
      // set isNewProductCreated signal to true
    });
  }

  reset() {
    // TODO 7: adjust reset method to reset the form to value from the productResource
    // transformed to ProductFormModel using our previously implemented #productToFormModel method
    // if the resource has a value, otherwise reset to EMPTY_PRODUCT_FORM_MODEL
    // and try it in running app by changing some input values and clicking reset button
    this.form().reset(EMPTY_PRODUCT_FORM_MODEL);
  }

  // TODO 2: implement close() method to navigate back to product list
  // which will implement programmatic router back navigation
  // use routers "navigate" method with the appropriate path based on the value of productId signal
  // (see in the template how it was resolved for the original X button)
  // remember to pass in the "relativeTo: this.route" (ActivatedRoute) as option
  // once ready, use the method on original X button - remove [routerLink] and use (click) instead
  // at the bottom of the form, add new button "Close" which will also call this method on click


  // TODO 4: implement private #productToFormModel(product: Product): ProductFormModel
  // method which will transform a Product into a ProductFormModel, the difference is
  // that the ProductFormModel has an additional "isCertified" boolean property
  // which will be true if product.certificationType is not null, false otherwise
  // and nullable price related properties that can be "number | null" in the form but
  // are just "number" in the Product model


  // TODO 18: implement private #formModelToProduct(formModel: ProductFormModel): ProductUpsert method
  // which will transform a ProductFormModel into a ProductUpsert
  // we need to exclude the form only "isCertified" property and to do that we can use destructuring
  // where we destructure "isCertified" and "certificationType" and the "...rest" from the formModel
  // then we return a new object spreading the "rest" and setting the "certificationType"
  // to the value from the formModel only if "isCertified" is true, otherwise we set it to null
  // the form model has price-related properties that are "number | null" in the form but
  // are just "number" in the Product model
}
