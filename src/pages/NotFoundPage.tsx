import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-luxury text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blush-100 text-burgundy-500 flex items-center justify-center mx-auto ring-8 ring-blush-50">
          <Sparkles className="w-8 h-8 text-gold-600" />
        </div>
        <span className="font-serif text-5xl sm:text-6xl font-extrabold text-burgundy-500 block">
          404
        </span>
        <h1 className="font-serif text-2xl font-bold text-charcoal">
          Page Not Found
        </h1>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us guide you back to our collections.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
