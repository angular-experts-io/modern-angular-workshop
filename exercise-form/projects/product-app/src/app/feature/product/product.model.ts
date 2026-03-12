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

// TODO 1: create a new "ProductFormModel" interface which extends from the original
// "Product" interface but removes the "id, "quantity", "price" and "pricePerMonth" properties
// (use the TypeScript "Omit" helper type)
// in the interface, add all removed "number" properties with new type "number | null" (mind the array)

// TODO 2: create and export new const with name "EMPTY_PRODUCT_FORM_MODEL" which will
// be of type "ProductFormModel" and contain sensible default values

// TODO 16: let's add form-only isCertified: boolean; property to the  "ProductFormModel"
// and to the EMPTY_PRODUCT_FORM_MODEL, initialized to false
