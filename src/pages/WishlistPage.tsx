import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-ivory-200">
        <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-6 ring-8 ring-rose-50">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-burgundy-500">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mt-2 mb-8">
          Save your favorite cosmetic shades and artisanal gold jewelry pieces for quick access later.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-luxury transition-all flex items-center gap-2"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-200 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 pb-4 border-b border-blush-200">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Saved Curations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
            My Wishlist ({wishlistCount} Items)
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};
