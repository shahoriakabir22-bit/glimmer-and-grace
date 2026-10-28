import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatBDT } from '../../lib/bdValidation';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-blush-200 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-charcoal hover:text-burgundy-500 hover:bg-blush-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Preview */}
          <div className="p-6 bg-ivory-100 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-blush-200 mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-burgundy-500 ring-2 ring-gold-400/50' : 'border-blush-200 hover:border-gold-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">
                {product.category} • {product.subcategory}
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal mt-1 mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-charcoal-muted">({product.reviewCount} reviews)</span>
                <span className="text-xs text-emerald-600 font-medium ml-auto">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-burgundy-500">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-charcoal-muted line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-charcoal/80 leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-blush-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-blush-300 rounded-xl bg-blush-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-charcoal hover:bg-blush-200 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-charcoal hover:bg-blush-200 rounded-r-xl disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-burgundy-500 hover:bg-burgundy-600 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border border-blush-300 transition-colors ${
                    isFavorited ? 'bg-rose-50 border-rose-300 text-rose-500' : 'hover:bg-blush-100 text-charcoal'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full text-center text-xs text-burgundy-500 hover:text-burgundy-600 font-semibold flex items-center justify-center gap-1.5 py-1"
              >
                <span>View Full Product Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
