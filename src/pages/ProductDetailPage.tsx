import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ChevronRight,
  ArrowRight,
  Send
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../lib/bdValidation';
import { ProductCard } from '../components/common/ProductCard';
import { ProductReview } from '../types/product';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentUser, userProfile } = useAuth();

  const product = products.find(p => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [addedToast, setAddedToast] = useState(false);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || product.thumbnail);
      setQuantity(1);
      setLocalReviews(product.reviews || []);
      setReviewSubmitted(false);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-ivory-200">
        <Sparkles className="w-12 h-12 text-gold-500 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-burgundy-500">Product Not Found</h2>
        <p className="text-xs text-charcoal-muted mt-2 mb-6">
          The requested product may have been relocated or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-burgundy-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: userProfile?.displayName || currentUser?.displayName || 'Verified Buyer',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewComment('');
    setReviewSubmitted(true);
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4);

  return (
    <div className="bg-ivory-200 min-h-screen pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-blush-200/80 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-charcoal-muted">
            <Link to="/" className="hover:text-burgundy-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-blush-300" />
            <Link to={`/${product.category}`} className="hover:text-burgundy-500 capitalize transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-blush-300" />
            <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Main Product Section: Gallery + Details */}
        <div className="bg-white rounded-3xl border border-blush-200 shadow-sm overflow-hidden p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] pb-2 sm:pb-0 shrink-0">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img
                          ? 'border-burgundy-500 ring-2 ring-gold-400/50 scale-105'
                          : 'border-blush-200 hover:border-gold-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 aspect-square rounded-3xl overflow-hidden bg-ivory-100 border border-blush-200 relative group">
                <img
                  src={selectedImage || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-burgundy-500 text-white text-xs font-bold uppercase rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Info Column (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-charcoal-muted mb-2">
                  <span className="uppercase tracking-widest font-semibold text-gold-600">
                    {product.category} • {product.subcategory}
                  </span>
                  <span className="font-mono text-[11px]">SKU: {product.sku}</span>
                </div>

                {/* Name & Tagline */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-burgundy-500 leading-tight mb-2">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="text-xs sm:text-sm text-charcoal-light font-medium italic mb-4">
                    {product.tagline}
                  </p>
                )}

                {/* Rating & Stock */}
                <div className="flex flex-wrap items-center gap-4 py-3 border-y border-blush-100 mb-6">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-blush-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-charcoal ml-1">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-charcoal-muted">({product.reviewCount} customer reviews)</span>
                  </div>

                  <span className="text-blush-300">|</span>

                  <div>
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        In Stock ({product.stock} units)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
                    {formatBDT(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base sm:text-lg text-charcoal-muted line-through">
                      {formatBDT(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                      Save {formatBDT(product.originalPrice! - product.price)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Trust mini-banner */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-blush-50 rounded-2xl border border-blush-200 mb-6 text-center text-[11px] text-charcoal">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-burgundy-500" />
                    <span>Free over ৳1,500</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-burgundy-500" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-burgundy-500" />
                    <span>7 Days Return</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons & Quantity */}
              <div className="space-y-4 pt-6 border-t border-blush-200">
                <div className="flex items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-blush-300 rounded-2xl bg-blush-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-charcoal hover:bg-blush-200 rounded-xl transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-charcoal">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3.5 py-2 text-charcoal hover:bg-blush-200 rounded-xl transition-colors font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md ${
                      addedToast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blush-200 hover:bg-blush-300 text-burgundy-700'
                    }`}
                  >
                    {addedToast ? (
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

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFavorited
                        ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-xs'
                        : 'border-blush-300 text-charcoal hover:bg-blush-100'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-4 bg-gradient-luxury hover:opacity-95 text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury transition-all"
                >
                  <span>Buy Now (Instant Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Specifications & Customer Reviews */}
        <div className="bg-white rounded-3xl border border-blush-200 shadow-sm p-6 sm:p-10 mb-16">
          <div className="flex border-b border-blush-200 gap-8 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative shrink-0 ${
                activeTab === 'description'
                  ? 'text-burgundy-500'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Description & Highlights
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative shrink-0 ${
                activeTab === 'specs'
                  ? 'text-burgundy-500'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {product.category === 'cosmetics' ? 'Ingredients & How to Use' : 'Materials & Craftsmanship'}
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative shrink-0 ${
                activeTab === 'reviews'
                  ? 'text-burgundy-500'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Customer Reviews ({localReviews.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-xs sm:text-sm leading-relaxed text-charcoal/85">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <div className="pt-4">
                  <h4 className="font-serif font-bold text-base text-burgundy-500 mb-2">Key Highlights</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-charcoal/80">
                    <li>Dermatologically approved and formulated with premium organic botanical extracts.</li>
                    <li>Designed to provide enduring radiance under Bangladesh weather conditions.</li>
                    <li>Cruelty-free, paraben-free, and packaged in eco-conscious luxury casing.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-6 max-w-3xl">
                {product.ingredients && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-burgundy-500 mb-2">Ingredients</h4>
                    <p className="bg-blush-50 p-4 rounded-2xl border border-blush-200 font-mono text-xs text-charcoal leading-loose">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {product.materials && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-burgundy-500 mb-2">Artisanal Materials</h4>
                    <p className="bg-blush-50 p-4 rounded-2xl border border-blush-200 text-xs text-charcoal leading-relaxed">
                      {product.materials}
                    </p>
                  </div>
                )}

                {product.howToUse && (
                  <div>
                    <h4 className="font-serif font-bold text-base text-burgundy-500 mb-2">How to Use & Care</h4>
                    <p>{product.howToUse}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Submit New Review Form */}
                <div className="bg-blush-50/70 p-6 rounded-3xl border border-blush-200">
                  <h4 className="font-serif font-bold text-base text-burgundy-500 mb-3">
                    Write a Review
                  </h4>

                  {reviewSubmitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium">
                      Thank you! Your feedback has been verified and added to GLIMMER & Grace.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                          Rating
                        </label>
                        <div className="flex gap-1.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'text-blush-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                          Your Review
                        </label>
                        <textarea
                          rows={3}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          required
                          className="w-full p-3 rounded-2xl border border-blush-300 bg-white text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {localReviews.length === 0 ? (
                    <p className="text-charcoal-muted text-xs italic">
                      No customer reviews yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    localReviews.map(r => (
                      <div key={r.id} className="p-4 rounded-2xl border border-blush-100 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-burgundy-500">{r.userName}</span>
                          <span className="text-[11px] text-charcoal-muted">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-charcoal/80">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like Row */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
                Recommendations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-500">
                You May Also Like
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
