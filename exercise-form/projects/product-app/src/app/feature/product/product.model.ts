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

// TODO 1: create a new "ProductFormModel" interface which extends from the original
// "Product" interface but removes the "id" property  (use the TypeScript Omit helper type)

// TODO 2: create and export new const with name "EMPTY_PRODUCT_FORM_MODEL" which will
// be of type "ProductFormModel" and contain sensible default values

// TODO 16: let's add form-only isCertified: boolean; property to the  "ProductFormModel"
// and to the EMPTY_PRODUCT_FORM_MODEL, initialized to false
