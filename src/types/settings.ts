export interface SiteSettings {
  // Store identity & contacts
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  operatingHours: string;

  // Social Links
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;

  // Delivery & Charges (BDT)
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;

  // Top Announcement Bar
  announcementEnabled: boolean;
  announcementText: string;
  promoCode: string;
  promoDiscountText: string;

  // Hero Section
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImageUrl: string;
  heroOfferBadge: string;

  // Zennia Dedication Section
  zenniaBadge: string;
  zenniaTitle: string;
  zenniaSubtitle: string;
  zenniaDescription: string;
  zenniaQuote: string;
  zenniaDedicatedBy: string;
  zenniaImageUrl: string;
  zenniaPillar1Title: string;
  zenniaPillar1Desc: string;
  zenniaPillar2Title: string;
  zenniaPillar2Desc: string;
  zenniaPillar3Title: string;
  zenniaPillar3Desc: string;

  // Special Offer Banner
  specialOfferHeadline: string;
  specialOfferSubheadline: string;
  specialOfferButtonText: string;
  specialOfferButtonLink: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  storeName: 'GLIMMER & Grace',
  tagline: 'BEAUTY & BEYOND',
  phone: '+880 1712 345678',
  whatsapp: '+880 1712 345678',
  email: 'info@glimmergrace.com',
  address: 'Level 4, Navana Tower, Gulshan-1, Dhaka 1212, Bangladesh',
  operatingHours: '10:00 AM – 10:00 PM (Everyday)',

  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',

  deliveryInsideDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeDeliveryThreshold: 1500,

  announcementEnabled: true,
  announcementText: 'Free Delivery across Bangladesh on orders over ৳1,500! Cash on Delivery Available.',
  promoCode: 'GLIMMER10',
  promoDiscountText: 'Use Code GLIMMER10 for 10% Off',

  heroBadge: 'DISCOVER YOUR NATURAL BEAUTY',
  heroTitleLine1: 'Premium Cosmetics',
  heroTitleLine2: 'Exquisite Jewellery',
  heroSubtitle: 'Feel beautiful. Look elegant. Be you. Indulge in certified skincare, velvet lip shades, and regal 22K gold & pearl jewellery crafted for every moment.',
  heroPrimaryCtaText: 'Shop Cosmetics',
  heroPrimaryCtaLink: '/cosmetics',
  heroSecondaryCtaText: 'Explore Jewellery',
  heroSecondaryCtaLink: '/jewellery',
  heroImageUrl: '/images/showcase.png',
  heroOfferBadge: 'Up to 30% Off on Selected Sets',

  zenniaBadge: 'Bespoke Signature Tribute',
  zenniaTitle: 'The Zennia Collection',
  zenniaSubtitle: 'Grace, Romance & Eternal Glow',
  zenniaDescription: 'Created in honor of Zennia, whose ethereal grace, warmth, and natural beauty inspire every hand-selected jewel and velvet shade at GLIMMER & Grace. A celebration of love that shines brighter than the finest diamonds.',
  zenniaQuote: '"In your smile, true beauty finds its meaning; in your grace, every gem finds its sparkle."',
  zenniaDedicatedBy: 'Dedicated with pure devotion by Yeasin Arafat',
  zenniaImageUrl: '/images/zennia.png',
  zenniaPillar1Title: 'Pure Elegance',
  zenniaPillar1Desc: 'Handcrafted luxury',
  zenniaPillar2Title: "Queen's Radiance",
  zenniaPillar2Desc: 'Rose & 22K gold',
  zenniaPillar3Title: 'Eternal Love',
  zenniaPillar3Desc: 'Timeless memories',

  specialOfferHeadline: 'Radiant Festive Offers — Up to 35% Off',
  specialOfferSubheadline: 'Handpicked bridal jewellery sets and skincare essentials designed to give you that timeless, glowing charm for the wedding season.',
  specialOfferButtonText: 'Claim Your Special Offer',
  specialOfferButtonLink: '/jewellery'
};
