import { useState } from "react";

interface Product {
  name: string;
  price: number;
  qty: number;
  status: string;
  paymentStatus: string;
  deliveredDate?: string;
}

interface Order {
  id: number;
  date: string;
  status: "Pending" | "Delivered" | "Cancelled";
  total: number;
  products: Product[];
}

const dummyOrders: Order[] = [
  {
    id: 101,
    date: "2026-04-28",
    status: "Delivered",
    total: 1200,
    products: [
      {
        name: "Anime Hoodie",
        price: 800,
        qty: 1,
        status: "Delivered",
        paymentStatus: "Paid",
        deliveredDate: "2026-04-30",
      },
      {
        name: "Sticker Pack",
        price: 400,
        qty: 2,
        status: "Delivered",
        paymentStatus: "Paid",
      },
    ],
  },
  {
    id: 102,
    date: "2026-04-25",
    status: "Pending",
    total: 600,
    products: [
      {
        name: "Naruto T-shirt",
        price: 600,
        qty: 1,
        status: "Pending",
        paymentStatus: "COD",
      },
    ],
  },
];

const OrdersTab = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-glow-purple">
        Your Orders
      </h2>

      <div className="space-y-3">
        {dummyOrders.map((order) => (
          <div
            key={order.id}
            className="border border-border rounded-xl bg-gradient-card overflow-hidden"
          >
            {/* 🔷 Accordion Header */}
            <button
              onClick={() => toggle(order.id)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-muted transition"
            >
              <div>
                <p className="font-semibold text-foreground">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.date}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium">₹{order.total}</span>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-500/20 text-green-400"
                      : order.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {order.status}
                </span>

                {/* Arrow */}
                <span
                  className={`transition-transform ${
                    openId === order.id ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>
              </div>
            </button>

            {/* 🔽 Accordion Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                openId === order.id
                  ? "max-h-[500px] opacity-100 p-4"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="space-y-4 border-t border-border pt-4">
                {order.products.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-muted-foreground">
                        Qty: {p.qty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.status}
                      </p>
                    </div>

                    <div className="text-right">
                      <p>₹{p.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.paymentStatus}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
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