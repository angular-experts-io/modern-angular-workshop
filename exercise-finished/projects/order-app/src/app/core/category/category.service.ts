import { Injectable, signal } from '@angular/core';

const CATEGORIES: string[] = [
  'Coffee Machine',
  'Coffee Grinder',
  'Coffee Beans',
  'Coffee Cups',
  'Coffee Spoon',
  'Coffee Table',
  'Coffee Mug',
  'Coffee Pot',
  'Coffee Accessories',
  'Coffee Furniture',
];

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _categories = signal<string[]>(CATEGORIES);
  categories = this._categories.asReadonly();
}
