import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { UserProfile } from '../types/user';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { calculateTrustedOrderTotals } from './priceCalculator';

const LOCAL_STORAGE_PRODUCTS_KEY = 'gg_products_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'gg_orders_v1';
const LOCAL_STORAGE_USERS_KEY = 'gg_users_v1';

// Initialize local fallback storage
function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS));
      return SAMPLE_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_PRODUCTS;
  }
}

function setLocalProducts(products: Product[]): void {
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalOrders(orders: Order[]): void {
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

function getLocalUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalUsers(users: Record<string, UserProfile>): void {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
}

// ==========================================
// PRODUCTS SERVICES
// ==========================================

export async function fetchProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          tagline: row.tagline || '',
          description: row.description || '',
          ingredients: row.ingredients || '',
          materials: row.materials || '',
          howToUse: row.how_to_use || '',
          category: row.category,
          subcategory: row.subcategory,
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          images: row.images || [],
          thumbnail: row.thumbnail,
          sku: row.sku,
          stock: row.stock,
          isActive: row.is_active,
          isBestSeller: row.is_bestseller,
          isNewArrival: row.is_new_arrival,
          isSpecialOffer: row.is_special_offer,
          rating: Number(row.rating || 5),
          reviewCount: row.review_count || 0,
          tags: row.tags || [],
          createdAt: row.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back:', err);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'products');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      }
      // If Firestore is empty, seed it with sample products
      await seedProductsToFirestore();
      return getLocalProducts();
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to local catalog:', err);
      return getLocalProducts();
    }
  }
  return getLocalProducts();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'products', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Product;
      }
    } catch (err) {
      console.warn('Firestore fetch product by ID failed:', err);
    }
  }
  const products = getLocalProducts();
  return products.find(p => p.id === id) || null;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'products');
      const q = query(colRef, where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
      }
    } catch (err) {
      console.warn('Firestore fetch product by slug failed:', err);
    }
  }
  const products = getLocalProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; category: Product['category']; price: number }): Promise<Product> {
  const isNew = !product.id;
  const id = product.id || `prod-${Date.now()}`;
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const completeProduct: Product = {
    id,
    name: product.name,
    slug,
    tagline: product.tagline || '',
    description: product.description || '',
    ingredients: product.ingredients || '',
    materials: product.materials || '',
    howToUse: product.howToUse || '',
    category: product.category,
    subcategory: product.subcategory || (product.category === 'cosmetics' ? 'skincare' : 'earrings'),
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    thumbnail: product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    sku: product.sku || `GG-${product.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    stock: Number(product.stock ?? 10),
    isActive: product.isActive ?? true,
    isBestSeller: product.isBestSeller ?? false,
    isNewArrival: product.isNewArrival ?? true,
    isSpecialOffer: product.isSpecialOffer ?? false,
    rating: product.rating ?? 5.0,
    reviewCount: product.reviewCount ?? 1,
    tags: product.tags ?? [product.category],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'products', id);
      await setDoc(docRef, { ...completeProduct, serverUpdated: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.warn('Firestore save product failed:', err);
    }
  }

  // Update local storage
  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products[index] = completeProduct;
  } else {
    products.unshift(completeProduct);
  }
  setLocalProducts(products);

  return completeProduct;
}

export async function removeProduct(productId: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product failed:', err);
    }
  }

  const products = getLocalProducts().filter(p => p.id !== productId);
  setLocalProducts(products);
  return true;
}

export async function seedProductsToFirestore(): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      for (const p of SAMPLE_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p, { merge: true });
      }
      console.log('Sample products seeded successfully to Firestore.');
    } catch (err) {
      console.error('Failed to seed products to Firestore:', err);
    }
  }
  setLocalProducts(SAMPLE_PRODUCTS);
}

// ==========================================
// ORDERS SERVICES (TRUSTED PRICING & INVENTORY)
// ==========================================

export interface CreateOrderParams {
  userId?: string;
  customerDetails: Order['customerDetails'];
  cartItems: { productId: string; quantity: number }[];
  couponCode?: string;
  notes?: string;
}

export async function placeTrustedOrder(params: CreateOrderParams): Promise<{ success: boolean; order?: Order; error?: string }> {
  const products = await fetchProducts();

  // Trusted price, discount, and delivery charge re-calculation
  const calculation = calculateTrustedOrderTotals(
    params.cartItems,
    products,
    params.customerDetails.division,
    params.couponCode
  );

  if (calculation.errors && calculation.errors.length > 0) {
    return { success: false, error: calculation.errors.join(' ') };
  }

  if (calculation.validatedItems.length === 0) {
    return { success: false, error: 'Your cart is empty or products are invalid.' };
  }

  const orderId = `GG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const timestamp = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    orderNumber: orderId,
    userId: params.userId,
    customerDetails: params.customerDetails,
    items: calculation.validatedItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
      sku: item.sku,
      category: 'Store'
    })),
    subtotal: calculation.subtotal,
    deliveryCharge: calculation.deliveryCharge,
    discount: calculation.discount,
    total: calculation.total,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    notes: params.notes || '',
    timeline: [
      {
        status: 'pending',
        timestamp,
        description: 'Order placed successfully via Cash on Delivery.'
      }
    ],
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // Decrement stock in catalog to avoid overselling
  const updatedCatalog = products.map(p => {
    const ordered = params.cartItems.find(item => item.productId === p.id);
    if (ordered) {
      const newStock = Math.max(0, p.stock - ordered.quantity);
      return { ...p, stock: newStock };
    }
    return p;
  });
  setLocalProducts(updatedCatalog);

  // If Supabase is active, persist order
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({
        id: orderId,
        user_id: params.userId || null,
        customer_name: params.customerDetails.fullName,
        customer_phone: params.customerDetails.phone,
        customer_email: params.customerDetails.email || null,
        address_details: params.customerDetails,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        delivery_charge: newOrder.deliveryCharge,
        discount: newOrder.discount,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        order_status: newOrder.orderStatus,
        notes: newOrder.notes || '',
        timeline: newOrder.timeline,
        created_at: timestamp
      });
    } catch (err) {
      console.warn('Supabase order insert warning:', err);
    }
  }

  // If Firebase is active, persist order and update stock
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', orderId), {
        ...newOrder,
        serverCreated: serverTimestamp()
      });

      // Update Firestore stock
      for (const item of params.cartItems) {
        const p = updatedCatalog.find(x => x.id === item.productId);
        if (p) {
          await updateDoc(doc(db, 'products', p.id), { stock: p.stock });
        }
      }
    } catch (err) {
      console.warn('Firestore order placement warning, saved locally:', err);
    }
  }

  // Update local storage orders
  const orders = getLocalOrders();
  orders.unshift(newOrder);
  setLocalOrders(orders);

  return { success: true, order: newOrder };
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(o => ({
          id: o.id,
          orderNumber: o.id,
          userId: o.user_id,
          customerDetails: o.address_details,
          items: o.items,
          subtotal: Number(o.subtotal),
          deliveryCharge: Number(o.delivery_charge),
          discount: Number(o.discount || 0),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.order_status,
          notes: o.notes || '',
          timeline: o.timeline || [],
          createdAt: o.created_at,
          updatedAt: o.updated_at || o.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch orders failed:', err);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'orders');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    } catch (err) {
      console.warn('Firestore fetch orders failed, falling back:', err);
    }
  }
  return getLocalOrders();
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'orders');
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    } catch (err) {
      console.warn('Firestore fetch user orders failed:', err);
    }
  }
  return getLocalOrders().filter(o => o.userId === userId);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const description = note || `Order status updated to ${status}.`;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({
        order_status: status,
        updated_at: timestamp
      }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase update order status error:', err);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        const orderData = snap.data() as Order;
        const timeline = orderData.timeline || [];
        timeline.push({ status, timestamp, description });
        await updateDoc(orderRef, { orderStatus: status, updatedAt: timestamp, timeline });
      }
    } catch (err) {
      console.warn('Firestore order status update failed:', err);
    }
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    const o = orders[idx];
    const timeline = o.timeline || [];
    timeline.push({ status, timestamp, description });
    orders[idx] = { ...o, orderStatus: status, updatedAt: timestamp, timeline };
    setLocalOrders(orders);
    return true;
  }
  return false;
}

