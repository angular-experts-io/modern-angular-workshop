import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStore } from '../product.store';
import { ProductEditorComponent } from './product-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ProductEditorComponent,
      ],
      providers: [
        {
          provide: ProductStore,
          useValue: {
            editorLoading: signal(false),
            editorDisabled: signal(false),
            selectedProduct: signal(false),
            loadingShowSkeleton: signal(false),
            editorNewProductCreated: signal(false),
            selectProduct() {},
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
