export type CertificationType = 'organic' | 'fairtrade' | null;

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: {
    name: string;
    origin: string;
  };
  price: number;
  pricePerMonth: number[];
  quantity: number;

  certificationType: CertificationType;
}

// TODO 17: create a ProductUpsert interface which extends Omit<Product, 'id'>
// and makes the "id" property optional because we don't have an id when creating a new product

export interface ProductFormModel extends Omit<
  Product,
  'id' | 'quantity' | 'price' | 'pricePerMonth'
> {
  quantity: number | null;
  price: number | null;
  pricePerMonth: (number | null)[];
  isCertified: boolean;
}

export const EMPTY_PRODUCT_FORM_MODEL: ProductFormModel = {
  name: '',
  description: '',
  category: '',
  supplier: {
    name: '',
    origin: '',
  },
  quantity: null,
  price: null,
  pricePerMonth: [null],
  certificationType: null,
  isCertified: false,
};
