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
  quantity: number;
  price: number;
  pricePerMonth: number[];

  certificationType: CertificationType;
}

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
