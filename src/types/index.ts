
export interface Product {
  id: string;
  name: string;
  type: 'material' | 'subscription' | 'service';
  description: string;
  originalPrice: number;
  modifiedPrice?: number;
  modifiedDescription?: string;
  quantity: number;
  unit?: string;
  selected: boolean;
}
