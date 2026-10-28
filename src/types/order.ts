export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

export interface OrderItem {
  productId: string;
  name: string;
  price: number; // Trusted BDT price
  quantity: number;
  thumbnail: string;
  sku: string;
  category: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email?: string;
  houseRoadArea: string;
  city: string;
  division: 'Dhaka' | 'Chittagong' | 'Sylhet' | 'Rajshahi' | 'Khulna' | 'Barisal' | 'Rangpur' | 'Mymensingh';
  deliveryNotes?: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerDetails: DeliveryDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderStatus: OrderStatus;
  notes?: string;
  timeline: OrderTimelineStep[];
  createdAt: string;
  updatedAt: string;
}
