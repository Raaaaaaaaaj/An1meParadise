import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Product {
  id: number;
  product_name: string;
  price_at_time: number;
  quantity: number;
  total_price: number;
}

interface Order {
  id: number;
  created_at: string;
  order_status: "pending" | "confirmed" | "shipped" | "delivered";
  final_amount: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  items: Product[];
}

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const formatStatus = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : "Pending");

const OrdersTab = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (!user?.id) {
          setOrders([]);
          return;
        }

        const response = await fetch(`${API_URL}/api/user/orders/${user.id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to load orders");
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-primary">Your Orders</h2>

      <div className="space-y-3">
        {loading && (
          <div className="rounded-xl border border-border bg-gradient-card p-4 text-sm text-muted-foreground">
            Loading your orders...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl border border-border bg-gradient-card p-4 text-sm text-muted-foreground">
            No orders found yet.
          </div>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-xl border border-border bg-gradient-card">
              <button
                onClick={() => toggle(order.id)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-muted"
              >
                <div>
                  <p className="font-semibold text-primary">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium text-primary">Rs. {order.final_amount}</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      order.order_status === "delivered"
                        ? "bg-green-500/20 text-green-400"
                        : order.order_status === "pending" || order.order_status === "confirmed"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {formatStatus(order.order_status)}
                  </span>

                  <span className={`text-primary transition-transform ${openId === order.id ? "rotate-180" : ""}`}>
                    ^
                  </span>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openId === order.id ? "max-h-[520px] p-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 border-t border-border pt-4">
                  {order.items.map((product) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-primary">{product.product_name}</p>
                        <p className="text-muted-foreground">Qty: {product.quantity}</p>
                        <p className="text-xs text-muted-foreground">{formatStatus(order.order_status)}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-primary">Rs. {product.total_price}</p>
                        <p className="text-xs text-muted-foreground">Paid</p>
                      </div>
                    </div>
                  ))}

                  <div className="break-all text-xs text-muted-foreground">
                    Payment: {order.razorpay_payment_id || "-"}
                  </div>

                  <div className="flex justify-between border-t border-border pt-3 font-semibold">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">Rs. {order.final_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersTab;
