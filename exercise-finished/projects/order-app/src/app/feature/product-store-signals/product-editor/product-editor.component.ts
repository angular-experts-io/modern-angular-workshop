import { RouterLink } from '@angular/router';
import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
    MatButton,
    MatFormField,
    MatIconButton,
    MatProgressSpinner,
    CardComponent,
    ProductItemSkeletonComponent,
    ProductEditorSkeletonComponent,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent {
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  store = inject(ProductStore);

  // from route params :productId
  productId = input<string | undefined>();

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  constructor() {
    effect(
      () => {
        this.store.selectProduct(this.productId());
      },
      { allowSignalWrites: true },
    );
    effect(() => this.reset());
    effect(() => {
      this.store.editorLoading() ? this.form.disable() : this.form.enable();
    });
    this.destroyRef.onDestroy(() => this.store.selectProduct(undefined));
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.store.selectedProduct()) {
        this.store.update({
          ...this.store.selectedProduct(),
          ...this.form.getRawValue(),
        } as any);
      }
    }
  }

  reset() {
    this.form.reset(this.store.selectedProduct() ?? {});
  }
}
