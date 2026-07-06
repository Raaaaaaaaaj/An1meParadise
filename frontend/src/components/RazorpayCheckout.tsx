import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Loader from "@/components/ui/loader";
const API_URL = import.meta.env.VITE_API_URL || "";


function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Props = {
  amountInPaise: number; // amount in paise
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function RazorpayCheckout({ amountInPaise, description, className, children }: Props) {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amountInPaise || amountInPaise < 100) {
      alert("Minimum amount is 100 paise");
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const createRes = await fetch(`${API_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        alert(err.message || "Failed to create order");
        return;
      }

      const order = await createRes.json();

      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "An1meParadise",
        description: description || "Order Payment",
        handler: async function (response: any) {
          setLoading(true);
          // send details to backend for verification
              // prepare metadata: cart items, total, buyer and address
              const userData = localStorage.getItem("user");
              const buyer = userData ? JSON.parse(userData) : null;
              if (!buyer?.id) {
                setLoading(false);
                alert("Please login before placing an order");
                return;
              }

              // fetch active address for user if available
              let address = null;
              try {
                if (buyer && buyer.id) {
                  const addrRes = await fetch(`${API_URL}/api/address/${buyer.id}`);
                  if (addrRes.ok) {
                    const addrs = await addrRes.json();
                    address = addrs.find((a: any) => a.status === "Active" ) || null;
                  }
                }
              } catch (e) {
                console.warn("Could not fetch address", e);
              }

              const payload = {
                ...response,
                metadata: {
                  user_id: buyer.id,
                  items: items.map((it: any) => ({
                    product_id: Number(it.product.id),
                    title: it.product.prod_title || it.product.name,
                    quantity: it.quantity,
                    price: Number(it.product.prod_actualPrice || 0),
                    price_at_time: Number(it.product.prod_actualPrice || 0),
                    total_price: Number(it.product.prod_actualPrice || 0) * it.quantity,
                  })),
                  total_amount: totalPrice,
                  shipping_charge: amountInPaise / 100 - totalPrice,
                  final_amount: amountInPaise / 100,
                  total: amountInPaise,
                  buyer: { id: buyer.id, name: buyer?.name || buyer?.fullName || buyer?.email, email: buyer?.email },
                  address,
                },
              };

              const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // navigate to order success page with minimal info
            navigate(`/order-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
          } else {
            setLoading(false);
            alert(verifyData.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment popup closed. You can try again.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        alert("Payment failed: " + (response.error && response.error.description));
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Check console for details.");
    }
  };

  const rupees = (amountInPaise / 100).toFixed(2);

  return (
    <>
      <button onClick={handlePayment} disabled={loading} className={className || "btn"}>
        {children ? children : `Pay ₹${rupees}`}
      </button>
      {loading && <Loader message="Finalizing payment..." />}
    </>
  );
}
