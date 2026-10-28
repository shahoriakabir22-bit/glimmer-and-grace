import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Legal Terms & Conditions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500 mb-3">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80">
            Terms governing your use of the GLIMMER & Grace website and purchasing agreement.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-sm space-y-6 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">1. Acceptance of Terms</h2>
            <p>
              By accessing GLIMMER & Grace or placing an order, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">2. Pricing & Currency</h2>
            <p>
              All prices quoted on the store are in Bangladeshi Taka (BDT ৳) and include applicable trade taxes. Total payable figures are computed and verified by our backend server engine before orders are committed.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">3. Order Fulfillment & Refusal</h2>
            <p>
              We reserve the right to cancel orders in the rare event of inventory stock discrepancies, suspected fraudulent phone validations, or courier accessibility constraints. In such circumstances, the customer will be contacted immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
