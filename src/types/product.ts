export type ProductCategory = 'cosmetics' | 'jewellery';

export type ProductSubcategory = 
  | 'skincare' 
  | 'makeup' 
  | 'lipstick' 
  | 'serum' 
  | 'moisturizer' 
  | 'face-wash' 
  | 'earrings' 
  | 'necklaces' 
  | 'rings' 
  | 'bracelets' 
  | 'bangles' 
  | 'fashion-jewellery';

export interface ProductReview {
  id: string;
  userId?: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  ingredients?: string;
  materials?: string;
  howToUse?: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number; // BDT
  originalPrice?: number; // BDT, if discounted
  images: string[];
  thumbnail: string;
  sku: string;
  stock: number;
  isActive: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  image: string;
  itemCount: number;
}
