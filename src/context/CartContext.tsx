import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';
import { calculateTrustedOrderTotals } from '../lib/priceCalculator';
import { BDDivision } from '../lib/bdValidation';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: string | undefined;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedDivision: BDDivision;
  setSelectedDivision: (div: BDDivision) => void;
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  freeDeliveryRemaining: number;
  isEligibleForFreeDelivery: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'gg_shopping_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(undefined);
  const [selectedDivision, setSelectedDivision] = useState<BDDivision>('Dhaka');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        const updated = [...prevItems];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const initialQty = Math.min(product.stock, Math.max(1, quantity));
        return [...prevItems, { product, quantity: initialQty }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => {
      if (i.product.id === productId) {
        const allowedQty = Math.min(i.product.stock, quantity);
        return { ...i, quantity: allowedQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(undefined);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GLIMMER10') {
      setAppliedCoupon(clean);
      return { success: true, message: 'Coupon applied: 10% discount added!' };
    }
    if (clean === 'BEAUTY30') {
      setAppliedCoupon(clean);
      return { success: true, message: 'Coupon applied: 30% discount added!' };
    }
    if (clean === 'WELCOME100') {
      setAppliedCoupon(clean);
      return { success: true, message: 'Coupon applied: ৳100 discount added!' };
    }
    return { success: false, message: 'Invalid or expired promo code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(undefined);
  };

  // Live trusted calculation
  const calculation = calculateTrustedOrderTotals(
    items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
    items.map(i => i.product),
    selectedDivision,
    appliedCoupon
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      selectedDivision,
      setSelectedDivision,
      itemCount,
      subtotal: calculation.subtotal,
      deliveryCharge: calculation.deliveryCharge,
      discount: calculation.discount,
      total: calculation.total,
      freeDeliveryRemaining: calculation.freeDeliveryRemaining,
      isEligibleForFreeDelivery: calculation.isEligibleForFreeDelivery
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
