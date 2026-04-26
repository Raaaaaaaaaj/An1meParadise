import categoryNaruto from "@/assets/category-naruto.jpg";
import categoryOnepiece from "@/assets/category-onepiece.jpg";
import categoryAot from "@/assets/category-aot.jpg";
import categoryDemonslayer from "@/assets/category-demonslayer.jpg";
import categoryDragonball from "@/assets/category-dragonball.jpg";
import categoryJjk from "@/assets/category-jjk.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  animeSeries: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: "new" | "hot" | "limited" | "sale";
  sizes?: string[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "1", name: "Naruto", slug: "naruto", image: categoryNaruto, productCount: 42 },
  { id: "2", name: "One Piece", slug: "one-piece", image: categoryOnepiece, productCount: 38 },
  { id: "3", name: "Attack on Titan", slug: "attack-on-titan", image: categoryAot, productCount: 25 },
  { id: "4", name: "Demon Slayer", slug: "demon-slayer", image: categoryDemonslayer, productCount: 31 },
  { id: "5", name: "Dragon Ball", slug: "dragon-ball", image: categoryDragonball, productCount: 29 },
  { id: "6", name: "Jujutsu Kaisen", slug: "jujutsu-kaisen", image: categoryJjk, productCount: 35 },
];

export const products: Product[] = [
  {
    id: "1", name: "Naruto Sage Mode Hoodie", slug: "naruto-sage-mode-hoodie",
    price: 2499, originalPrice: 3499, image: categoryNaruto,
    category: "Hoodies", animeSeries: "Naruto",
    description: "Premium heavyweight hoodie featuring Naruto's iconic Sage Mode design with glow-in-the-dark elements.",
    rating: 4.8, reviews: 124, badge: "hot", sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: "2", name: "One Piece Pirate King Jacket", slug: "one-piece-pirate-king-jacket",
    price: 3299, originalPrice: 4299, image: categoryOnepiece,
    category: "Jackets", animeSeries: "One Piece",
    description: "Limited edition bomber jacket with Luffy's Gear 5 artwork and premium embroidery.",
    rating: 4.9, reviews: 89, badge: "limited", sizes: ["S", "M", "L", "XL"], inStock: true,
  },
  {
    id: "3", name: "AOT Scout Regiment Jacket", slug: "aot-scout-regiment-jacket",
    price: 2999, image: categoryAot,
    category: "Jackets", animeSeries: "Attack on Titan",
    description: "Military-grade jacket featuring the Wings of Freedom emblem with tactical pockets.",
    rating: 4.7, reviews: 67, badge: "new", sizes: ["M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: "4", name: "Demon Slayer Tanjiro Hoodie", slug: "demon-slayer-tanjiro-hoodie",
    price: 2299, originalPrice: 2999, image: categoryDemonslayer,
    category: "Hoodies", animeSeries: "Demon Slayer",
    description: "Water breathing pattern hoodie with UV-reactive prints and premium cotton blend.",
    rating: 4.6, reviews: 156, badge: "sale", sizes: ["S", "M", "L", "XL"], inStock: true,
  },
  {
    id: "5", name: "Dragon Ball Saiyan Armor Tee", slug: "dragon-ball-saiyan-armor-tee",
    price: 1499, image: categoryDragonball,
    category: "T-Shirts", animeSeries: "Dragon Ball",
    description: "3D printed Saiyan armor design on premium moisture-wicking fabric.",
    rating: 4.5, reviews: 203, sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: "6", name: "JJK Cursed Energy Hoodie", slug: "jjk-cursed-energy-hoodie",
    price: 2699, image: categoryJjk,
    category: "Hoodies", animeSeries: "Jujutsu Kaisen",
    description: "Dark-themed hoodie with Gojo's Infinity pattern and reflective elements.",
    rating: 4.8, reviews: 98, badge: "hot", sizes: ["S", "M", "L", "XL"], inStock: true,
  },
  {
    id: "7", name: "Naruto Akatsuki Cloak", slug: "naruto-akatsuki-cloak",
    price: 3999, image: categoryNaruto,
    category: "Costumes", animeSeries: "Naruto",
    description: "Full-length Akatsuki cloak replica with premium fabric and cloud pattern.",
    rating: 4.9, reviews: 45, badge: "limited", sizes: ["M", "L", "XL"], inStock: true,
  },
  {
    id: "8", name: "One Piece Straw Hat Cap", slug: "one-piece-straw-hat-cap",
    price: 899, image: categoryOnepiece,
    category: "Accessories", animeSeries: "One Piece",
    description: "Adjustable snapback cap with embroidered Straw Hat Pirates logo.",
    rating: 4.4, reviews: 312, sizes: ["One Size"], inStock: true,
  },
];

export const testimonials = [
  { name: "Aditya Choudhary ", text: `Absolute stunning 🔥🔥 Thnx for amazing quality ❤️`, rating: 5, avatar: "A" },
  { name: "Fateh Singh ", text: `Reached me safely and everything looks good ❤️ I’ll post my review later on facebook`, rating: 5, avatar: "F" },
  { name: "Danish farooq", text: `The Dragon is awesome 🙌 at this price point .. thanks a lot 🙏💥`, rating: 5, avatar: "D" },
  { name: "Pradeep Rajendra", text: `Thanks bro good quality I love it ♥️♥️`, rating: 5, avatar: "P" },
  { name: "Om sharma", text: `Order received bro Superb quality …. Thankx ❤️`, rating: 5, avatar: "O" },
];
