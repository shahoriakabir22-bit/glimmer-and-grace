import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all cosmetics sold on GLIMMER & Grace 100% authentic?',
      a: 'Yes, absolutely. We source exclusively from certified global manufacturers and verified authorized distributors. Every skincare and makeup formulation comes with a batch verification guarantee.'
    },
    {
      q: 'What are your delivery charges and timeframes across Bangladesh?',
      a: 'We offer FREE Delivery inside Dhaka on all orders over ৳1,500. For orders under ৳1,500, delivery is ৳70 within Dhaka (24-48 hours delivery) and ৳130 outside Dhaka (48-72 hours via trusted courier partners like Pathao and Steadfast).'
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'You do not have to pay anything in advance for standard orders. Place your order online, receive a verification phone call or SMS, and pay the courier agent in cash once the parcel arrives at your doorstep.'
    },
    {
      q: 'What materials are used in GLIMMER & Grace jewellery?',
      a: 'Our jewellery features high-grade brass and copper alloys electroplated with 18K to 22K micro-gold finish, coated with anti-tarnish protective lacquer. We use AAA Cubic Zirconia crystals, synthetic rubies/emeralds, and cultured freshwater pearls. All pieces are nickel-free and hypoallergenic.'
    },
    {
      q: 'What is your 7-Day Return and Exchange policy?',
      a: 'If your jewellery or cosmetic arrives damaged, defective, or incorrect, you can initiate a return or exchange within 7 days of delivery. For hygiene reasons, cosmetics must be unopened with the original safety seal intact.'
    },
    {
      q: 'How do I care for my gold-plated jewellery?',
      a: 'Keep your jewellery away from direct contact with perfume, water, and hairspray. Store each item in a separate velvet pouch or airtight box after wearing.'
    }
  ];

  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-burgundy-500 mb-4">
            How Can We Help?
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80">
            Find quick answers to common questions regarding orders, authentic cosmetics, and jewellery care.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-blush-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-burgundy-500 hover:text-burgundy-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed border-t border-blush-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
