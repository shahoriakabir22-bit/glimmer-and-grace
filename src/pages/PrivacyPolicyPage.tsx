import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Data Integrity & Confidentiality
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500 mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80">
            How GLIMMER & Grace protects your personal data and account credentials.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-sm space-y-6 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">1. Information We Collect</h2>
            <p>
              When you browse, register, or order from GLIMMER & Grace, we collect strictly the necessary information needed to fulfill your purchases: your name, contact phone number, delivery address, email, and order history.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">2. Security of Your Data</h2>
            <p>
              We implement industry-standard encryption and restrictive Cloud Firestore security rules. Your phone number and address are shared solely with our assigned logistics courier for physical parcel handoff and are never sold or leased to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-blush-200">
            <h2 className="font-serif text-lg font-bold text-burgundy-500">3. Account Deletion & Queries</h2>
            <p>
              You may request a copy of your stored records or request complete account erasure by contacting our Data Protection Officer at <code>privacy@glimmergrace.com</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
