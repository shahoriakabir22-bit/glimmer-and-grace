import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle, Printer, ArrowRight, Package, Clock, Phone, MapPin } from 'lucide-react';
import { Order } from '../types/order';
import { formatBDT } from '../lib/bdValidation';
import { fetchAllOrders } from '../lib/firestoreService';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as { order?: Order })?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C8A45D', '#632C3B', '#E9A1AD', '#F8DDE2']
      });
    } catch (e) {
      // ignore
    }

    if (!order && orderId) {
      fetchAllOrders().then(orders => {
        const found = orders.find(o => o.id === orderId);
        if (found) setOrder(found);
        setLoading(false);
      });
    }
  }, [order, orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory-200">
        <div className="w-10 h-10 border-4 border-burgundy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-ivory-200">
        <h2 className="font-serif text-2xl font-bold text-burgundy-500 mb-2">Order Completed</h2>
        <p className="text-xs text-charcoal-muted mb-6">
          Thank you for choosing GLIMMER & Grace.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-burgundy-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-ivory-200 min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            Your parcel will be carefully packed with love and delivered via our courier partner.
          </p>
        </div>

        {/* Printable Receipt Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-blush-200 shadow-luxury space-y-8 print:shadow-none print:border-none">
          
          {/* Header metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blush-200">
            <div>
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="w-9 h-9 rounded-full" />
                <span className="font-serif font-bold text-lg text-burgundy-500">GLIMMER & Grace</span>
              </div>
              <p className="text-[10px] text-gold-600 uppercase tracking-widest mt-0.5">Beauty & Beyond</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-charcoal-muted block">Order ID</span>
              <span className="font-mono text-sm font-bold text-charcoal">{order.id}</span>
              <span className="text-[11px] text-charcoal-muted block mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Delivery & Payment Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-blush-50 p-4 rounded-2xl border border-blush-200">
            <div>
              <span className="font-bold uppercase tracking-wider text-charcoal-muted text-[10px] block mb-1">
                Recipient Details
              </span>
              <p className="font-bold text-charcoal flex items-center gap-1.5">
                <span>{order.customerDetails.fullName}</span>
              </p>
              <p className="text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-burgundy-500" />
                <span>{order.customerDetails.phone}</span>
              </p>
              <p className="text-charcoal-muted flex items-start gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-burgundy-500 shrink-0 mt-0.5" />
                <span>{order.customerDetails.houseRoadArea}, {order.customerDetails.city}, {order.customerDetails.division}</span>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold uppercase tracking-wider text-charcoal-muted text-[10px] block mb-1">
                Payment & Fulfillment
              </span>
              <p className="font-semibold text-charcoal">
                Payment: <strong className="text-burgundy-600 uppercase">Cash on Delivery</strong>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span className="capitalize">Status: {order.orderStatus}</span>
              </div>
            </div>
          </div>

          {/* Itemized list */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-4">
              Purchased Items
            </h3>
            <div className="divide-y divide-blush-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-blush-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-charcoal truncate">{item.name}</p>
                      <p className="text-[11px] text-charcoal-muted">Qty: {item.quantity} × {formatBDT(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-burgundy-500 shrink-0">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-blush-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">{formatBDT(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatBDT(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-muted">
              <span>Delivery Charge</span>
              <span>{order.deliveryCharge === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">Free</strong> : formatBDT(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-burgundy-500 pt-3 border-t border-blush-200">
              <span className="font-serif">Total Payable on Delivery</span>
              <span>{formatBDT(order.total)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-blush-50 text-charcoal border border-blush-300 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-burgundy-500" />
            <span>Print Receipt</span>
          </button>

          <Link
            to="/account?tab=orders"
            className="w-full sm:w-auto px-6 py-3 bg-blush-200 hover:bg-blush-300 text-burgundy-700 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>View All My Orders</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
