import { Product } from '../types/product';
import { BDDivision } from './bdValidation';

export const FREE_DELIVERY_THRESHOLD = 1500; // Free delivery over ৳1,500
export const DELIVERY_INSIDE_DHAKA = 70;
export const DELIVERY_OUTSIDE_DHAKA = 130;

export interface CalculationItemInput {
  productId: string;
  quantity: number;
}

export interface TrustedOrderCalculation {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  freeDeliveryRemaining: number;
  isEligibleForFreeDelivery: boolean;
  validatedItems: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    thumbnail: string;
    sku: string;
    stock: number;
  }[];
  errors?: string[];
}

export function calculateTrustedOrderTotals(
  items: CalculationItemInput[],
  catalogProducts: Product[],
  division: BDDivision = 'Dhaka',
  couponCode?: string
): TrustedOrderCalculation {
  const errors: string[] = [];
  let subtotal = 0;

  const catalogMap = new Map<string, Product>();
  for (const p of catalogProducts) {
    catalogMap.set(p.id, p);
  }

  const validatedItems: TrustedOrderCalculation['validatedItems'] = [];

  for (const item of items) {
    const canonicalProduct = catalogMap.get(item.productId);
    if (!canonicalProduct) {
      errors.push(`Product with ID "${item.productId}" is not available in catalog.`);
      continue;
    }

    if (!canonicalProduct.isActive) {
      errors.push(`"${canonicalProduct.name}" is currently inactive.`);
      continue;
    }

    const qty = Math.max(1, Math.floor(item.quantity));
    
    // Overselling safeguard
    if (qty > canonicalProduct.stock) {
      errors.push(`Cannot order ${qty} units of "${canonicalProduct.name}". Only ${canonicalProduct.stock} available.`);
    }

    // Always use canonical price from the catalog
    const unitPrice = canonicalProduct.price;
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    validatedItems.push({
      productId: canonicalProduct.id,
      name: canonicalProduct.name,
      unitPrice,
      quantity: qty,
      lineTotal,
      thumbnail: canonicalProduct.thumbnail,
      sku: canonicalProduct.sku,
      stock: canonicalProduct.stock
    });
  }

  // Delivery charge calculation based on division
  const isEligibleForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0;
  const baseDelivery = division === 'Dhaka' ? DELIVERY_INSIDE_DHAKA : DELIVERY_OUTSIDE_DHAKA;
  const deliveryCharge = isEligibleForFreeDelivery ? 0 : (subtotal > 0 ? baseDelivery : 0);
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Discount calculation
  let discount = 0;
  if (couponCode) {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (normalizedCode === 'GLIMMER10') {
      discount = Math.round(subtotal * 0.10); // 10% off
    } else if (normalizedCode === 'BEAUTY30') {
      discount = Math.round(subtotal * 0.30); // 30% off
    } else if (normalizedCode === 'WELCOME100') {
      discount = 100; // Flat ৳100 off
    }
  }

  const total = Math.max(0, subtotal - discount + deliveryCharge);

  return {
    subtotal,
    deliveryCharge,
    discount,
    total,
    freeDeliveryRemaining,
    isEligibleForFreeDelivery,
    validatedItems,
    errors: errors.length > 0 ? errors : undefined
  };
}
