import { RouterLink } from '@angular/router';
import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatInput, MatLabel } from '@angular/material/input';

import { CardComponent } from '../../../ui/card/card.component';

import { ProductStore } from '../product.store';
import { ProductItemSkeletonComponent } from '../product-item-skeleton/product-item-skeleton.component';
import { ProductEditorSkeletonComponent } from '../product-editor-skeleton/product-editor-skeleton.component';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatError,
    MatLabel,
    MatFormField,
    MatIconButton,
    CardComponent,
    ProductItemSkeletonComponent,
    ProductEditorSkeletonComponent,
    MatButton,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  store = inject(ProductStore);
  formBuilder = inject(FormBuilder);

  // from route params :productId
  productId = input<string | undefined>();

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

  constructor() {
    effect(
      () => {
        this.store.selectProduct(this.productId());
      },
      { allowSignalWrites: true },
    );
    effect(() => this.reset());
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
    }
  }

  reset() {
    this.form.reset(this.store.selectedProduct() ?? {});
  }
}
