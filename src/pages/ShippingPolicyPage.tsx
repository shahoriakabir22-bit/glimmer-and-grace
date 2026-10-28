import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Nationwide Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500 mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80">
            Learn how we package, dispatch, and track your parcels across Bangladesh.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-sm space-y-6 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">1. Delivery Coverage & Timeframes</h2>
            <p>
              We provide doorstep delivery to all 64 districts and 8 divisions of Bangladesh in partnership with leading delivery services (Pathao, Steadfast Courier, and RedX).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Inside Dhaka City:</strong> 24 to 48 hours from order confirmation.</li>
              <li><strong>Dhaka Suburbs (Savar, Gazipur, Narayanganj):</strong> 48 to 72 hours.</li>
              <li><strong>All Other Divisions (Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh):</strong> 3 to 5 business days.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">2. Delivery Charges</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Free Delivery:</strong> All orders totaling ৳1,500 or more qualify for FREE delivery in Dhaka.</li>
              <li><strong>Standard Dhaka Rate:</strong> Flat ৳70 for orders below ৳1,500.</li>
              <li><strong>Outside Dhaka Rate:</strong> Flat ৳130 for nationwide parcel deliveries.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">3. Tamper-Proof Packaging</h2>
            <p>
              All delicate cosmetics and handcrafted jewellery are double-bubble wrapped and shipped in signature GLIMMER & Grace blush-and-gold gift boxes with security seals. If the external seal appears broken upon delivery, please inspect the contents before accepting.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
