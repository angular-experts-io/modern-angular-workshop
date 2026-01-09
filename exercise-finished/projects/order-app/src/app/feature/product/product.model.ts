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

export interface ProductUpsert extends Omit<Product, 'id'> {
  id?: string;
}

export interface ProductFormModel extends Omit<Product, 'id'> {
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
  price: 0,
  pricePerMonth: [],
  quantity: 0,

  isCertified: false,
  certificationType: null,
};
