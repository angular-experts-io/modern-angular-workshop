import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom, isObservable, of } from 'rxjs';

import { confirmDiscardUnsavedChanges } from '../../../pattern/confirm-discard-unsave-changes/confirm-discard-unsaved-changes';
import { DialogConfirmService } from '../../../pattern/dialog-confirm/dialog-confirm.service';

import { ProductApiService } from '../product-api.service';
import { EMPTY_PRODUCT_FORM_MODEL, Product } from '../product.model';

import { ProductEditorComponent } from './product-editor.component';

const PRODUCT: Product = {
  id: 'coffee',
  name: 'Coffee',
  description: 'Fresh coffee beans',
  category: 'Coffee Beans',
  supplier: { name: 'Supplier', origin: 'Brazil' },
  price: 20,
  quantity: 10,
  pricePerMonth: [15, 16, 17, 18, 19, 20],
  certificationType: 'organic',
};

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;
  let http: HttpTestingController;
  const dialog = { open$: vi.fn(() => of(false)) };
  const element = () => fixture.nativeElement as HTMLElement;
  const save = () =>
    element().querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  const editName = (value: string) => {
    const input = element().querySelector<HTMLInputElement>(
      'input[placeholder="Product name"]',
    )!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  };
  const discard = () =>
    TestBed.runInInjectionContext(() => confirmDiscardUnsavedChanges(component.form));
  const loadProduct = async () => {
    fixture.componentRef.setInput('productId', PRODUCT.id);
    const request = await vi.waitFor(() => http.expectOne(`/products/${PRODUCT.id}`));
    expect(component.productResource.isLoading()).toBe(true);
    request.flush(PRODUCT);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    dialog.open$.mockReset().mockReturnValue(of(false));
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductApiService,
        { provide: DialogConfirmService, useValue: dialog },
      ],
      imports: [ProductEditorComponent],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  afterEach(() => http.verify());

  it('blocks an empty native submission, shows validation, and resets new-product values', async () => {
    http.expectNone(() => true);
    save();
    await fixture.whenStable();
    http.expectNone(() => true);
    expect(component.form.name().touched()).toBe(true);
    expect(element().textContent).toContain('Product name is required');
    editName('Unsaved');
    await fixture.whenStable();
    expect(component.form().dirty()).toBe(true);
    component.reset();
    await fixture.whenStable();
    expect(component.productFormModel()).toEqual(EMPTY_PRODUCT_FORM_MODEL);
    expect(component.form().dirty()).toBe(false);
    expect(component.form().touched()).toBe(false);
  });

  it('loads an existing product, confirms dirty changes, and resets to its saved values', async () => {
    await loadProduct();
    expect(component.form.name().value()).toBe(PRODUCT.name);
    expect(component.form.isCertified().value()).toBe(true);
    expect(discard()).toBe(true);
    expect(dialog.open$).not.toHaveBeenCalled();
    editName('Unsaved name');
    await fixture.whenStable();
    const decision = discard();
    expect(isObservable(decision)).toBe(true);
    if (isObservable(decision)) expect(await firstValueFrom(decision)).toBe(false);
    expect(dialog.open$).toHaveBeenCalledOnce();
    component.reset();
    await fixture.whenStable();
    expect(component.form.name().value()).toBe(PRODUCT.name);
    expect(component.form().touched()).toBe(false);
    expect(discard()).toBe(true);
  });

  it('creates through FormRoot, disables controls while saving, and shows success', async () => {
    const { id: _id, ...product } = PRODUCT;
    component.productFormModel.set({ ...product, isCertified: false });
    await fixture.whenStable();
    editName('New coffee');
    await fixture.whenStable();
    save();
    const request = await vi.waitFor(() => http.expectOne('/products'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      ...product,
      name: 'New coffee',
      certificationType: null,
      id: expect.any(String),
    });
    expect(request.request.body).not.toHaveProperty('isCertified');
    expect(component.form().submitting()).toBe(true);
    await vi.waitFor(() => expect(element().querySelector('mat-spinner')).not.toBeNull());
    expect(
      [...element().querySelectorAll('button')].every((button) => button.disabled),
    ).toBe(true);
    expect(element().querySelector<HTMLInputElement>('input')!.disabled).toBe(true);
    request.flush(request.request.body);
    await vi.waitFor(() => expect(component.form().submitting()).toBe(false));
    await fixture.whenStable();
    expect(component.form().submitting()).toBe(false);
    expect(component.isNewProductCreated()).toBe(true);
    expect(element().textContent).toContain('Product created');
    expect(component.disabled()).toBe(true);
    expect(
      element().querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled,
    ).toBe(true);
    expect(discard()).toBe(true);
  });

  it('updates, reloads the saved product, and resets later edits to the refreshed value', async () => {
    await loadProduct();
    editName('Updated coffee');
    await fixture.whenStable();
    save();
    const request = await vi.waitFor(() => http.expectOne(`/products/${PRODUCT.id}`));
    expect(request.request.method).toBe('PUT');
    const updated = { ...PRODUCT, name: 'Updated coffee' };
    expect(request.request.body).toEqual(updated);
    request.flush(updated);
    const reload = await vi.waitFor(() => http.expectOne(`/products/${PRODUCT.id}`));
    expect(reload.request.method).toBe('GET');
    reload.flush(updated);
    await fixture.whenStable();
    expect(component.form.name().value()).toBe(updated.name);
    expect(component.form().dirty()).toBe(false);
    expect(component.form().touched()).toBe(false);
    expect(component.disabled()).toBe(false);
    editName('Another edit');
    await fixture.whenStable();
    component.reset();
    await fixture.whenStable();
    expect(component.form.name().value()).toBe(updated.name);
  });

  it('shows an HTTP save error and restores editing without discarding changes', async () => {
    await loadProduct();
    editName('Retry this name');
    await fixture.whenStable();
    save();
    const request = await vi.waitFor(() => http.expectOne(`/products/${PRODUCT.id}`));
    request.flush('Unavailable', { status: 500, statusText: 'Server error' });
    await fixture.whenStable();
    expect(component.error()).toContain('500');
    expect(element().textContent).toContain('Something went wrong');
    expect(component.form.name().value()).toBe('Retry this name');
    expect(component.form().dirty()).toBe(true);
    expect(component.form().submitting()).toBe(false);
    expect(component.disabled()).toBe(false);
  });

  it('shows resource loading errors through the dismissible error state', async () => {
    fixture.componentRef.setInput('productId', PRODUCT.id);
    const request = await vi.waitFor(() => http.expectOne(`/products/${PRODUCT.id}`));
    request.flush('Not found', { status: 404, statusText: 'Not found' });
    await fixture.whenStable();
    expect(component.error()).toContain('404');
    expect(element().textContent).toContain('Something went wrong');
    component.error.set(undefined);
    await fixture.whenStable();
    expect(element().querySelector('my-org-card-status')).toBeNull();
  });
});
