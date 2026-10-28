import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatBDT } from '../../lib/bdValidation';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
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

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / 1500) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-blush-200">
          
          {/* Header */}
          <div className="p-5 border-b border-blush-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-burgundy-500" />
              <h2 className="font-serif text-lg font-bold text-burgundy-500">Shopping Bag</h2>
              <span className="px-2 py-0.5 bg-blush-200 text-burgundy-600 rounded-full text-xs font-semibold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-blush-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-blush-50 px-5 py-3 border-b border-blush-200">
            {isEligibleForFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You qualify for <strong>FREE Delivery</strong> in Dhaka!</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-charcoal mb-1.5 flex justify-between">
                  <span>Add <strong>{formatBDT(freeDeliveryRemaining)}</strong> more for <strong>FREE Delivery</strong></span>
                  <span className="font-semibold text-gold-600">{freeShippingProgress}%</span>
                </p>
                <div className="w-full bg-blush-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center text-burgundy-400 mb-4 ring-8 ring-blush-50">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-burgundy-500">Your bag is empty</h3>
                <p className="text-xs text-charcoal-muted max-w-xs mt-1 mb-6">
                  Explore our luxury skincare, velvety lipsticks, and handcrafted gold jewellery.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cosmetics');
                  }}
                  className="px-6 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-blush-200 shadow-sm transition-all"
                >
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-blush-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-charcoal hover:text-burgundy-500 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-charcoal-muted hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-rose-dark uppercase font-medium mt-0.5">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-blush-300 rounded-lg bg-blush-50/50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-blush-200 text-charcoal rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-blush-200 text-charcoal rounded-r-lg disabled:opacity-40 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-burgundy-500">
                          {formatBDT(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Calculation */}
          {items.length > 0 && (
            <div className="p-5 border-t border-blush-200 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-gold-50 border border-gold-300 px-3 py-2 rounded-xl text-xs">
                    <span className="flex items-center gap-1.5 text-gold-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Promo code <strong>{appliedCoupon}</strong> active
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-800 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. GLIMMER10)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponFeedback(null);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-blush-50 border border-blush-200 focus:outline-none focus:ring-1 focus:ring-gold-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal hover:bg-burgundy-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Subtotal & Delivery details */}
              <div className="space-y-1.5 text-xs text-charcoal border-t border-blush-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatBDT(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatBDT(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Estimated Delivery (Dhaka)</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">Free</strong> : formatBDT(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-burgundy-500 pt-2 border-t border-blush-100">
                  <span className="font-serif">Total</span>
                  <span>{formatBDT(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-gradient-luxury hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-burgundy-500 hover:text-burgundy-600 font-medium underline"
                  >
                    View Detailed Bag
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