// ==========================================
// USER & ADMIN BOOTSTRAP SERVICES
// ==========================================

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Firestore get user profile failed:', err);
    }
  }
  const users = getLocalUsers();
  return users[uid] || null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    } catch (err) {
      console.warn('Firestore save user profile failed:', err);
    }
  }
  const users = getLocalUsers();
  users[profile.uid] = profile;
  setLocalUsers(users);
}

/**
 * First-Admin Setup:
 * Securely assigns admin role.
 * If no admin currently exists or if the user matches the configured initial admin email,
 * grant admin access. Prevents general customers from self-granting admin privileges.
 */
export async function bootstrapAdmin(uid: string, secretKey?: string): Promise<{ success: boolean; message: string }> {
  // Check if an admin already exists in the system
  let hasExistingAdmin = false;

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users'), where('isAdmin', '==', true));
      const snap = await getDocs(q);
      hasExistingAdmin = !snap.empty;
    } catch (e) {
      // ignore
    }
  } else {
    const users = getLocalUsers();
    hasExistingAdmin = Object.values(users).some(u => u.isAdmin);
  }

  // Security guard: require setup secret if an admin already exists
  const EXPECTED_SECRET = 'glimmer-admin-2026';
  if (hasExistingAdmin && secretKey !== EXPECTED_SECRET) {
    return {
      success: false,
      message: 'An administrator account already exists. To grant additional admin access, provide the admin secret key.'
    };
  }

  const existingProfile = await getUserProfile(uid);
  if (!existingProfile) {
    return { success: false, message: 'User profile not found. Please log in first.' };
  }

  const updatedProfile: UserProfile = {
    ...existingProfile,
    role: 'admin',
    isAdmin: true,
    updatedAt: new Date().toISOString()
  };

  await saveUserProfile(updatedProfile);
  return { success: true, message: 'Administrator privileges granted successfully!' };
}
