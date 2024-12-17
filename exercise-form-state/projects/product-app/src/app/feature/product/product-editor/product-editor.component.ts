import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { buildMonthNamesAndShortYear } from '../../../core/util/date';
import { CategoryService } from '../../../core/category/category.service';
import {
  isIntegerValidator,
  numberValidator,
} from '../../../core/validator/number.validator';
import { CardComponent } from '../../../ui/card/card.component';

@Component({
  selector: 'my-org-product-editor',
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
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  #formBuilder = inject(FormBuilder);
  #categoryService = inject(CategoryService);

  // TODO 3: inject ProductApiService

  // TODO 16: inject Router and ActivatedRoute

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string | undefined>();

  // TODO 1: let's define couple of signals to handle state of the editor component
  // error (string | undefined), loading, loadingShowSkeleton, isNewProduct, isNewProductCreated (all boolean)
  // all boolean signals should have initial value set to false (besides loadingShowSkeleton which should be true)

  // TODO 4: let's define a product signal which will load product from API based on productId
  // we're going to use the toSignal() and  pass in toObservable() which will streamify the productId input
  // in the pipe, we're first going to use the "tap" operator to set "loadingShowSkeleton" to true
  // and unset the error signal

  // next, we're going to use the "switchMap" operator which will have two behaviors based on the presence of "productId"
  // 1. productId is undefined, let's set the "isNewProduct" signal to true and return an [undefined]
  // (because we're in a RxJs stream we have to return [undefined] which is the same of(undefined) but without extra operator)
  // 2. productId is defined, let's set the "isNewProduct" signal to false
  // and call the product API service to fetch the product by id
  // on the product API call, implement nested pipe with "catchError" operator
  // that sets string representation of the error
  // and returns [undefined] (in the same way as we did in the previous step)

  // lastly, let's add another "tap" after the "switchMap" to set "loadingShowSkeleton" to false

  // TODO 13: the basic create and update functionality is in place but the UX is still lacking
  // during the async operations, user could change data in the form or hit the save button multiple times
  // let's fix this by disabling the form and buttons when the async operation is in progress
  // let's define a new disable signal which will be a computed signal that will return true
  // if any of the loading, loadingShowSkeleton or isNewProductCreated signals are true

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

  // TODO 6: with product signal and reset method in place, let's wire them up together
  // with the help of signal effect (where do we define signal effects?)
  // the effect will be very simple and only call the reset method with the product signal value
  // once done try to open editor for a specific item and see if the form is pre-filled with the product data

  // TODO 15: with buttons disabled, let's also disable the form when the async operation is in progress
  // in the constructor, we can use another effect that reacts to the change of the disabled signal
  // and calls disable() (and enable()) methods on the form based on the value of the signal
  // can be implemented as a single effect with a ternary operator
  // in running application try to update existing item and see if everything is disabled

  addPricePerMonth(price?: number) {
    this.form.controls.pricePerMonth.push(
      this.#formBuilder.control(price ?? 0, [
        Validators.required,
        numberValidator(),
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
      // TODO 11: let's implement saving functionality (create for new, update for existing)
      // in both cases, we want to set the loading signal to true (not the skeleton one)
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
    }
  }

  // TODO 5: let's parametrize reset method so that it accepts optional "product"
  // parameter which will be of type Product ( | undefined because its optional, what's the shorthand syntax for that?)
  // then in the method body, first we clear all controls on the pricePerMonth form array
  // then, if the product is undefined, let's reset the form with an empty object
  // otherwise, let's reset the form with the product which we received as a parameter
  // and if the product has pricePerMonth with some items, let's iterate over them and add them to the form array
  // by calling the addPricePerMonth method
  reset() {
    this.form.reset();
  }

  // TODO 17: the UX was improved but now, when we create a new product we end up
  // with a disabled form and success feedback and the only way to leave the editor
  // being the X button in the upper right corner
  // let's improve this situation by allowing user to close editor using a dedicated
  // "close" button in the form action bar as well as the X button on the success feedback

  // let's start by creating a close method which will implement programmatic router back navigation
  // use routers "navigate" method with the appropriate path based on the value of productId signal
  // (see in template how it was resolved for the original X button)
  // don't forget to pass in "queryParamsHandling: 'merge'" and "relativeTo: this.route" (ActivatedRoute) as options

  // once ready, use the method in 3 places:
  // the original X button - remove router link and use (click) instead
  // the new close button (create it in action bar, with mat-button directive)
  // the "card-status" component and its (dismiss) event
  // then try creating a new product and see if you can close the editor using the new button
}
