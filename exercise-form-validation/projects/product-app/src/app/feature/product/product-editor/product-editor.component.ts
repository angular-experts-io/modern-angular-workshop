import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, hidden } from '@angular/forms/signals';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';

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
    MatLabel,
    MatInput,
    MatOption,
    MatSuffix,
    MatSelect,
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

  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();

  productFormModel = linkedSignal(() => EMPTY_PRODUCT_FORM_MODEL);

  form = form(this.productFormModel, (schema) => {
    hidden(schema.certificationType, ({ valueOf }) => !valueOf(schema.isCertified));
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
  }

  removePricePerMonth(index: number) {
    this.form
      .pricePerMonth()
      .value.update((prices) => prices.filter((_, i) => i !== index));
  }
}
