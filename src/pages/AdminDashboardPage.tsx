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
  Users, 
  TrendingUp, 
  RefreshCw,
  FolderTree,
  Filter,
  Eye,
  Check,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Product, ProductCategory, ProductSubcategory } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { formatBDT } from '../lib/bdValidation';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  saveProduct, 
  removeProduct, 
  seedProductsToFirestore 
} from '../lib/firestoreService';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, userProfile, isAdmin, grantAdminRole } = useAuth();
  const { products, refreshProducts } = useProducts();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'inventory' | 'categories'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Admin access gate states
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [gateFeedback, setGateFeedback] = useState<{ text: string; isError: boolean } | null>(null);

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
    if (isAdmin) {
      loadAllOrders();
    }
  }, [isAdmin]);

  // Genuine database analytics calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  // Handle bootstrap admin role
  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await grantAdminRole(secretKeyInput);
    setGateFeedback({ text: res.message, isError: !res.success });
  };

  // Handle Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.category || !editingProduct.price) {
      return;
    }
    setModalSaving(true);
    try {
      await saveProduct(editingProduct as Product);
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

  // If not admin, render secure gate
  if (!isAdmin) {
    return (
      <div className="bg-ivory-200 min-h-screen py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blush-200 shadow-luxury text-center">
          <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-4 ring-8 ring-gold-50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-burgundy-500 mb-2">
            Administrator Portal
          </h1>
          <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
            Restricted access. Only verified store managers and administrators can access product CRUD, inventory controls, and order fulfillment.
          </p>

          {currentUser || userProfile ? (
            <form onSubmit={handleClaimAdmin} className="space-y-4">
              <div className="p-3 bg-blush-50 rounded-2xl border border-blush-200 text-xs text-charcoal">
                Logged in as <strong>{userProfile?.displayName || currentUser?.email}</strong>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter Admin Secret Key"
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {gateFeedback && (
                <p className={`text-xs ${gateFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {gateFeedback.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Authenticate as Administrator
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full py-3 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Sign In With Admin Account
              </Link>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-blush-100 text-[11px] text-charcoal-muted">
            Tip: You can log in with any test account like <code>admin@glimmergrace.com</code>, or enter the default secret key <code>glimmer-admin-2026</code>.
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerDetails.fullName.toLowerCase().includes(q);
      const matchPhone = o.customerDetails.phone.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (prodCategoryFilter !== 'all' && p.category !== prodCategoryFilter) return false;
    if (prodSearchQuery) {
      const q = prodSearchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="bg-ivory-200 min-h-screen pb-20">
      
      {/* Admin Top Navbar */}
      <div className="bg-gradient-luxury text-white py-6 border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="w-11 h-11 rounded-full ring-2 ring-gold-400" />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                GLIMMER & Grace — Management Dashboard
              </h1>
              <p className="text-[10px] text-gold-300 uppercase tracking-widest">
                Authenticated Admin: {userProfile?.displayName} ({userProfile?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                refreshProducts();
                loadAllOrders();
              }}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-charcoal font-bold rounded-xl text-xs transition-colors"
            >
              Live Storefront
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-2 rounded-2xl border border-blush-200 shadow-xs mb-8 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-burgundy-500 text-white shadow-xs' : 'text-charcoal hover:bg-blush-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-burgundy-500 text-white shadow-xs' : 'text-charcoal hover:bg-blush-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-burgundy-500 text-white shadow-xs' : 'text-charcoal hover:bg-blush-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory' ? 'bg-burgundy-500 text-white shadow-xs' : 'text-charcoal hover:bg-blush-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Alerts ({lowStockCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories' ? 'bg-burgundy-500 text-white shadow-xs' : 'text-charcoal hover:bg-blush-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* OVERVIEW TAB */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 4 Genuine Database Metric Cards (Matching Screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    Total Products
                  </p>
                  <h3 className="font-serif text-3xl font-bold text-burgundy-500 mt-1">
                    {products.length}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-medium">All active collections</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blush-100 text-burgundy-500 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    Total Orders
                  </p>
                  <h3 className="font-serif text-3xl font-bold text-burgundy-500 mt-1">
                    {totalOrdersCount}
                  </h3>
                  <span className="text-[11px] text-amber-600 font-medium">
                    {pendingOrdersCount} pending delivery
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    Low Stock Units
                  </p>
                  <h3 className="font-serif text-3xl font-bold text-rose-600 mt-1">
                    {lowStockCount}
                  </h3>
                  <span className="text-[11px] text-rose-500 font-medium">≤ 5 units remaining</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-blush-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
                    {formatBDT(totalRevenue)}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-medium">Trusted backend tally</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders Overview (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-blush-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-blush-200">
                  <h3 className="font-serif text-lg font-bold text-burgundy-500">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-burgundy-500 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-charcoal-muted py-8 text-center">
                    No orders recorded in database yet.
                  </p>
                ) : (
                  <div className="divide-y divide-blush-100">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-bold text-charcoal">#{o.id} — {o.customerDetails.fullName}</p>
                          <p className="text-charcoal-muted text-[11px]">
                            {new Date(o.createdAt).toLocaleDateString()} • {o.customerDetails.division} • {o.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-burgundy-500">{formatBDT(o.total)}</p>
                          <span className="text-[10px] font-bold uppercase text-amber-600">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Catalog Actions (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-blush-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-burgundy-500 pb-4 border-b border-blush-200">
                  Quick Catalog Tasks
                </h3>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      category: 'cosmetics',
                      subcategory: 'skincare',
                      price: 1000,
                      stock: 20,
                      isActive: true,
                      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80']
                    });
                    setProductModalOpen(true);
                  }}
                  className="w-full py-3 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Reset catalog to sample cosmetics & jewellery items?')) {
                      await seedProductsToFirestore();
                      await refreshProducts();
                      alert('Catalog reset successfully!');
                    }
                  }}
                  className="w-full py-3 bg-blush-100 hover:bg-blush-200 text-burgundy-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-seed Sample Products</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* ORDERS MANAGEMENT TAB */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-blush-200">
              <h2 className="font-serif text-xl font-bold text-burgundy-500">
                Order Management ({filteredOrders.length})
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-blush-50 border border-blush-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                  <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-blush-50 border border-blush-300 text-xs font-medium cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blush-200 text-charcoal-muted uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Division</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blush-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-burgundy-500">#{order.id}</td>
                      <td className="py-3 text-charcoal-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-semibold text-charcoal">
                        {order.customerDetails.fullName}
                      </td>
                      <td className="py-3 text-charcoal">{order.customerDetails.phone}</td>
                      <td className="py-3 text-charcoal">{order.customerDetails.division}</td>
                      <td className="py-3 font-bold text-burgundy-500">{formatBDT(order.total)}</td>
                      <td className="py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 bg-blush-100 rounded-lg text-xs font-semibold text-charcoal border border-blush-300 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-3 py-1 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PRODUCTS MANAGEMENT TAB */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-blush-200">
              <h2 className="font-serif text-xl font-bold text-burgundy-500">
                Products Catalog ({filteredProducts.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <input
                    type="text"
                    placeholder="Search product or SKU..."
                    value={prodSearchQuery}
                    onChange={(e) => setProdSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-blush-50 border border-blush-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                  <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-blush-50 border border-blush-300 text-xs font-medium cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="jewellery">Jewellery</option>
                </select>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      category: 'cosmetics',
                      subcategory: 'skincare',
                      price: 1200,
                      stock: 25,
                      isActive: true,
                      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80']
                    });
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blush-200 text-charcoal-muted uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-blush-50/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-blush-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-charcoal">{p.name}</p>
                            <p className="text-[10px] text-charcoal-muted">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 capitalize text-rose-dark font-medium">
                        {p.category} • {p.subcategory}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-charcoal">{p.sku}</td>
                      <td className="py-3 font-bold text-burgundy-500">{formatBDT(p.price)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3">
                        {p.isActive ? (
                          <span className="text-emerald-700 font-semibold">Active</span>
                        ) : (
                          <span className="text-rose-600 font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-blush-100 text-charcoal hover:text-burgundy-500 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-rose-50 text-charcoal hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete"
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

        {/* ======================================================== */}
        {/* LOW STOCK INVENTORY TAB */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-blush-200">
              <h2 className="font-serif text-xl font-bold text-burgundy-500">
                Low Inventory Warning ({lowStockCount})
              </h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Products with 5 or fewer units remaining in warehouse. Click Restock to add units.
              </p>
            </div>

            <div className="space-y-4">
              {products.filter(p => p.stock <= 10).map(p => (
                <div 
                  key={p.id}
                  className="p-4 rounded-2xl border border-blush-200 bg-blush-50/50 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-serif font-bold text-sm text-charcoal">{p.name}</p>
                      <p className="text-xs text-charcoal-muted">SKU: {p.sku} • {formatBDT(p.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-rose-600 text-xs">
                      {p.stock} units left
                    </span>
                    <button
                      onClick={() => handleQuickRestock(p, 10)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Restock +10</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORIES TAB */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blush-200 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-burgundy-500">Cosmetics Category</h3>
              <p className="text-xs text-charcoal-muted">
                Subcategories: Skincare, Makeup, Lipstick, Serum, Face Wash, Moisturizer.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {['Skincare', 'Makeup', 'Lipstick', 'Serum', 'Face Wash'].map(s => (
                  <span key={s} className="px-3 py-1 bg-blush-100 rounded-full font-medium text-burgundy-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blush-200 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-burgundy-500">Jewellery Category</h3>
              <p className="text-xs text-charcoal-muted">
                Subcategories: Earrings, Necklaces, Rings, Bracelets, Bangles, Fashion Jewellery.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Bangles'].map(s => (
                  <span key={s} className="px-3 py-1 bg-gold-100 rounded-full font-medium text-gold-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-blush-200 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 p-2 text-charcoal-muted hover:text-charcoal rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-burgundy-500 mb-6">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'cosmetics'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                  >
                    <option value="cosmetics">Cosmetics</option>
                    <option value="jewellery">Jewellery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={editingProduct.subcategory || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value as ProductSubcategory })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Original Price (BDT)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Primary Image URL</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    thumbnail: e.target.value,
                    images: [e.target.value]
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-blush-50 border border-blush-300"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="rounded text-burgundy-500"
                  />
                  <span>Active Product</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-burgundy-500"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-blush-200">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-blush-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-6 py-2 bg-burgundy-500 text-white rounded-xl font-bold uppercase"
                >
                  {modalSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal for Admin */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-2 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-lg font-bold text-burgundy-500 mb-4">
              Order #{selectedOrderDetails.id} Details
            </h3>
            <p><strong>Customer:</strong> {selectedOrderDetails.customerDetails.fullName}</p>
            <p><strong>Phone:</strong> {selectedOrderDetails.customerDetails.phone}</p>
            <p><strong>Address:</strong> {selectedOrderDetails.customerDetails.houseRoadArea}, {selectedOrderDetails.customerDetails.city}, {selectedOrderDetails.customerDetails.division}</p>
            {selectedOrderDetails.notes && <p><strong>Notes:</strong> {selectedOrderDetails.notes}</p>}

            <div className="divide-y divide-blush-100 my-4">
              {selectedOrderDetails.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span>{it.name} (x{it.quantity})</span>
                  <span>{formatBDT(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-blush-200 pt-2 font-bold flex justify-between text-sm text-burgundy-500">
              <span>Total</span>
              <span>{formatBDT(selectedOrderDetails.total)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
