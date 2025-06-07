
export interface Product {
  id: string;
  name: string;
  description: string; // Main/overview description
  price: number;
  imageSrc: string;
  imageAlt: string;
  category: string;
  dataAiHint: string; // For placeholder image search keywords
  rating?: number; // Optional: average rating 0-5
  reviewCount?: number; // Optional: number of reviews
  availability?: 'In Stock' | 'Out of Stock' | 'Pre-Order';
  features?: string[];
  howToUse?: string[] | string; // Can be an array for steps or a single string
  ingredients?: string[] | string;
  safetyInfo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageSrc: string;
  imageAlt: string;
  dataAiHint: string;
  date: string; // ISO date string
  author: string;
  content: string; // Full content for the blog post page
  // category: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string; // e.g., "Happy Gardener", "Commercial Farmer"
  avatarSrc?: string; // URL for placeholder avatar
  dataAiHint?: string; // For avatar placeholder
}

export interface AppUser {
  uid: string;
  email?: string | null; // Aligning with Firebase User type
  displayName?: string | null; // Aligning with Firebase User type
  role: 'admin' | 'user';
  photoURL?: string | null; // Optional: if you want to store this
  createdAt?: any; // Optional: Firestore timestamp for when the user doc was created
}
