import type {
  AdminCategory,
  AdminContact,
  AdminCoupon,
  AdminOrder,
  AdminOwner,
  AdminProduct,
  AdminProductImage,
  AdminTag,
  AdminUser,
} from "@/admin/types";

const cities = ["Kolkata", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Jaipur"];
const names = [
  "Aarav Sharma",
  "Vihaan Das",
  "Ishaan Mehta",
  "Kabir Khan",
  "Riya Sen",
  "Anaya Roy",
  "Aditya Nair",
  "Saanvi Iyer",
];

export const adminOwner: AdminOwner = {
  id: 1,
  owner_name: "Sreejit Saha",
  owner_mail: "workwithan1me.paradise@gmail.com",
  owner_mobile: "+91 62894 24388",
  role: "Owner & Manager",
  joined_at: "2026-01-05",
};

export const adminUsers: AdminUser[] = Array.from({ length: 64 }, (_, index) => {
  const id = index + 1;
  const name = names[index % names.length];

  return {
    id,
    userName: `${name} ${id}`,
    userMail: `customer${id}@example.com`,
    userMobile: `+91 90000 ${String(10000 + id).slice(-5)}`,
    userCity: cities[index % cities.length],
    // status: id % 11 === 0 ? "Blocked" : id % 4 === 0 ? "Inactive" : "Active",
    userCode: `${name} ${id}`,
    created_at: `2026-04-${String((index % 28) + 1).padStart(2, "0")}`,
  };
});

export const adminCategories: AdminCategory[] = [
  { id: 1, category_name: "Katanas", category_image: "/logo2.png", created_at: "2026-04-02" },
  { id: 2, category_name: "Anime Figures", category_image: "/placeholder.svg", created_at: "2026-04-04" },
  { id: 3, category_name: "Demon Slayer", category_image: "/placeholder.svg", created_at: "2026-04-08" },
  { id: 4, category_name: "One Piece", category_image: "/placeholder.svg", created_at: "2026-04-10" },
  { id: 5, category_name: "Naruto", category_image: "/placeholder.svg", created_at: "2026-04-11" },
  { id: 6, category_name: "Dragon Ball", category_image: "/placeholder.svg", created_at: "2026-04-14" },
];

export const adminProducts: AdminProduct[] = [
  {
    id: 101,
    prod_title: "Tanjiro Kamado Black Wooden Katana",
    prod_description: "Premium wooden katana inspired by Tanjiro Kamado with detailed finish.",
    prod_minPrice: 1799,
    prod_actualPrice: 1299,
    prod_maxPrice: 1799,
    prod_qty: 38,
    prod_createdAt: "2026-04-18",
    prod_category_ID: 1,
    prod_badgeName: "Hot",
    is_featured: 1,
  },
  {
    id: 102,
    prod_title: "Zoro Wado Ichimonji White Wooden Katana",
    prod_description: "White wooden katana with display-ready craftsmanship.",
    prod_minPrice: 1999,
    prod_actualPrice: 1499,
    prod_maxPrice: 1999,
    prod_qty: 24,
    prod_createdAt: "2026-04-19",
    prod_category_ID: 1,
    prod_badgeName: "New",
    is_featured: 1,
  },
  {
    id: 103,
    prod_title: "Luffy Gear 5 Moon Lamp",
    prod_description: "Desk lamp collectible with anime display styling.",
    prod_minPrice: 2299,
    prod_actualPrice: 1799,
    prod_maxPrice: 2299,
    prod_qty: 16,
    prod_createdAt: "2026-04-22",
    prod_category_ID: 2,
    prod_badgeName: "Limited",
    is_featured: 0,
  },
  {
    id: 104,
    prod_title: "Naruto KCM Premium Action Figure",
    prod_description: "Premium figure with Kurama themed base and detailed sculpt.",
    prod_minPrice: 3499,
    prod_actualPrice: 2999,
    prod_maxPrice: 3499,
    prod_qty: 9,
    prod_createdAt: "2026-04-23",
    prod_category_ID: 2,
    prod_badgeName: "Premium",
    is_featured: 1,
  },
  {
    id: 105,
    prod_title: "Kokushibo LED Wooden Katana",
    prod_description: "LED katana collectible with layered blade details.",
    prod_minPrice: 2499,
    prod_actualPrice: 1999,
    prod_maxPrice: 2499,
    prod_qty: 21,
    prod_createdAt: "2026-04-25",
    prod_category_ID: 3,
    prod_badgeName: "LED",
    is_featured: 0,
  },
  {
    id: 106,
    prod_title: "Madara Uchiha Premium Figure",
    prod_description: "Large display figure with limited edition accessory card.",
    prod_minPrice: 3999,
    prod_actualPrice: 3499,
    prod_maxPrice: 3999,
    prod_qty: 7,
    prod_createdAt: "2026-04-26",
    prod_category_ID: 5,
    prod_badgeName: "Limited",
    is_featured: 1,
  },
];

export const adminProductImages: AdminProductImage[] = adminProducts.map((product, index) => ({
  id: index + 1,
  product_id: product.id,
  thumbnail_image: index % 2 === 0 ? "/logo2.png" : "/placeholder.svg",
  image_2: "/placeholder.svg",
  image_3: "/placeholder.svg",
  image_4: "/placeholder.svg",
  image_5: "/placeholder.svg",
}));

export const adminTags: AdminTag[] = [
  { id: 1, tag_name: "Best Seller", slug: "best-seller", product_count: 12, status: "Active", created_at: "2026-04-02" },
  { id: 2, tag_name: "LED", slug: "led", product_count: 8, status: "Active", created_at: "2026-04-05" },
  { id: 3, tag_name: "Limited Edition", slug: "limited-edition", product_count: 5, status: "Active", created_at: "2026-04-09" },
  { id: 4, tag_name: "New Arrival", slug: "new-arrival", product_count: 19, status: "Inactive", created_at: "2026-04-12" },
];

export const adminCoupons: AdminCoupon[] = [];

export const adminOrders: AdminOrder[] = [
  {
    id: 5001,
    user_id: 1,
    order_status: "confirmed",
    total_amount: 3298,
    shipping_charge: 99,
    final_amount: 3197,
    billing_address: "12 Park Street, Kolkata, West Bengal 700016",
    razorpay_order_id: "order_PZ5001",
    razorpay_payment_id: "pay_PZ5001",
    created_at: "2026-05-01",
  },
  {
    id: 5002,
    user_id: 7,
    order_status: "delivered",
    total_amount: 1799,
    shipping_charge: 0,
    final_amount: 1799,
    billing_address: "88 Brigade Road, Bengaluru, Karnataka 560001",
    razorpay_order_id: "order_PZ5002",
    razorpay_payment_id: "pay_PZ5002",
    created_at: "2026-05-03",
  },
  {
    id: 5003,
    user_id: 18,
    order_status: "pending",
    total_amount: 1499,
    shipping_charge: 99,
    final_amount: 1598,
    billing_address: "45 Civil Lines, Jaipur, Rajasthan 302006",
    razorpay_order_id: "",
    razorpay_payment_id: "",
    created_at: "2026-05-06",
  },
  {
    id: 5004,
    user_id: 25,
    order_status: "shipped",
    total_amount: 3499,
    shipping_charge: 0,
    final_amount: 3199,
    billing_address: "21 Bandra West, Mumbai, Maharashtra 400050",
    razorpay_order_id: "order_PZ5004",
    razorpay_payment_id: "pay_PZ5004",
    created_at: "2026-05-08",
  },
];

export const adminContacts: AdminContact[] = [
  {
    id: 1,
    contact_name: "Rahul Verma",
    contact_mail: "rahul@example.com",
    contact_mobile: "+91 98123 45670",
    subject: "Bulk order",
    message: "Need quotation for 20 katana pieces.",
    status: "New",
    created_at: "2026-05-06",
  },
  {
    id: 2,
    contact_name: "Sima Roy",
    contact_mail: "sima@example.com",
    contact_mobile: "+91 98123 45671",
    subject: "Order status",
    message: "Please share dispatch details for my recent order.",
    status: "In Review",
    created_at: "2026-05-07",
  },
  {
    id: 3,
    contact_name: "Aman Gupta",
    contact_mail: "aman@example.com",
    contact_mobile: "+91 98123 45672",
    subject: "Product request",
    message: "Looking for Zenitsu LED katana restock date.",
    status: "Closed",
    created_at: "2026-05-08",
  },
];
