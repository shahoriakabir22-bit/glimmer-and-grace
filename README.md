# GLIMMER & GRACE — BEAUTY & BEYOND

A complete, premium, responsive cosmetics and jewellery e-commerce platform tailored for Bangladesh, built with **React, Vite, TypeScript, Tailwind CSS, Firebase Authentication, and Cloud Firestore**.

![GLIMMER & GRACE Logo](public/images/logo.png)

---

## 🌸 Brand Design & Palette
- **Blush Pink (`#F8DDE2`)**: Soft romantic undertones
- **Rose (`#E9A1AD`) & Rose Dark (`#D47A8A`)**: Feminine accents & badges
- **Ivory (`#FFF9F4`)**: Luxurious warm canvas
- **Champagne Gold (`#C8A45D` / `#D4AF37`)**: Artisanal jewellery brilliance
- **Burgundy (`#632C3B`)**: Regal brand primary & serif typography
- **Charcoal (`#2B1E22`)**: High-contrast, readable body copy

---

## 🚀 Key Features

### 1. Storefront & Collections
- **Hero Showcase**: Luxury model portrait, authentic badge, and instant CTA buttons.
- **Value Proposition Bar**: 100% Authentic Guarantee, Free Delivery over ৳1,500, Safe & Secure, 7-Day Easy Returns.
- **Shop by Category**: Skincare, Makeup, Lipstick, and Handcrafted Jewellery.
- **Best Sellers & New Arrivals**: Instant Quick View modal, wishlist heart toggle, and add-to-cart.
- **Special Offers**: Flat 30% discount banners with coupon support (`GLIMMER10`, `BEAUTY30`, `WELCOME100`).
- **Verified Customer Testimonials**: Authentic customer feedback from Dhaka, Chittagong, and Sylhet.
- **Dedicated Category Hubs**: Full filtering by subcategory, price range slider (৳500 – ৳10,000), and sort orders (price, rating, newness).

### 2. Shopping Bag & Trusted Checkout
- **Persistent Cart**: Saved across sessions in `localStorage`.
- **Slide-over Bag Drawer**: Quick quantity adjustment, free delivery progress meter, and live total calculations.
- **Anti-Tampering Backend Pricing**: Never trusts client-submitted prices; recalculates every item against canonical catalog prices to prevent price manipulation.
- **Bangladesh Validation**: Enforces valid 11-digit Bangladeshi mobile numbers (`013 - 019`) via regex.
- **Division Delivery Rules**:
  - Inside Dhaka: ৳70 (FREE if order ≥ ৳1,500)
  - Outside Dhaka: ৳130 (FREE if order ≥ ৳1,500)
- **Cash on Delivery (COD)**: Seamless checkout with zero advance fees.
- **Printable Invoices**: Itemized order receipt with unique tracking ID (e.g. `#GG-1042-881`).

### 3. Customer Portal & Authentication
- **Tabbed Auth Card**: Sign In and Registration with password strength indicators.
- **Firebase Auth**: Supports Email/Password and Google Sign-In.
- **Customer Dashboard**: Profile details, address book, and complete order history with fulfillment statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### 4. Administrator Dashboard (`/admin`)
- **Restricted Access Gate**: Protects administrator controls; customers cannot self-grant admin roles.
- **First-Admin Bootstrap**: Safe bootstrap mechanism to initialize the store owner as administrator.
- **Genuine Analytics**: Live database metrics for Total Revenue (৳), Total Orders, Low Stock Items, and Products.
- **Product CRUD**: Add new products, update prices, edit descriptions, adjust stock, or delete items.
- **Low Inventory Warnings**: Alerts when items fall below 5 units with a one-click restock button.
- **Order Management**: Search by customer phone or Order ID, update courier fulfillment statuses in real time.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node v20 LTS)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Firebase Project configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
> **Note**: If `.env` is omitted or left as placeholder, the app automatically runs in **Local Storage / Demo Mode**, allowing you to test the full storefront, checkout, and admin dashboard without crashing!

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔐 First-Admin Setup Instructions

1. Register an account on the website or log in with Google.
2. Navigate to `/admin` or visit your **Account** page (`/account`).
3. Under **Administrator Privileges**, enter the default bootstrap secret key:
   ```
   glimmer-admin-2026
   ```
4. Click **Authenticate as Administrator** or **Claim Role**.
5. Your user document in Firestore / local session is now upgraded to `role: 'admin'`, granting permanent access to the `/admin` dashboard.
6. To modify or rotate the bootstrap secret key, update `EXPECTED_SECRET` in `src/lib/firestoreService.ts`.

---

## 🛡️ Cloud Firestore Security Rules

Deploy the included `firestore.rules` to Firebase:
```bash
firebase deploy --only firestore:rules
```

The rules guarantee:
- Public read access for active catalog products and categories.
- Admin-only write access for prices, products, and categories.
- Privilege Escalation Prevention: Normal users cannot set `isAdmin: true` on create or update.
- Order Confidentiality: Users can only read orders where `resource.data.userId == request.auth.uid`. Only admins can read all orders or update delivery status.

---

## 🚢 Deployment to GitHub & Vercel

### Deploy to GitHub
```bash
git init
git add .
git commit -m "Initial commit: GLIMMER & Grace e-commerce platform"
git branch -M main
git remote add origin https://github.com/your-username/glimmer-and-grace.git
git push -u origin main
```

### Deploy to Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Under **Environment Variables**, add the variables from `.env.example`.
6. Click **Deploy**. The included `vercel.json` ensures client-side routing works seamlessly across all deep links.
