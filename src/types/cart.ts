import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
}
