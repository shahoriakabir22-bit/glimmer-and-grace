import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatBDT } from '../../lib/bdValidation';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-blush-200/80 overflow-hidden shadow-sm hover:shadow-luxury-hover hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 bg-burgundy-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 bg-gradient-gold text-charcoal text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="px-2.5 py-1 bg-blush-300 text-burgundy-700 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            New
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-semibold rounded-full border border-amber-200">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Floating Action Buttons: Wishlist & Quick View */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isFavorited
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 hover:bg-white text-charcoal hover:text-rose-500'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-charcoal hover:text-burgundy-500 backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-ivory-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-blush-100 animate-pulse" />
        )}
        <img
          src={isHovered && product.images.length > 1 ? product.images[1] : product.thumbnail}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-medium text-gold-600 uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span className="text-charcoal-muted">|</span>
            <span className="capitalize">{product.subcategory}</span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block font-medium text-sm text-charcoal hover:text-burgundy-500 transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-charcoal">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-charcoal-muted">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-blush-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-base font-bold font-serif text-burgundy-500">
              {formatBDT(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-charcoal-muted line-through">
                {formatBDT(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-charcoal/20 text-charcoal-muted cursor-not-allowed'
                : 'bg-blush-200 hover:bg-burgundy-500 hover:text-white text-burgundy-600'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
