import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BD_DIVISIONS, BDDivision, validateBDPhoneNumber, formatBDT } from '../lib/bdValidation';
import { placeTrustedOrder } from '../lib/firestoreService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, subtotal, discount, appliedCoupon, selectedDivision, setSelectedDivision } = useCart();
  const { currentUser, userProfile } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [division, setDivision] = useState<BDDivision>(selectedDivision || 'Dhaka');
  const [notes, setNotes] = useState('');

  // UI status
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync division change to CartContext to update delivery calculation
  const handleDivisionChange = (newDiv: BDDivision) => {
    setDivision(newDiv);
    setSelectedDivision(newDiv);
  };

  // Recalculate delivery fee based on division
  const isFreeDelivery = subtotal >= 1500;
  const currentDeliveryCharge = isFreeDelivery ? 0 : (division === 'Dhaka' ? 70 : 130);
  const grandTotal = Math.max(0, subtotal - discount + currentDeliveryCharge);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-ivory-200">
        <h2 className="font-serif text-2xl font-bold text-burgundy-500 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-charcoal-muted mb-6">Your shopping bag is currently empty.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-burgundy-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate phone number
    const phoneVal = validateBDPhoneNumber(phone);
    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.message || 'Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }
    setPhoneError(null);

    if (!fullName.trim() || !address.trim() || !city.trim()) {
      setFormError('Please fill in all mandatory delivery fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderRes = await placeTrustedOrder({
        userId: currentUser?.uid || userProfile?.uid,
        customerDetails: {
          fullName: fullName.trim(),
          phone: phoneVal.formatted,
          email: currentUser?.email || userProfile?.email,
          houseRoadArea: address.trim(),
          city: city.trim(),
          division,
          deliveryNotes: notes.trim()
        },
        cartItems: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity
        })),
        couponCode: appliedCoupon,
        notes: notes.trim()
      });

      if (!orderRes.success || !orderRes.order) {
        setFormError(orderRes.error || 'Failed to place order. Please review your details.');
        setIsSubmitting(false);
        return;
      }

      // Clear cart and redirect to celebratory confirmation page
      clearCart();
      navigate(`/order-success/${orderRes.order.id}`, { state: { order: orderRes.order } });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while placing your order. Please try again.';
      setFormError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory-200 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Secure Order Finalization
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500 mb-6">
            Checkout
          </h1>

          {/* Stepper visualization */}
          <div className="flex items-center justify-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-burgundy-500">
              <span className="w-6 h-6 rounded-full bg-burgundy-500 text-white flex items-center justify-center text-xs">1</span>
              <span>Shipping</span>
            </span>
            <div className="w-8 h-0.5 bg-gold-400" />
            <span className="flex items-center gap-1.5 font-bold text-burgundy-500">
              <span className="w-6 h-6 rounded-full bg-burgundy-500 text-white flex items-center justify-center text-xs">2</span>
              <span>Payment</span>
            </span>
            <div className="w-8 h-0.5 bg-blush-300" />
            <span className="flex items-center gap-1.5 font-medium text-charcoal-muted">
              <span className="w-6 h-6 rounded-full bg-blush-200 text-charcoal flex items-center justify-center text-xs">3</span>
              <span>Confirm</span>
            </span>
          </div>
        </div>

        {formError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Delivery & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Delivery Information Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-blush-200 text-burgundy-500">
                <MapPin className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif text-xl font-bold">1. Delivery Information</h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Rahman"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                    <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Mobile Number with Bangladesh validation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    Bangladeshi Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="01712345678"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-blush-50 border text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 ${
                        phoneError ? 'border-rose-400 focus:ring-rose-500' : 'border-blush-300 focus:ring-gold-500'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {phoneError ? (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{phoneError}</p>
                  ) : (
                    <p className="text-[10px] text-charcoal-muted mt-1">
                      Used for delivery confirmation SMS & courier phone calls (11 digits: 013 - 019).
                    </p>
                  )}
                </div>

                {/* Division & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Division <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value as BDDivision)}
                      className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
                    >
                      {BD_DIVISIONS.map(div => (
                        <option key={div} value={div}>
                          {div} {div === 'Dhaka' ? '(Inside Dhaka - ৳70)' : '(Outside Dhaka - ৳130)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      City / Area <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhanmondi, Gulshan, Agrabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                {/* Address (House, Road, Area) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    Delivery Address (House, Road, Sector / Area) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. House #24, Road #4/A, Dhanmondi R/A"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    Order / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver after 3:00 PM, ring door bell"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-blush-200 text-burgundy-500">
                <Banknote className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif text-xl font-bold">2. Payment Method</h2>
              </div>

              {/* Cash on Delivery Selection */}
              <div className="p-4 rounded-2xl border-2 border-burgundy-500 bg-blush-50/70 flex items-start gap-4">
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    checked
                    readOnly
                    className="w-4 h-4 text-burgundy-500 focus:ring-gold-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cod" className="block text-sm font-bold text-burgundy-600 cursor-pointer">
                    Cash on Delivery (COD)
                  </label>
                  <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">
                    Pay securely in cash when our courier partner brings your luxury package directly to your door. You can inspect the outer packaging before receiving.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No advance fee required for standard items</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-ivory-100 rounded-2xl border border-blush-200 text-[11px] text-charcoal-muted">
                Need bKash / Nagad advance payment? Contact our helpline after placing your order and mention your Order ID.
              </div>
            </div>

          </div>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-blush-200">
                <h2 className="font-serif text-xl font-bold text-burgundy-500">
                  Order Summary
                </h2>
                <Link to="/cart" className="text-xs text-burgundy-500 hover:underline font-semibold flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit Bag</span>
                </Link>
              </div>

              {/* Items Preview */}
              <div className="divide-y divide-blush-100 max-h-60 overflow-y-auto pr-1 space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-blush-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate">{item.product.name}</p>
                      <p className="text-[11px] text-charcoal-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-burgundy-500">
                      {formatBDT(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 text-xs text-charcoal border-t border-blush-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatBDT(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatBDT(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">
                    Delivery Charge ({division === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span>
                    {currentDeliveryCharge === 0 ? (
                      <strong className="text-emerald-600 uppercase text-[11px]">Free Delivery</strong>
                    ) : (
                      formatBDT(currentDeliveryCharge)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-burgundy-500 pt-3 border-t border-blush-200">
                  <span className="font-serif">Total Payable</span>
                  <span>{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-luxury hover:opacity-95 text-white font-bold rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-luxury transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>Place Order (Cash on Delivery)</span>
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 border-t border-blush-100 text-[11px] text-charcoal-muted text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gold-600" />
                  <span>Standard delivery in 2-3 days inside Dhaka, 3-5 days nationwide</span>
                </p>
                <p>By placing this order, you agree to our Terms of Service & Privacy Policy.</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
