import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Clock, 
  CheckCircle, 
  Printer, 
  ShieldCheck, 
  X, 
  ChevronRight,
  Shield,
  Key,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/order';
import { formatBDT } from '../lib/bdValidation';
import { fetchUserOrders, fetchAllOrders, saveUserProfile } from '../lib/firestoreService';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, userProfile, isAdmin, logout, grantAdminRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>(
    (searchParams.get('tab') as 'orders' | 'profile' | 'addresses') || 'orders'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile form
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Admin secret key dialog
  const [adminKey, setAdminKey] = useState('');
  const [adminFeedback, setAdminFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (!currentUser && !userProfile) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      setLoadingOrders(true);
      try {
        const uid = currentUser?.uid || userProfile?.uid;
        if (uid) {
          // If admin, can view all orders or user's own orders
          const userOrders = await fetchUserOrders(uid);
          // If no specific user orders, also load all orders in demo mode
          if (userOrders.length === 0 && isAdmin) {
            const all = await fetchAllOrders();
            setOrders(all);
          } else {
            setOrders(userOrders);
          }
        }
      } catch (e) {
        console.warn('Failed to load user orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [currentUser, userProfile, isAdmin, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    await saveUserProfile({
      ...userProfile,
      displayName: displayName.trim(),
      phoneNumber: phone.trim(),
      updatedAt: new Date().toISOString()
    });

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleGrantAdmin = async () => {
    const res = await grantAdminRole(adminKey);
    setAdminFeedback({ text: res.message, isError: !res.success });
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Shipped</span>;
      case 'processing':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Processing</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Confirmed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-blush-200 text-burgundy-700 rounded-full text-xs font-semibold">Pending</span>;
    }
  };

  return (
    <div className="bg-ivory-200 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 pb-4 border-b border-blush-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
              My Account
            </h1>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-gradient-gold hover:opacity-95 text-charcoal font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Admin Dashboard</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Menu (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
              
              {/* User Bio */}
              <div className="flex items-center gap-4 pb-6 border-b border-blush-200">
                <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center text-burgundy-500 text-xl font-serif font-bold ring-2 ring-gold-400">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-base text-charcoal truncate">
                    {userProfile?.displayName || 'Glimmer Customer'}
                  </h3>
                  <p className="text-xs text-charcoal-muted truncate">{userProfile?.email || currentUser?.email}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isAdmin ? 'bg-gold-100 text-gold-700' : 'bg-blush-100 text-burgundy-600'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Valued Customer'}
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-1.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    activeTab === 'orders'
                      ? 'bg-burgundy-500 text-white shadow-xs'
                      : 'text-charcoal hover:bg-blush-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    activeTab === 'profile'
                      ? 'bg-burgundy-500 text-white shadow-xs'
                      : 'text-charcoal hover:bg-blush-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Profile Details</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-burgundy-500 text-white shadow-xs'
                      : 'text-charcoal hover:bg-blush-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Delivery Addresses</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-colors pt-4 border-t border-blush-100 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          </div>

          {/* Main Tab Panel (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-blush-200">
                  <h2 className="font-serif text-xl font-bold text-burgundy-500">
                    Order History ({orders.length})
                  </h2>
                  <span className="text-xs text-charcoal-muted">All purchases secured with Cash on Delivery</span>
                </div>

                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="h-28 bg-blush-50 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="w-12 h-12 text-blush-300 mx-auto mb-3" />
                    <h3 className="font-serif text-base font-bold text-charcoal">No Orders Placed Yet</h3>
                    <p className="text-xs text-charcoal-muted max-w-xs mx-auto mt-1 mb-6">
                      Discover your signature scent, rejuvenating serum, or gold filigree hoops.
                    </p>
                    <Link
                      to="/shop"
                      className="px-6 py-2.5 bg-burgundy-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl border border-blush-200 hover:border-gold-400 bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-burgundy-500">
                              #{order.id}
                            </span>
                            {getStatusBadge(order.orderStatus)}
                          </div>

                          <p className="text-xs text-charcoal-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-blush-100"
                                title={item.name}
                              />
                            ))}
                            {order.items.length > 3 && (
                              <span className="w-8 h-8 rounded-lg bg-blush-100 text-charcoal text-[11px] font-bold flex items-center justify-center">
                                +{order.items.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-blush-100">
                          <span className="font-serif text-lg font-bold text-burgundy-500">
                            {formatBDT(order.total)}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 bg-blush-100 hover:bg-blush-200 text-burgundy-700 text-xs font-semibold rounded-xl transition-colors"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-blush-200">
                  <h2 className="font-serif text-xl font-bold text-burgundy-500">
                    Profile Information
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Update your account contact details.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Profile information updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Email Address (Read Only)
                    </label>
                    <input
                      type="email"
                      value={userProfile?.email || currentUser?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl bg-blush-100 border border-blush-200 text-xs text-charcoal-muted cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="01712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </form>

                {/* Administrator Role Bootstrap section */}
                <div className="pt-8 border-t border-blush-200">
                  <div className="flex items-center gap-2 text-gold-700 font-bold text-sm mb-2">
                    <Shield className="w-4 h-4 text-gold-600" />
                    <span>Administrator Privileges</span>
                  </div>
                  <p className="text-xs text-charcoal-muted mb-4 max-w-lg">
                    {isAdmin ? (
                      <span className="text-emerald-700 font-semibold">
                        ✓ You currently hold verified Administrator access. You can manage products, categories, stock, and orders.
                      </span>
                    ) : (
                      'First-time setup: If you are the store owner, enter the admin bootstrap key to activate administrator rights on your account.'
                    )}
                  </p>

                  {!isAdmin && (
                    <div className="flex gap-2 max-w-sm">
                      <div className="relative flex-1">
                        <input
                          type="password"
                          placeholder="Admin Secret Key"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                        />
                        <Key className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        onClick={handleGrantAdmin}
                        className="px-4 py-2 bg-charcoal hover:bg-gold-600 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Claim Role
                      </button>
                    </div>
                  )}

                  {adminFeedback && (
                    <p className={`text-[11px] mt-2 ${adminFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {adminFeedback.text}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-blush-200">
                  <h2 className="font-serif text-xl font-bold text-burgundy-500">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Your default delivery locations for express checkout.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-blush-200 bg-blush-50/60 max-w-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-700 text-[10px] font-bold uppercase">
                      Primary Address
                    </span>
                    <MapPin className="w-4 h-4 text-burgundy-500" />
                  </div>
                  <p className="font-serif font-bold text-sm text-charcoal">
                    {userProfile?.displayName || 'Glimmer Customer'}
                  </p>
                  <p className="text-xs text-charcoal/80">
                    Level 4, Navana Tower, Gulshan-1, Dhaka 1212, Bangladesh
                  </p>
                  <p className="text-xs text-charcoal-muted">
                    Phone: {userProfile?.phoneNumber || '+880 1712 345678'}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Order Details & Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-blush-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-charcoal-muted hover:text-charcoal rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-blush-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-burgundy-500">
                  Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-charcoal-muted">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>{getStatusBadge(selectedOrder.orderStatus)}</div>
            </div>

            {/* Recipient info */}
            <div className="my-4 p-4 bg-blush-50 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-charcoal">{selectedOrder.customerDetails.fullName}</p>
              <p className="text-charcoal-muted">Phone: {selectedOrder.customerDetails.phone}</p>
              <p className="text-charcoal-muted">
                Address: {selectedOrder.customerDetails.houseRoadArea}, {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.division}
              </p>
            </div>

            {/* Items */}
            <div className="divide-y divide-blush-100 my-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-charcoal">{item.name}</p>
                      <p className="text-charcoal-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-burgundy-500">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-blush-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span>{formatBDT(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Delivery Charge</span>
                <span>{formatBDT(selectedOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-burgundy-500 pt-2 border-t border-blush-100">
                <span>Total Amount</span>
                <span>{formatBDT(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-burgundy-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
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
