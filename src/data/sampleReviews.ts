export interface CustomerTestimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  purchasedItem: string;
  date: string;
}

export const SAMPLE_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 'test-1',
    name: 'Ayesha Rahman',
    location: 'Dhanmondi, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The products are amazing! Quality is top-notch and delivery was super fast. Highly recommend!',
    purchasedItem: 'Hydrating Rose Face Cream',
    date: 'February 2026'
  },
  {
    id: 'test-2',
    name: 'Tania Islam',
    location: 'Gulshan, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'I love the jewellery collection. So elegant and beautiful. Will definitely shop again!',
    purchasedItem: 'Imperial Emerald Kundan Choker',
    date: 'February 2026'
  },
  {
    id: 'test-3',
    name: 'Sadia Akter',
    location: 'Chittagong',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Best online store for cosmetics. Everything is original and well packed. Thank you!',
    purchasedItem: 'Velvet Matte Lipstick',
    date: 'January 2026'
  },
  {
    id: 'test-4',
    name: 'Nusrat Jahan',
    location: 'Sylhet',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The gold hoop earrings are stunning! Hypoallergenic and comfortable to wear all day without fading.',
    purchasedItem: '22K Gold Filigree Hoop Earrings',
    date: 'January 2026'
  }
];
