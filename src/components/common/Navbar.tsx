import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronDown,
  LogOut,
  LayoutDashboard,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { formatBDT } from '../../lib/bdValidation';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { products } = useProducts();
  const { settings } = useSiteSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  // Handle outside click for search and user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      ).slice(0, 5);
      setSearchResults(matched);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cosmetics', path: '/cosmetics' },
    { name: 'Jewellery', path: '/jewellery' },
    { name: 'Offers', path: '/shop?filter=offers' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-ivory-100 shadow-sm transition-all duration-300">
      {/* Top Announcement Bar */}
      {settings.announcementEnabled && (
        <div className="bg-gradient-luxury text-ivory-200 text-xs py-2 px-4 border-b border-gold-500/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
            <div className="flex items-center gap-4 text-center sm:text-left mx-auto sm:mx-0">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-gold-400" />
                <span>{settings.announcementText}</span>
              </span>
              {settings.promoCode && (
                <>
                  <span className="hidden md:inline text-rose-300">|</span>
                  <span className="hidden md:flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>{settings.promoDiscountText || `Use Code ${settings.promoCode} for Discount`}</span>
                  </span>
                </>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-6 text-[11px] text-ivory-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> 100% Authentic Guarantee
              </span>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-gold-300 transition-colors">
                Helpline: {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="border-b border-blush-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-burgundy-500 hover:bg-blush-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/images/logo.png"
                alt="Glimmer & Grace Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-gold-500/40 p-0.5 group-hover:ring-gold-500 transition-all shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-burgundy-500 leading-none group-hover:text-burgundy-600 transition-colors">
                  GLIMMER <span className="font-serif font-light text-rose-dark">&</span> Grace
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-medium text-gold-600 uppercase mt-1">
                  BEAUTY & BEYOND
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search skincare, lipsticks, earrings, necklaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full text-sm bg-blush-50 border border-blush-200 text-charcoal placeholder-charcoal-muted focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                />
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Live Search Autocomplete Popup */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-luxury border border-blush-200 py-3 z-50 overflow-hidden">
                  <div className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                    Matching Products
                  </div>
                  <div className="divide-y divide-blush-100">
                    {searchResults.map(p => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blush-50 transition-colors"
                      >
                        <img 
                          src={p.thumbnail} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-blush-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                          <p className="text-xs text-rose-dark capitalize">{p.category} • {p.subcategory}</p>
                        </div>
                        <span className="text-sm font-bold text-burgundy-500">{formatBDT(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-blush-100 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-medium text-gold-600 hover:text-gold-700 underline"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-burgundy-500 font-semibold'
                      : 'text-charcoal hover:text-burgundy-500'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-gold rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions: Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="p-2.5 rounded-full text-charcoal hover:text-burgundy-500 hover:bg-blush-100 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-full text-charcoal hover:text-burgundy-500 hover:bg-blush-100 transition-colors relative"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-burgundy-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-full border border-blush-300 hover:border-gold-500 hover:bg-blush-50 transition-all text-charcoal text-sm"
                  aria-label="Account Menu"
                >
                  <User className="w-4 h-4 text-burgundy-500" />
                  <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">
                    {userProfile ? userProfile.displayName.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury border border-blush-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {currentUser || userProfile ? (
                      <>
                        <div className="px-4 py-2 border-b border-blush-100">
                          <p className="text-xs text-charcoal-muted">Signed in as</p>
                          <p className="text-sm font-semibold text-charcoal truncate">{userProfile?.displayName || currentUser?.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-bold uppercase rounded-full">
                              Administrator
                            </span>
                          )}
                        </div>

                        <Link
                          to="/account"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal hover:bg-blush-50 hover:text-burgundy-500 transition-colors"
                        >
                          <User className="w-4 h-4 text-burgundy-500" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          to="/account?tab=orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal hover:bg-blush-50 hover:text-burgundy-500 transition-colors"
                        >
                          <PackageCheck className="w-4 h-4 text-burgundy-500" />
                          <span>My Orders</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gold-700 bg-gold-50 hover:bg-gold-100 transition-colors border-y border-gold-200"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gold-600" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 text-center border-b border-blush-100">
                          <p className="text-xs text-charcoal-muted mb-2">Welcome to Glimmer & Grace</p>
                          <Link
                            to="/login"
                            className="block w-full py-2 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                          >
                            Sign In / Register
                          </Link>
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-muted hover:text-gold-600 hover:bg-blush-50 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Admin Portal</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Search Bar in Navbar */}
      <div className="md:hidden px-4 py-2.5 bg-white border-b border-blush-100">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search cosmetics & jewellery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full text-xs bg-blush-50 border border-blush-200 text-charcoal placeholder-charcoal-muted focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
          <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm h-full bg-ivory-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-blush-200">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                  <span className="font-serif font-bold text-lg text-burgundy-500">GLIMMER & Grace</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-charcoal hover:bg-blush-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blush-200/80 text-burgundy-500 font-semibold'
                        : 'text-charcoal hover:bg-blush-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-blush-200 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted px-4">Collections</p>
                <Link
                  to="/category/cosmetics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-charcoal hover:text-burgundy-500"
                >
                  💄 Cosmetics (Skincare, Makeup, Lipstick)
                </Link>
                <Link
                  to="/category/jewellery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-charcoal hover:text-burgundy-500"
                >
                  ✨ Jewellery (Earrings, Necklaces, Rings)
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-blush-200">
              {currentUser ? (
                <div className="space-y-2">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-burgundy-500 text-white rounded-xl text-sm font-medium"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center py-2 text-rose-600 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-burgundy-500 text-white rounded-xl text-sm font-medium"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
