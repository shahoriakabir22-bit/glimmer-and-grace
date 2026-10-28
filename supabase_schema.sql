-- =============================================================================
-- GLIMMER & GRACE — SUPABASE POSTGRES SCHEMA, TABLES & SEED DATA
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  ingredients TEXT,
  materials TEXT,
  how_to_use TEXT,
  category TEXT NOT NULL CHECK (category IN ('cosmetics', 'jewellery')),
  subcategory TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  images TEXT[] NOT NULL DEFAULT '{}',
  thumbnail TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_special_offer BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address_details JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products.
DROP POLICY IF EXISTS "Public products read access" ON public.products;
CREATE POLICY "Public products read access" 
  ON public.products FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admin products full control" ON public.products;
CREATE POLICY "Admin products full control" 
  ON public.products FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Orders: Anyone can create an order. Customers view own. Admins manage all.
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
CREATE POLICY "Customers view own orders" 
  ON public.orders FOR SELECT 
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" 
  ON public.orders FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Profiles: Users view own profile
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'customer',
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SEED SAMPLE COSMETICS & JEWELLERY PRODUCTS
-- =============================================================================

INSERT INTO public.products (
  id, name, slug, tagline, description, ingredients, materials, how_to_use,
  category, subcategory, price, original_price, images, thumbnail, sku, stock,
  is_active, is_bestseller, is_new_arrival, is_special_offer, rating, review_count, tags
) VALUES
(
  'prod-001',
  'Hydrating Rose Face Cream',
  'hydrating-rose-face-cream',
  'Deep Moisture & Radiant Glow with Damask Rose Essence',
  'An ultra-nourishing, lightweight daily face cream enriched with Bulgarian Damask Rose extract, Hyaluronic Acid, and Shea Butter.',
  'Aqua, Rosa Damascena Flower Water, Hyaluronic Acid, Butyrospermum Parkii Butter, Niacinamide, Squalane.',
  NULL,
  'Gently massage a pea-sized amount onto freshly cleansed face and neck morning and evening.',
  'cosmetics',
  'skincare',
  1250,
  1550,
  ARRAY['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'GG-SKIN-001',
  24,
  TRUE, TRUE, FALSE, TRUE, 4.9, 128, ARRAY['skincare', 'face cream', 'hydrating', 'bestseller']
),
(
  'prod-002',
  'Velvet Matte Lipstick — Royal Crimson',
  'velvet-matte-lipstick-royal-crimson',
  '12-Hour Long-Wear Silky Matte Finish',
  'An iconic, velvety smooth lipstick formulated with antioxidant-rich jojoba oil and vitamin E.',
  'Dimethicone, Jojoba Seed Oil, Tocopherol (Vitamin E), Iron Oxides.',
  NULL,
  'Define lips with the angled bullet tip, then fill in starting from the center outward.',
  'cosmetics',
  'lipstick',
  950,
  1200,
  ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  'GG-LIP-002',
  45,
  TRUE, TRUE, FALSE, FALSE, 4.8, 94, ARRAY['lipstick', 'matte', 'makeup']
),
(
  'prod-003',
  '22K Gold-Plated Filigree Hoop Earrings',
  '22k-gold-plated-filigree-hoop-earrings',
  'Artisanal Handcrafted Heritage Elegance',
  'Exquisite circular filigree hoops featuring intricate floral motifs. Finished with 22K micro-gold plating.',
  NULL,
  'High-grade Brass alloy base, 22-Karat Gold electroplating, hypoallergenic surgical steel posts.',
  NULL,
  'jewellery',
  'earrings',
  1600,
  2000,
  ARRAY['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
  'GG-JEW-003',
  18,
  TRUE, TRUE, FALSE, TRUE, 4.9, 76, ARRAY['jewellery', 'earrings', 'gold', 'filigree']
),
(
  'prod-004',
  'Radiance Vitamin C + Niacinamide Serum',
  'radiance-vitamin-c-niacinamide-serum',
  'Brightens Dark Spots & Evens Skin Tone in 14 Days',
  'Potent 15% Ethyl Ascorbic Acid combined with 5% Niacinamide and Ferulic Acid.',
  'Aqua, Ethyl Ascorbic Acid, Niacinamide, Glycerin, Ferulic Acid, Sodium Hyaluronate.',
  NULL,
  'Apply 3-4 drops directly to face after toner. Use sunscreen during the day.',
  'cosmetics',
  'serum',
  1650,
  1950,
  ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'GG-SKIN-004',
  32,
  TRUE, TRUE, FALSE, FALSE, 4.8, 88, ARRAY['serum', 'vitamin c', 'brightening']
),
(
  'prod-005',
  'Imperial Emerald Kundan Choker Necklace Set',
  'imperial-emerald-kundan-choker-necklace-set',
  'Statement Bridal Masterpiece with Matching Jhumkas',
  'A regal bridal necklace set adorned with precision-cut emerald green crystals, jadau kundan stones, and pearls.',
  NULL,
  'Micro-plated brass, Polki Kundan stones, Emerald green simulated gemstones, Cultured pearl drops.',
  NULL,
  'jewellery',
  'necklaces',
  2500,
  3200,
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'GG-JEW-005',
  12,
  TRUE, TRUE, FALSE, TRUE, 5.0, 42, ARRAY['jewellery', 'necklace', 'bridal', 'kundan']
),
(
  'prod-006',
  'Sparkling Solitaire Diamond Ring',
  'sparkling-solitaire-diamond-ring',
  'Timeless Romance in Champagne Gold Prong Setting',
  'A magnificent brilliant-cut AAA Austrian Cubic Zirconia stone crowned on a polished champagne-gold band.',
  NULL,
  '925 Sterling Silver core, 18K Champagne Gold vermeil, AAA Flawless Zirconia.',
  NULL,
  'jewellery',
  'rings',
  2200,
  2800,
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  'GG-JEW-006',
  15,
  TRUE, FALSE, TRUE, FALSE, 4.9, 31, ARRAY['jewellery', 'ring', 'solitaire', 'gold']
)
ON CONFLICT (id) DO NOTHING;
