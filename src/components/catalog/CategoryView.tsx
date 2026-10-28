import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../common/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';
import { Product, ProductCategory, ProductSubcategory } from '../../types/product';
import { formatBDT } from '../../lib/bdValidation';

interface CategoryViewProps {
  category?: ProductCategory;
  title: string;
  subtitle: string;
  bannerImage: string;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  title,
  subtitle,
  bannerImage
}) => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSubcategory = searchParams.get('sub') as ProductSubcategory | null;
  const urlFilter = searchParams.get('filter');
  const urlSearch = searchParams.get('search');

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(urlSubcategory || 'all');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Subcategory options based on category
  const subcategoryOptions = useMemo(() => {
    if (category === 'cosmetics') {
      return [
        { id: 'all', name: 'All Cosmetics' },
        { id: 'skincare', name: 'Skincare' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'lipstick', name: 'Lipstick' },
        { id: 'serum', name: 'Serum' },
        { id: 'face-wash', name: 'Face Wash' }
      ];
    }
    if (category === 'jewellery') {
      return [
        { id: 'all', name: 'All Jewellery' },
        { id: 'earrings', name: 'Earrings' },
        { id: 'necklaces', name: 'Necklaces' },
        { id: 'rings', name: 'Rings' },
        { id: 'bracelets', name: 'Bracelets' },
        { id: 'bangles', name: 'Bangles' },
        { id: 'fashion-jewellery', name: 'Fashion Jewellery' }
      ];
    }
    return [
      { id: 'all', name: 'All Categories' },
      { id: 'skincare', name: 'Skincare' },
      { id: 'makeup', name: 'Makeup' },
      { id: 'lipstick', name: 'Lipstick' },
      { id: 'earrings', name: 'Earrings' },
      { id: 'necklaces', name: 'Necklaces' },
      { id: 'rings', name: 'Rings' },
      { id: 'bracelets', name: 'Bracelets' }
    ];
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (category && p.category !== category) return false;

      // Subcategory match
      if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
        return false;
      }

      // Query search match
      if (urlSearch) {
        const q = urlSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesTag = p.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTag) return false;
      }

      // Offers filter
      if (urlFilter === 'offers' && !p.isSpecialOffer && (!p.originalPrice || p.originalPrice <= p.price)) {
        return false;
      }
      if (urlFilter === 'bestseller' && !p.isBestSeller) {
        return false;
      }

      // Price filter
      if (p.price > priceRange) return false;

      // In stock filter
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, category, selectedSubcategory, urlSearch, urlFilter, priceRange, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setPriceRange(10000);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-ivory-200 pb-20">
      
      {/* Category Hero Banner */}
      <div className="relative bg-gradient-blush border-b border-blush-200 overflow-hidden py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
              Glimmer & Grace Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-500">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/80 mt-2 max-w-lg">
              {subtitle}
            </p>
          </div>

          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-luxury border-2 border-white ring-1 ring-gold-400/50 shrink-0 hidden sm:block">
            <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-blush-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-charcoal w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-blush-100 hover:bg-blush-200 rounded-xl text-burgundy-600 font-semibold"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Catalog</span>
            </button>
            <span className="text-charcoal-muted font-medium">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-muted" />
              <span className="text-charcoal-muted hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-blush-50 border border-blush-200 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-blush-200">
                <h3 className="font-serif font-bold text-base text-burgundy-500 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium underline"
                >
                  Reset
                </button>
              </div>

              {/* Subcategories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  {subcategoryOptions.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        selectedSubcategory === sub.id
                          ? 'bg-burgundy-500 text-white font-semibold'
                          : 'text-charcoal hover:bg-blush-100'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {selectedSubcategory === sub.id && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-blush-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-burgundy-500">
                    {formatBDT(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-burgundy-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-muted mt-1">
                  <span>৳500</span>
                  <span>৳10,000</span>
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-4 border-t border-blush-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-charcoal font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-burgundy-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
              <div className="w-80 bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-blush-200">
                    <h3 className="font-serif font-bold text-base text-burgundy-500">Filter Products</h3>
                    <button onClick={() => setMobileFilterOpen(false)}>
                      <X className="w-5 h-5 text-charcoal" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Categories</h4>
                    <div className="space-y-1.5">
                      {subcategoryOptions.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubcategory(sub.id);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                            selectedSubcategory === sub.id ? 'bg-burgundy-500 text-white' : 'text-charcoal hover:bg-blush-100'
                          }`}
                        >
                          <span>{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blush-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Max Price</h4>
                      <span className="text-xs font-bold text-burgundy-500">{formatBDT(priceRange)}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-burgundy-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-blush-200">
                    <label className="flex items-center gap-2 text-xs text-charcoal">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded text-burgundy-500 w-4 h-4"
                      />
                      <span>In Stock Only</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-blush-200 flex gap-2">
                  <button
                    onClick={() => {
                      resetFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="w-1/2 py-2.5 bg-blush-100 text-charcoal rounded-xl text-xs font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-1/2 py-2.5 bg-burgundy-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-blush-200 shadow-sm">
                <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-burgundy-500">No matching products found</h3>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto mt-2 mb-6">
                  Try adjusting your filters, clearing the price range, or searching for other items.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-burgundy-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
