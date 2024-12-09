import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductService } from '../product.service';
import { ProductEditorComponent } from './product-editor.component';

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductEditorComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: ProductService,
          useValue: {
            editorError: signal(false),
            editorLoading: signal(false),
            editorDisabled: signal(false),
            selectedProduct: signal(false),
            selectedProductId: signal(undefined),
            loadingShowSkeleton: signal(false),
            editorNewProductCreated: signal(false),
            selectProduct() {},
            updateEditorNewProductCreated() {},
            updateSelectedProductId() {},
            unsetEditorNewProductCreated() {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
