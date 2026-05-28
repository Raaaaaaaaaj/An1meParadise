export type AdminSection =
  | "dashboard"
  | "profile"
  | "users"
  | "categories"
  | "products"
  | "tags"
  | "coupons"
  | "orders"
  | "contacts";

export type RecordStatus = "Active" | "Inactive" | "Blocked";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";

export interface AdminOwner {
  id: number;
  owner_name: string;
  owner_mail: string;
  owner_mobile: string;
  role: string;
  joined_at: string;
}

export interface AdminUser {
  id: number;
  userName: string;
  userMail: string;
  userMobile: string;
  userCity: string;
  // status: RecordStatus;
  userCode: string;
  created_at: string;
}

export interface AdminCategory {
  id: number;
  category_name: string;
  category_image: string | null;
  created_at: string;
}

export interface AdminProductImage {
  id: number;
  product_id: number;
  thumbnail_image: string | null;
  image_2: string | null;
  image_3: string | null;
  image_4: string | null;
  image_5: string | null;
}

export interface AdminProduct {
  id: number;
  prod_title: string;
  prod_description: string;
  prod_minPrice: number | null;
  prod_actualPrice: number;
  prod_maxPrice: number | null;
  prod_qty: number | null;
  prod_createdAt: string;
  prod_category_ID: number;
  prod_badgeName: string;
  is_featured: 0 | 1;
  category_name?: string;
  image?: string | null;
  thumbnail_image?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  image_4?: string | null;
  image_5?: string | null;
}

export interface AdminTag {
  id: number;
  tag_name: string;
  slug: string;
  product_count: number;
  status: RecordStatus;
  created_at: string;
}

export interface AdminCoupon {
  id: number;
  coupon_code: string;
  discount_type: "Flat" | "Percentage";
  discount_value: number;
  status: RecordStatus;
  created_at: string;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  userName?: string;
  userMail?: string;
  order_status: OrderStatus;
  total_amount: number;
  shipping_charge: number;
  final_amount: number;
  billing_address: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  created_at: string;
  items?: Array<{
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price_at_time: number;
    total_price: number;
  }>;
}

export interface AdminContact {
  id: number;
  name: string;
  email: string;
  number: string;
  message: string;
  created_at: string;
}
