import React from 'react';
import { Truck, ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Truck,
      title: 'Free Delivery',
      subtitle: 'On orders over ৳1,500 across Bangladesh'
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      subtitle: 'Original products directly from trusted makers'
    },
    {
      icon: Lock,
      title: 'Safe & Secure',
      subtitle: 'Your personal data & orders are protected'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: 'Hassle-free 7-day exchange or return guarantee'
    }
  ];

  return (
    <section className="bg-white py-8 border-b border-blush-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {props.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-3 rounded-2xl hover:bg-blush-50/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center text-burgundy-500 shrink-0 ring-1 ring-blush-200">
                  <Icon className="w-6 h-6 text-burgundy-500" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal">
                    {item.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
