export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  price: number;
  pricePerMonth: number[];
  quantity: number;
}
