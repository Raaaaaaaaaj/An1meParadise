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
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

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
  category_image: string;
  created_at: string;
}

export interface AdminProductImage {
  id: number;
  product_id: number;
  thumbnail_image: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
}

export interface AdminProduct {
  id: number;
  prod_title: string;
  prod_description: string;
  prod_mainPrice: number;
  prod_actualPrice: number;
  prod_quantity: number;
  prod_createdAt: string;
  prod_categoryId: number;
  prod_badgeName: string;
  is_featured: 0 | 1;
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
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  shipping_charge: number;
  discount_amount: number;
  final_amount: number;
  payment_method: "COD" | "Razorpay" | "UPI" | "Card";
  shipping_address: string;
  billing_address: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  created_at: string;
  updated_at: string;
}

export interface AdminContact {
  id: number;
  contact_name: string;
  contact_mail: string;
  contact_mobile: string;
  subject: string;
  message: string;
  status: "New" | "In Review" | "Closed";
  created_at: string;
}
