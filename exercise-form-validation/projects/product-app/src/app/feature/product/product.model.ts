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
}
