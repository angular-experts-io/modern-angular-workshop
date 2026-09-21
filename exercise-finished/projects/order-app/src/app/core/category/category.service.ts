import { Service, signal } from '@angular/core';

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

@Service()
export class CategoryService {
  #categories = signal(CATEGORIES);
  categories = this.#categories.asReadonly();
}
