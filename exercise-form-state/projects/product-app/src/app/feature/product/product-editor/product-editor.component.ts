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
  SchemaPathTree, FormField
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
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
  #categoryService = inject(CategoryService);

  // TODO 2: inject ProductApiService

  // TODO 16: inject Router and ActivatedRoute

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string | undefined>();

  // TODO 1: let's define couple of signals to handle state of the editor component
  // isNewProductCreated and loading (both boolean) with initial value set to false
  // and error signal which could be string or undefined (initial value undefined)
  // we will need these for creating and updating of a product (loading of the product will be handled by a httpResource)
  // then let's add last "isNewProduct" signal which will be computed based on the presence of the productId signal value

  // TODO 3: let's define a product signal which will load product from API based on productId
  // with the help of Angular "httpResource"

  // TODO 13: the basic create and update functionality is in place but the UX is still lacking
  // during the async operations, user could change data in the form or hit the save button multiple times
  // let's fix this by disabling the form and buttons when the async operation is in progress
  // let's define a new disable signal which will be a computed signal that will return true
  // if any of the loading, isLoading (from resource) or isNewProductCreated signals are true

  // TODO 6: with product signal and reset method in place, let's wire them up together
  // with the help of signal effect (where do we define signal effects?)
  // the effect will be very simple and only call the reset method with the product signal value
  // once done try to open editor for a specific item and see if the form is pre-filled with the product data

  // TODO 15: with buttons disabled, let's also disable the form when the async operation is in progress
  // we can define another effect that reacts to the change of the disabled signal
  // and calls disable() (and enable()) methods on the form based on the value of the signal
  // can be implemented as a single effect with a ternary operator
  // in running application try to update existing item and see if everything is disabled

  productFormModel = linkedSignal(() => EMPTY_PRODUCT_FORM_MODEL);

  form = form(this.productFormModel, (schema) => {
    hidden(schema.certificationType, ({ valueOf }) => !valueOf(schema.isCertified));

    required(schema.name, { message: 'Product name is required' });
    required(schema.description, { message: 'Description is required' });
    required(schema.category, { message: 'Category is required' });
    required(schema.price, { message: 'Price is required' });
    required(schema.quantity, { message: 'Quantity is required' });

    required(schema.supplier.name, { message: 'Supplier name is required' });
    required(schema.supplier.origin, { message: 'Supplier origin is required' });

    required(schema.certificationType, {
      message: 'Certification type is required',
      when: ({ valueOf }) => valueOf(schema.isCertified),
    });

    minLength(schema.pricePerMonth, 6, {
      message: 'At least 6 months of prices are required',
    });

    function PricePerMonthSchema(price: SchemaPathTree<number>) {
      required(price, { message: 'Price per month is required' });
    }
    applyEach(schema.pricePerMonth, PricePerMonthSchema);

    validate(schema.price, ({ value, valueOf }) => {
      const category = valueOf(schema.category);
      if (
        (category === 'Coffee Machine' || category === 'Coffee Grinder') &&
        value() <= 500
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

  addPricePerMonth(price?: number) {
    this.form.pricePerMonth().value.update((prices) => [...prices, price ?? 0]);
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
      // TODO 11: let's implement saving functionality (create for new, update for existing)
      // in both cases, we want to set the loading signal to true (not the skeleton one which comes from resource isLoading)
      // then based on the value of isNewProduct signal, we want to call the appropriate method
      // of the product API service (create or update) and pass the form value as a parameter
      //
      // 1. for creation, we want to cast form value "as unknown as Product" to satisfy the interface
      // then use a pipe and tap to set loading to false, isNewProductCreated to true and mark the form as pristine
      // followed by catchError to set the error signal with the error string representation and return []
      // lastly, we want to subscribe to the observable to trigger the request
      //
      // 2. for update, we want to call the update method of the product API service
      // here we want to pass in a new object which spreads the current form value
      // and sets the id to the value of the productId signal, and then we will cast it "as unknown as Product"
      // then use a pipe and tap to set loading to false and mark form as pristine
      // followed by catchError to set the error signal with the error string representation and return []
      // lastly, we want to subscribe to the observable to trigger the request
      //
      // let's try the update functionality by changing some value in the form and saving it
      // (there won't be any feedback yet, and we have to refresh page to see the changes in the product list)
    });
  }

  // TODO 5: let's parametrize reset method so that it accepts optional "product"
  // parameter which will be of type Product ( | undefined because its optional, what's the shorthand syntax for that?)
  // then in the method body, first we clear all controls on the pricePerMonth form array
  // then, if the product is undefined, let's reset the form with an empty object
  // otherwise, let's reset the form with the product which we received as a parameter
  // and if the product has pricePerMonth with some items, let's iterate over them and add them to the form array
  // by calling the addPricePerMonth method
  reset() {
    this.form().reset(EMPTY_PRODUCT_FORM_MODEL);
  }

  // TODO 17: the UX was improved but now, when we create a new product we end up
  // with a disabled form and success feedback and the only way to leave the editor
  // being the X button in the upper right corner
  // let's improve this situation by allowing user to close editor using a dedicated
  // "close" button in the form action bar as well as the X button on the success feedback

  // let's start by creating a close method which will implement programmatic router back navigation
  // use routers "navigate" method with the appropriate path based on the value of productId signal
  // (see in the template how it was resolved for the original X button)
  // remember to pass in the "relativeTo: this.route" (ActivatedRoute) as option

  // once ready, use the method in 3 places:
  // the original X button - remove [routerLink] and use (click) instead
  // the new close button (create it in action bar, with mat-button directive)
  // the "card-status" component and its (dismiss) event
  // then try creating a new product and see if you can close the editor using the new button
}
