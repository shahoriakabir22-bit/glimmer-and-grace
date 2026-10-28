import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle } from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Buyer Protection Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500 mb-3">
            7-Day Return & Exchange Policy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80">
            Hassle-free resolutions if your item does not meet expectations.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-sm space-y-6 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">1. Eligibility Criteria</h2>
            <p>
              You can request an exchange or refund within <strong>7 calendar days</strong> from the date of parcel receipt under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Item received is defective, broken, or damaged during transit.</li>
              <li>Incorrect variant, shade, or product was shipped.</li>
              <li>Cosmetics must be brand new, unswatched, and with the outer tamper-evident plastic seal intact due to sanitary and dermatological guidelines.</li>
              <li>Jewellery must include original pouches, tags, and authenticity cards.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">2. How to Claim a Return</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Take a clear unboxing video or photographs highlighting the issue.</li>
              <li>WhatsApp our support team at <strong>+880 1712 345678</strong> with your Order ID (e.g. #GG-1042).</li>
              <li>Our team will dispatch a replacement or arrange courier pickup within 48 hours.</li>
            </ol>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">3. Refund Processing</h2>
            <p>
              Refunds for eligible returns are disbursed via bKash, Nagad, or direct bank transfer within 3-5 working days following parcel inspection at our Dhaka fulfillment hub.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
