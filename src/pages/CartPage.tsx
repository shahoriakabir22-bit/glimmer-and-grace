import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../lib/bdValidation';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal, 
    deliveryCharge, 
    discount, 
    total,
    freeDeliveryRemaining,
    isEligibleForFreeDelivery,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / 1500) * 100));

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-ivory-200">
        <div className="w-24 h-24 rounded-full bg-blush-100 flex items-center justify-center text-burgundy-500 mb-6 ring-8 ring-blush-50">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-burgundy-500">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mt-2 mb-8">
          Explore our certified cosmetics and exquisite jewellery to start building your luxury collection.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-luxury transition-all"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-200 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-blush-200">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
              Checkout Preparation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
              Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-white rounded-2xl p-4 border border-blush-200 shadow-xs mb-8">
          {isEligibleForFreeDelivery ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You've earned <strong>FREE Delivery</strong> inside Dhaka!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs text-charcoal mb-1.5">
                <span>Add <strong>{formatBDT(freeDeliveryRemaining)}</strong> more to unlock <strong>FREE Delivery</strong></span>
                <span className="font-semibold text-gold-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-blush-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-gold h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items Table / List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div 
                key={item.product.id}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-blush-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-blush-100 shrink-0"
                />

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[10px] text-rose-dark uppercase font-semibold">
                    {item.product.category} • {item.product.subcategory}
                  </span>
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="block font-serif font-bold text-base text-charcoal hover:text-burgundy-500 transition-colors truncate"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Unit Price: <span className="font-semibold text-charcoal">{formatBDT(item.product.price)}</span>
                  </p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center border border-blush-300 rounded-xl bg-blush-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-charcoal hover:bg-blush-200 rounded-lg transition-colors font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-charcoal">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="px-2.5 py-1 text-charcoal hover:bg-blush-200 rounded-lg transition-colors font-bold disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line total & remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <span className="font-serif font-bold text-base text-burgundy-500">
                    {formatBDT(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-xs text-charcoal-muted hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-burgundy-500 pb-4 border-b border-blush-200">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gold-50 border border-gold-300 text-xs">
                    <span className="flex items-center gap-1.5 text-gold-700 font-semibold">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      {appliedCoupon} applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-800 text-xs underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponMessage(null);
                        }}
                        className="flex-1 px-3 py-2.5 rounded-xl text-xs bg-blush-50 border border-blush-200 uppercase focus:outline-none focus:ring-1 focus:ring-gold-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-charcoal hover:bg-burgundy-500 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`text-[11px] ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-3 text-xs text-charcoal border-t border-blush-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Cart Subtotal</span>
                  <span className="font-semibold">{formatBDT(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatBDT(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Estimated Delivery (Dhaka)</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-600 uppercase text-[11px]">Free</strong> : formatBDT(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-burgundy-500 pt-3 border-t border-blush-200">
                  <span className="font-serif">Grand Total</span>
                  <span>{formatBDT(total)}</span>
                </div>
              </div>

              {/* Proceed to checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gradient-luxury hover:opacity-95 text-white font-bold rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-charcoal-muted">
                Safe & Secure Checkout • Cash on Delivery Available
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
