export interface Bead {
  id: string;
  name: string;
  type: 'round' | 'heart' | 'star' | 'cube' | 'flower' | 'letter' | 'charm';
  color: string; // Tailwind hex or color name
  emoji: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  code: string; // Product code, e.g. s-0001
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // SVG representation tag or label
  category: string;
  colors: string[]; // representative colors
  beadsUsed: string[]; // names or descriptions of beads
  isBestSeller?: boolean;
  isNew?: boolean;
  isSoldOut?: boolean;
}

export interface CartItem {
  id: string; // Product ID
  product: Product;
  quantity: number;
}

export interface ShopInfo {
  name: string;
  slogan: string;
  about: string;
  whatsappNumber: string; // For checkout
  igUsername: string;
  tiktokUsername: string;
  address: string;
  shippingOptions: string[];
}
