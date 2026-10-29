import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  X, 
  DollarSign, 
  TrendingUp, 
  RefreshCw, 
  Filter, 
  Eye, 
  Check, 
  Phone, 
  MapPin, 
  Mail, 
  Globe, 
  Sparkles, 
  Crown, 
  Heart, 
  Printer, 
  Sliders, 
  Save, 
  Truck,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Product, ProductCategory, ProductSubcategory } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { SiteSettings } from '../types/settings';
import { formatBDT } from '../lib/bdValidation';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  saveProduct, 
  removeProduct, 
  seedProductsToFirestore 
} from '../lib/firestoreService';

type AdminTab = 'overview' | 'products' | 'orders' | 'hero' | 'store-settings' | 'zennia' | 'superadmin';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isSuperAdmin, grantAdminRole, login } = useAuth();
  const { products, refreshProducts } = useProducts();
  const { settings, updateSettings, resetSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Direct login state for unauthenticated users
  const [directEmail, setDirectEmail] = useState('yeasin201614@gamil.com');
  const [directPass, setDirectPass] = useState('yeasin123');
  const [directLoginError, setDirectLoginError] = useState<string | null>(null);

  // Product Modal (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Order Search & Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Product Search & Filter
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState<string>('all');

  // Form states for settings tabs
  const [heroForm, setHeroForm] = useState({
    heroBadge: settings.heroBadge,
    heroTitleLine1: settings.heroTitleLine1,
    heroTitleLine2: settings.heroTitleLine2,
    heroSubtitle: settings.heroSubtitle,
    heroPrimaryCtaText: settings.heroPrimaryCtaText,
    heroPrimaryCtaLink: settings.heroPrimaryCtaLink,
    heroSecondaryCtaText: settings.heroSecondaryCtaText,
    heroSecondaryCtaLink: settings.heroSecondaryCtaLink,
    heroImageUrl: settings.heroImageUrl,
    heroOfferBadge: settings.heroOfferBadge
  });

  const [storeForm, setStoreForm] = useState({
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    operatingHours: settings.operatingHours,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    youtubeUrl: settings.youtubeUrl,
    deliveryInsideDhaka: settings.deliveryInsideDhaka,
    deliveryOutsideDhaka: settings.deliveryOutsideDhaka,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    announcementEnabled: settings.announcementEnabled,
    announcementText: settings.announcementText,
    promoCode: settings.promoCode,
    promoDiscountText: settings.promoDiscountText
  });

  const [zenniaForm, setZenniaForm] = useState({
    zenniaBadge: settings.zenniaBadge,
    zenniaTitle: settings.zenniaTitle,
    zenniaSubtitle: settings.zenniaSubtitle,
    zenniaDescription: settings.zenniaDescription,
    zenniaQuote: settings.zenniaQuote,
    zenniaDedicatedBy: settings.zenniaDedicatedBy,
    zenniaImageUrl: settings.zenniaImageUrl,
    zenniaPillar1Title: settings.zenniaPillar1Title,
    zenniaPillar1Desc: settings.zenniaPillar1Desc,
    zenniaPillar2Title: settings.zenniaPillar2Title,
    zenniaPillar2Desc: settings.zenniaPillar2Desc,
    zenniaPillar3Title: settings.zenniaPillar3Title,
    zenniaPillar3Desc: settings.zenniaPillar3Desc
  });

  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Sync state when settings update
  useEffect(() => {
    setHeroForm({
      heroBadge: settings.heroBadge,
      heroTitleLine1: settings.heroTitleLine1,
      heroTitleLine2: settings.heroTitleLine2,
      heroSubtitle: settings.heroSubtitle,
      heroPrimaryCtaText: settings.heroPrimaryCtaText,
      heroPrimaryCtaLink: settings.heroPrimaryCtaLink,
      heroSecondaryCtaText: settings.heroSecondaryCtaText,
      heroSecondaryCtaLink: settings.heroSecondaryCtaLink,
      heroImageUrl: settings.heroImageUrl,
      heroOfferBadge: settings.heroOfferBadge
    });
    setStoreForm({
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      operatingHours: settings.operatingHours,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      youtubeUrl: settings.youtubeUrl,
      deliveryInsideDhaka: settings.deliveryInsideDhaka,
      deliveryOutsideDhaka: settings.deliveryOutsideDhaka,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      announcementEnabled: settings.announcementEnabled,
      announcementText: settings.announcementText,
      promoCode: settings.promoCode,
      promoDiscountText: settings.promoDiscountText
    });
    setZenniaForm({
      zenniaBadge: settings.zenniaBadge,
      zenniaTitle: settings.zenniaTitle,
      zenniaSubtitle: settings.zenniaSubtitle,
      zenniaDescription: settings.zenniaDescription,
      zenniaQuote: settings.zenniaQuote,
      zenniaDedicatedBy: settings.zenniaDedicatedBy,
      zenniaImageUrl: settings.zenniaImageUrl,
      zenniaPillar1Title: settings.zenniaPillar1Title,
      zenniaPillar1Desc: settings.zenniaPillar1Desc,
      zenniaPillar2Title: settings.zenniaPillar2Title,
      zenniaPillar2Desc: settings.zenniaPillar2Desc,
      zenniaPillar3Title: settings.zenniaPillar3Title,
      zenniaPillar3Desc: settings.zenniaPillar3Desc
    });
  }, [settings]);

  const loadAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (e) {
      console.warn('Failed to load admin orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      loadAllOrders();
    }
  }, [isAdmin, isSuperAdmin]);

  // Genuine database analytics calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  // Handle Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.category || !editingProduct.price) {
      return;
    }
    setModalSaving(true);
    try {
      const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const fullProd: Product = {
        id: editingProduct.id || `prod-${Date.now()}`,
        name: editingProduct.name,
        slug,
        tagline: editingProduct.tagline || '',
        description: editingProduct.description || '',
        ingredients: editingProduct.ingredients || '',
        materials: editingProduct.materials || '',
        howToUse: editingProduct.howToUse || '',
        category: editingProduct.category as ProductCategory,
        subcategory: (editingProduct.subcategory || 'skincare') as ProductSubcategory,
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.thumbnail || '/images/showcase.png'],
        thumbnail: editingProduct.thumbnail || editingProduct.images?.[0] || '/images/showcase.png',
        sku: editingProduct.sku || `GG-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: Number(editingProduct.stock ?? 10),
        isActive: editingProduct.isActive ?? true,
        isBestSeller: editingProduct.isBestSeller ?? false,
        isNewArrival: editingProduct.isNewArrival ?? false,
        isSpecialOffer: editingProduct.isSpecialOffer ?? false,
        rating: editingProduct.rating ?? 5.0,
        reviewCount: editingProduct.reviewCount ?? 1,
        tags: editingProduct.tags || [editingProduct.category],
        createdAt: editingProduct.createdAt || new Date().toISOString()
      };

      await saveProduct(fullProd);
      await refreshProducts();
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setModalSaving(false);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await removeProduct(id);
      await refreshProducts();
    }
  };

  // Quick Restock helper
  const handleQuickRestock = async (product: Product, amount: number = 10) => {
    await saveProduct({ ...product, stock: product.stock + amount });
    await refreshProducts();
  };

  // Handle Order Status Change
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await loadAllOrders();
  };

  // Save Hero Section
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(heroForm);
    setSettingsFeedback('Hero Banner settings updated and published successfully!');
    setTimeout(() => setSettingsFeedback(null), 3500);
  };

  // Save Store Settings
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...storeForm,
      deliveryInsideDhaka: Number(storeForm.deliveryInsideDhaka),
      deliveryOutsideDhaka: Number(storeForm.deliveryOutsideDhaka),
      freeDeliveryThreshold: Number(storeForm.freeDeliveryThreshold)
    });
    setSettingsFeedback('Store contacts, phone numbers and delivery charges updated successfully!');
    setTimeout(() => setSettingsFeedback(null), 3500);
  };

  // Save Zennia Section
  const handleSaveZennia = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(zenniaForm);
    setSettingsFeedback('The Zennia Royal Muse section updated and published successfully!');
    setTimeout(() => setSettingsFeedback(null), 3500);
  };

  // Direct login execution
  const handleDirectSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectLoginError(null);
    try {
      await login(directEmail, directPass);
      loadAllOrders();
    } catch (err: unknown) {
      setDirectLoginError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  // If not admin, render authenticated gate with 1-click Super Admin Login
  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="bg-ivory-200 min-h-screen py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blush-200 shadow-luxury text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-luxury text-white flex items-center justify-center mx-auto mb-4 ring-8 ring-gold-100 shadow-md">
            <Crown className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-burgundy-500 mb-2">
            Super Admin Portal
          </h1>
          <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
            Full control over products, orders, hero section, phone numbers, delivery fees and site customizations.
          </p>

          <form onSubmit={handleDirectSuperAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Super Admin Email</label>
              <input
                type="email"
                value={directEmail}
                onChange={(e) => setDirectEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Password</label>
              <input
                type="password"
                value={directPass}
                onChange={(e) => setDirectPass(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                required
              />
            </div>

            {directLoginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {directLoginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-luxury hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-luxury flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-gold-400" />
              <span>Sign In as Super Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-blush-100 text-[11px] text-charcoal-muted">
            Configured for <strong>Yeasin Arafat</strong> (<code className="text-burgundy-600 font-bold">yeasin201614@gamil.com</code>)
          </div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = prodSearchQuery === '' || 
      p.name.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(prodSearchQuery.toLowerCase());
    const matchesCategory = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = orderSearchQuery === '' ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.customerDetails?.phone && o.customerDetails.phone.includes(orderSearchQuery)) ||
      (o.customerDetails?.fullName && o.customerDetails.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-ivory-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-blush-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-luxury text-white flex items-center justify-center shadow-md">
              <Crown className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-burgundy-500">
                  Super Admin Management
                </h1>
                <span className="px-2.5 py-0.5 bg-gold-100 text-gold-800 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gold-300">
                  Yeasin Arafat
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Full authority: Modify products, orders, hero banner, contacts, phone numbers & Zennia tribute.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setEditingProduct({
                  isActive: true,
                  stock: 15,
                  category: 'jewellery',
                  subcategory: 'necklaces',
                  price: 1500,
                  rating: 5,
                  reviewCount: 1,
                  images: ['/images/showcase.png'],
                  thumbnail: '/images/showcase.png'
                });
                setProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-luxury hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2.5 bg-blush-100 hover:bg-blush-200 text-burgundy-600 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {settingsFeedback && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{settingsFeedback}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-blush-300/80 scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'hero', label: 'Hero Banner Section', icon: Sparkles },
            { id: 'store-settings', label: 'Phone, Contacts & Delivery', icon: Sliders },
            { id: 'zennia', label: 'Zennia Muse Section', icon: Heart },
            { id: 'superadmin', label: 'Super Admin Access', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-luxury text-white shadow-luxury'
                    : 'bg-white hover:bg-blush-100 text-charcoal border border-blush-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-burgundy-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-500 block mt-1">
                    {formatBDT(totalRevenue)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Real-time order sales
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-500 block mt-1">
                    {totalOrdersCount}
                  </span>
                  <span className="text-[10px] text-charcoal-muted block mt-1">
                    Customer checkouts
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blush-200 text-burgundy-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                    Pending Orders
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 block mt-1">
                    {pendingOrdersCount}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                    Awaiting confirmation
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                    Low Stock Alerts
                  </span>
                  <span className={`font-serif text-2xl sm:text-3xl font-bold block mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {lowStockCount}
                  </span>
                  <span className="text-[10px] text-charcoal-muted block mt-1">
                    Stock &le; 5 units
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Recent Orders */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-blush-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-blush-100">
                  <h3 className="font-serif text-lg font-bold text-burgundy-500">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-burgundy-600 font-bold hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-charcoal-muted">
                    No orders placed yet. Place a test order from the shop to see live tracking here!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="p-3.5 bg-ivory-100 rounded-2xl flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-charcoal">{o.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              o.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              o.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              o.orderStatus === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                              o.orderStatus === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {o.orderStatus}
                            </span>
                          </div>
                          <p className="text-charcoal-muted mt-0.5">
                            {o.customerDetails?.fullName} • {o.customerDetails?.city}, {o.customerDetails?.division}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-burgundy-500 block">{formatBDT(o.total)}</span>
                          <span className="text-[10px] text-charcoal-muted">{o.items.length} item(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Super Admin Controls Card */}
              <div className="bg-gradient-to-b from-white to-blush-50 rounded-3xl p-6 border border-gold-400/50 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                  <h3 className="font-serif text-lg font-bold text-burgundy-500">
                    Quick Controls
                  </h3>
                </div>
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  Jump directly to any section of the website to update details live:
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="w-full text-left p-3 bg-white hover:bg-blush-100 rounded-xl border border-blush-200 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Change Hero Headline & Image</span>
                    <ArrowRight className="w-3.5 h-3.5 text-burgundy-500" />
                  </button>
                  <button
                    onClick={() => setActiveTab('store-settings')}
                    className="w-full text-left p-3 bg-white hover:bg-blush-100 rounded-xl border border-blush-200 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Change Phone, WhatsApp & Address</span>
                    <ArrowRight className="w-3.5 h-3.5 text-burgundy-500" />
                  </button>
                  <button
                    onClick={() => setActiveTab('store-settings')}
                    className="w-full text-left p-3 bg-white hover:bg-blush-100 rounded-xl border border-blush-200 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Change Delivery Fees & Free Threshold</span>
                    <ArrowRight className="w-3.5 h-3.5 text-burgundy-500" />
                  </button>
                  <button
                    onClick={() => setActiveTab('zennia')}
                    className="w-full text-left p-3 bg-white hover:bg-blush-100 rounded-xl border border-blush-200 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Edit Zennia Dedication Section</span>
                    <ArrowRight className="w-3.5 h-3.5 text-burgundy-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prodSearchQuery}
                    onChange={(e) => setProdSearchQuery(e.target.value)}
                    placeholder="Search name or SKU..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                {/* Category Filter */}
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="jewellery">Jewellery</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    isActive: true,
                    stock: 12,
                    category: 'jewellery',
                    subcategory: 'necklaces',
                    price: 2500,
                    rating: 5,
                    reviewCount: 1,
                    images: ['/images/showcase.png'],
                    thumbnail: '/images/showcase.png'
                  });
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blush-200 text-charcoal-muted uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-100">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-ivory-100/60 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.thumbnail || p.images[0] || '/images/showcase.png'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-blush-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/showcase.png';
                          }}
                        />
                        <div>
                          <p className="font-bold text-charcoal leading-tight">{p.name}</p>
                          <p className="text-[10px] text-charcoal-muted mt-0.5">SKU: {p.sku}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-charcoal">{p.category}</span>
                        <span className="text-[10px] text-charcoal-muted block capitalize">{p.subcategory}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-burgundy-500">
                        {formatBDT(p.price)}
                        {p.originalPrice && (
                          <span className="text-[10px] text-charcoal-muted line-through block font-normal">
                            {formatBDT(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-charcoal'}`}>
                          {p.stock} units
                        </span>
                        {p.stock <= 5 && (
                          <button
                            onClick={() => handleQuickRestock(p, 10)}
                            className="text-[10px] text-burgundy-600 font-semibold block hover:underline"
                          >
                            + Restock 10
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductModalOpen(true);
                          }}
                          className="p-1.5 text-burgundy-600 hover:bg-blush-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 3: ORDER MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Phone or Name..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={loadAllOrders}
                className="px-3.5 py-2 text-xs rounded-xl border border-blush-300 hover:bg-blush-100 text-burgundy-600 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Orders</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blush-200 text-charcoal-muted uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Division & Address</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status & Update</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-charcoal-muted text-xs">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-ivory-100/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-charcoal">{o.id}</p>
                          <p className="text-[10px] text-charcoal-muted mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-charcoal">{o.customerDetails?.fullName}</p>
                          <p className="text-[11px] text-burgundy-600 font-mono mt-0.5">
                            {o.customerDetails?.phone}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-bold text-burgundy-600">{o.customerDetails?.division}</span>
                          <p className="text-[11px] text-charcoal-muted truncate mt-0.5">
                            {o.customerDetails?.houseRoadArea}, {o.customerDetails?.city}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-burgundy-500">
                          {formatBDT(o.total)}
                          <span className="text-[10px] text-charcoal-muted font-normal block">
                            COD ({o.items.length} items)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="text-[11px] font-semibold rounded-lg px-2 py-1 border border-blush-300 focus:outline-none focus:border-burgundy-500 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="px-3 py-1 bg-blush-100 hover:bg-blush-200 text-burgundy-600 rounded-lg text-xs font-semibold transition-colors"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 4: HERO SECTION MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 cols: Edit Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-blush-200">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif text-xl font-bold text-burgundy-500">
                  Hero Banner Section Customization
                </h2>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Top Badge Pill</label>
                  <input
                    type="text"
                    value={heroForm.heroBadge}
                    onChange={(e) => setHeroForm({ ...heroForm, heroBadge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="e.g. DISCOVER YOUR NATURAL BEAUTY"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Headline Part 1</label>
                    <input
                      type="text"
                      value={heroForm.heroTitleLine1}
                      onChange={(e) => setHeroForm({ ...heroForm, heroTitleLine1: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. Premium Cosmetics"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Headline Part 2</label>
                    <input
                      type="text"
                      value={heroForm.heroTitleLine2}
                      onChange={(e) => setHeroForm({ ...heroForm, heroTitleLine2: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. Exquisite Jewellery"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Subtitle / Paragraph</label>
                  <textarea
                    rows={3}
                    value={heroForm.heroSubtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={heroForm.heroPrimaryCtaText}
                      onChange={(e) => setHeroForm({ ...heroForm, heroPrimaryCtaText: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Primary Button Link</label>
                    <input
                      type="text"
                      value={heroForm.heroPrimaryCtaLink}
                      onChange={(e) => setHeroForm({ ...heroForm, heroPrimaryCtaLink: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={heroForm.heroSecondaryCtaText}
                      onChange={(e) => setHeroForm({ ...heroForm, heroSecondaryCtaText: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Secondary Button Link</label>
                    <input
                      type="text"
                      value={heroForm.heroSecondaryCtaLink}
                      onChange={(e) => setHeroForm({ ...heroForm, heroSecondaryCtaLink: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Hero Image URL</label>
                  <input
                    type="text"
                    value={heroForm.heroImageUrl}
                    onChange={(e) => setHeroForm({ ...heroForm, heroImageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="https://... or /images/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Floating Offer Badge Text</label>
                  <input
                    type="text"
                    value={heroForm.heroOfferBadge}
                    onChange={(e) => setHeroForm({ ...heroForm, heroOfferBadge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-luxury hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-luxury flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4 text-gold-400" />
                  <span>Save & Publish Hero Banner</span>
                </button>
              </form>
            </div>

            {/* Right 5 cols: Live Preview */}
            <div className="lg:col-span-5 bg-gradient-blush rounded-3xl p-6 border border-blush-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 block mb-3">
                  Live Visual Preview
                </span>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gold-300/40 space-y-3">
                  <span className="inline-block px-2.5 py-1 bg-white border border-gold-400/40 rounded-full text-[10px] font-bold text-burgundy-600 uppercase">
                    {heroForm.heroBadge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-charcoal leading-tight">
                    {heroForm.heroTitleLine1} <br />
                    <span className="italic font-light text-rose-dark">&</span>{' '}
                    <span className="text-burgundy-600">{heroForm.heroTitleLine2}</span>
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-3">
                    {heroForm.heroSubtitle}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <span className="px-3 py-1.5 bg-burgundy-500 text-white rounded-full text-[10px] font-bold">
                      {heroForm.heroPrimaryCtaText}
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-gold-400 text-burgundy-600 rounded-full text-[10px] font-bold">
                      {heroForm.heroSecondaryCtaText}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl overflow-hidden aspect-[4/3] border-2 border-white shadow-md relative">
                  <img
                    src={heroForm.heroImageUrl || '/images/showcase.png'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/showcase.png';
                    }}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 p-2 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold text-burgundy-600">
                      {heroForm.heroOfferBadge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 5: STORE CONTACTS & DELIVERY CHARGES */}
        {/* ================================================= */}
        {activeTab === 'store-settings' && (
          <div className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-blush-200">
              <Sliders className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-xl font-bold text-burgundy-500">
                Helpline Numbers, Addresses & Delivery Charges
              </h2>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-6">
              
              {/* Phone & Helpline */}
              <div className="p-4 bg-ivory-100 rounded-2xl border border-blush-200 space-y-4">
                <h3 className="font-serif font-bold text-sm text-burgundy-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-600" />
                  Helpline & WhatsApp Contact Numbers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Primary Support Phone</label>
                    <input
                      type="text"
                      value={storeForm.phone}
                      onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. +880 1712 345678"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">WhatsApp Helpline Number</label>
                    <input
                      type="text"
                      value={storeForm.whatsapp}
                      onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. +880 1812 345678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Official Support Email</label>
                    <input
                      type="email"
                      value={storeForm.email}
                      onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={storeForm.operatingHours}
                      onChange={(e) => setStoreForm({ ...storeForm, operatingHours: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. 10:00 AM – 10:00 PM (Everyday)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Showroom / Office Physical Address</label>
                  <input
                    type="text"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="Level 4, Navana Tower, Gulshan-1, Dhaka 1212"
                  />
                </div>
              </div>

              {/* Delivery Fees & Thresholds */}
              <div className="p-4 bg-ivory-100 rounded-2xl border border-blush-200 space-y-4">
                <h3 className="font-serif font-bold text-sm text-burgundy-500 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  Delivery Fees & Free Shipping Policy (BDT ৳)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Inside Dhaka Charge (৳)</label>
                    <input
                      type="number"
                      value={storeForm.deliveryInsideDhaka}
                      onChange={(e) => setStoreForm({ ...storeForm, deliveryInsideDhaka: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Outside Dhaka Charge (৳)</label>
                    <input
                      type="number"
                      value={storeForm.deliveryOutsideDhaka}
                      onChange={(e) => setStoreForm({ ...storeForm, deliveryOutsideDhaka: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Free Delivery Cart Min (৳)</label>
                    <input
                      type="number"
                      value={storeForm.freeDeliveryThreshold}
                      onChange={(e) => setStoreForm({ ...storeForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Top Announcement Bar */}
              <div className="p-4 bg-ivory-100 rounded-2xl border border-blush-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-burgundy-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    Header Announcement Bar
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeForm.announcementEnabled}
                      onChange={(e) => setStoreForm({ ...storeForm, announcementEnabled: e.target.checked })}
                      className="rounded text-burgundy-500 focus:ring-burgundy-500 w-4 h-4"
                    />
                    <span>Enable Announcement</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Announcement Text</label>
                  <input
                    type="text"
                    value={storeForm.announcementText}
                    onChange={(e) => setStoreForm({ ...storeForm, announcementText: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Promo Coupon Code</label>
                    <input
                      type="text"
                      value={storeForm.promoCode}
                      onChange={(e) => setStoreForm({ ...storeForm, promoCode: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. GLIMMER10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Discount Offer Pill Text</label>
                    <input
                      type="text"
                      value={storeForm.promoDiscountText}
                      onChange={(e) => setStoreForm({ ...storeForm, promoDiscountText: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                      placeholder="e.g. Use Code GLIMMER10 for 10% Off"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-4 bg-ivory-100 rounded-2xl border border-blush-200 space-y-4">
                <h3 className="font-serif font-bold text-sm text-burgundy-500 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gold-600" />
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={storeForm.facebookUrl}
                      onChange={(e) => setStoreForm({ ...storeForm, facebookUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={storeForm.instagramUrl}
                      onChange={(e) => setStoreForm({ ...storeForm, instagramUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">YouTube URL</label>
                    <input
                      type="text"
                      value={storeForm.youtubeUrl}
                      onChange={(e) => setStoreForm({ ...storeForm, youtubeUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-luxury hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-luxury flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save All Store & Delivery Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 6: ZENNIA MUSE SECTION MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === 'zennia' && (
          <div className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-blush-200">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="font-serif text-xl font-bold text-burgundy-500">
                The Zennia Royal Muse Customization
              </h2>
            </div>

            <form onSubmit={handleSaveZennia} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Section Title</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaTitle}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaSubtitle}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Romantic Quote</label>
                <input
                  type="text"
                  value={zenniaForm.zenniaQuote}
                  onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaQuote: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Dedicated By Attribution</label>
                <input
                  type="text"
                  value={zenniaForm.zenniaDedicatedBy}
                  onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaDedicatedBy: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Description</label>
                <textarea
                  rows={3}
                  value={zenniaForm.zenniaDescription}
                  onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Zennia Portrait Image Path / URL</label>
                <input
                  type="text"
                  value={zenniaForm.zenniaImageUrl}
                  onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaImageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                />
              </div>

              {/* 3 Pillars */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blush-50 rounded-xl border border-blush-200">
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 1 Title</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar1Title}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar1Title: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300 mb-2"
                  />
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 1 Desc</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar1Desc}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar1Desc: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300"
                  />
                </div>

                <div className="p-3 bg-blush-50 rounded-xl border border-blush-200">
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 2 Title</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar2Title}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar2Title: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300 mb-2"
                  />
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 2 Desc</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar2Desc}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar2Desc: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300"
                  />
                </div>

                <div className="p-3 bg-blush-50 rounded-xl border border-blush-200">
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 3 Title</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar3Title}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar3Title: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300 mb-2"
                  />
                  <label className="block text-[10px] font-bold text-charcoal mb-1">Pillar 3 Desc</label>
                  <input
                    type="text"
                    value={zenniaForm.zenniaPillar3Desc}
                    onChange={(e) => setZenniaForm({ ...zenniaForm, zenniaPillar3Desc: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-blush-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-luxury hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-luxury flex items-center justify-center gap-2 mt-4"
              >
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save Zennia Tribute Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 7: SUPER ADMIN ACCESS INFO */}
        {/* ================================================= */}
        {activeTab === 'superadmin' && (
          <div className="max-w-2xl bg-white rounded-3xl p-8 border border-gold-400/60 shadow-luxury space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-luxury text-white flex items-center justify-center shadow-md">
                <Crown className="w-7 h-7 text-gold-400" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-burgundy-500">
                  Super Administrator Account
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Full unrestricted ownership and management permissions
                </p>
              </div>
            </div>

            <div className="p-4 bg-blush-50 rounded-2xl border border-blush-200 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-blush-200/80">
                <span className="text-charcoal-muted">Designated Super Admin:</span>
                <strong className="text-burgundy-600">Yeasin Arafat</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-blush-200/80">
                <span className="text-charcoal-muted">Login Email:</span>
                <strong className="text-charcoal font-mono">yeasin201614@gamil.com</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-blush-200/80">
                <span className="text-charcoal-muted">Password:</span>
                <strong className="text-charcoal font-mono">yeasin123</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-muted">Role Authority:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  ALL PERMISSIONS GRANTED
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-charcoal/80 leading-relaxed">
              <h4 className="font-bold text-burgundy-500 font-serif">Capabilities Granted:</h4>
              <ul className="list-disc list-inside space-y-1 text-charcoal-muted">
                <li>Create, update, restock and remove products across all cosmetics & jewellery lines</li>
                <li>Track and advance customer order lifecycle (Pending ➔ Processing ➔ Shipped ➔ Delivered)</li>
                <li>Print official branded customer invoices with Bangladeshi Taka totals and delivery notes</li>
                <li>Update Hero banner headlines, offer tags and high-res imagery instantly</li>
                <li>Update customer support phone numbers, WhatsApp lines and showroom addresses</li>
                <li>Adjust division delivery charges (Inside Dhaka, Outside Dhaka, Free threshold)</li>
                <li>Personalize the Zennia Royal Muse tribute section & quotes</li>
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ================================================= */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-blush-200">
            <div className="flex items-center justify-between pb-4 border-b border-blush-200 mb-6">
              <h3 className="font-serif text-xl font-bold text-burgundy-500">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-blush-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'cosmetics'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500 bg-white"
                  >
                    <option value="cosmetics">Cosmetics</option>
                    <option value="jewellery">Jewellery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Subcategory</label>
                  <select
                    value={editingProduct.subcategory || 'skincare'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value as ProductSubcategory })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500 bg-white"
                  >
                    <option value="skincare">Skincare</option>
                    <option value="makeup">Makeup</option>
                    <option value="lipstick">Lipstick</option>
                    <option value="serum">Serum</option>
                    <option value="face-wash">Face Wash</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bangles">Bangles</option>
                    <option value="fashion-jewellery">Fashion Jewellery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Selling Price (BDT ৳) *</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Original Price (Discount ৳)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Inventory Stock *</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="e.g. GG-JEW-042"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.thumbnail || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="https://... or /images/..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Ingredients or Materials</label>
                  <input
                    type="text"
                    value={editingProduct.materials || editingProduct.ingredients || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value, ingredients: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                    placeholder="22K Micro Gold Plated, Emeralds..."
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">How To Use / Care Instructions</label>
                  <input
                    type="text"
                    value={editingProduct.howToUse || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, howToUse: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-blush-300 focus:outline-none focus:border-burgundy-500"
                  />
                </div>
              </div>

              {/* Badges toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="rounded text-burgundy-500"
                  />
                  <span>Product Active / Visible</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-burgundy-500"
                  />
                  <span>Best Seller Badge</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSpecialOffer ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isSpecialOffer: e.target.checked })}
                    className="rounded text-burgundy-500"
                  />
                  <span>Special Offer Badge</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-blush-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-blush-300 hover:bg-blush-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-6 py-2.5 bg-gradient-luxury hover:opacity-95 text-white font-bold rounded-xl shadow-luxury flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-gold-400" />
                  <span>{modalSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INVOICE / ORDER DETAILS MODAL */}
      {/* ================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-blush-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-blush-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-burgundy-500" />
                <h3 className="font-serif text-xl font-bold text-burgundy-500">
                  Official Invoice: {selectedOrderDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-blush-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-ivory-100 rounded-2xl border border-blush-200">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Customer Details</span>
                  <p className="font-bold text-charcoal mt-0.5">{selectedOrderDetails.customerDetails?.fullName}</p>
                  <p className="text-burgundy-600 font-mono mt-0.5">{selectedOrderDetails.customerDetails?.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Delivery Destination</span>
                  <p className="font-semibold text-charcoal mt-0.5">
                    {selectedOrderDetails.customerDetails?.houseRoadArea}
                  </p>
                  <p className="text-charcoal-muted mt-0.5">
                    {selectedOrderDetails.customerDetails?.city}, {selectedOrderDetails.customerDetails?.division}
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-blush-200 rounded-2xl overflow-hidden">
                <div className="p-3 bg-blush-50 font-bold text-burgundy-600 flex justify-between text-[11px]">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-blush-100 p-3 space-y-2">
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-semibold text-charcoal">{item.name}</p>
                        <p className="text-[10px] text-charcoal-muted">Qty: {item.quantity} × {formatBDT(item.price)}</p>
                      </div>
                      <span className="font-bold text-charcoal">{formatBDT(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-ivory-100 border-t border-blush-200 space-y-1.5">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Subtotal:</span>
                    <span>{formatBDT(selectedOrderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Delivery Charge ({selectedOrderDetails.customerDetails?.division}):</span>
                    <span>{formatBDT(selectedOrderDetails.deliveryCharge)}</span>
                  </div>
                  {selectedOrderDetails.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount Voucher:</span>
                      <span>- {formatBDT(selectedOrderDetails.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-burgundy-500 pt-2 border-t border-blush-200">
                    <span>Grand Total (Cash on Delivery):</span>
                    <span>{formatBDT(selectedOrderDetails.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
