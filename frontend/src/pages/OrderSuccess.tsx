import React from 'react';
import { useLocation } from 'react-router-dom';

export default function OrderSuccess(){
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const payment_id = params.get('payment_id');
  const order_id = params.get('order_id');

  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Completed</h1>
          <p className="mb-2">Thank you! Your payment was successful and verified.</p>
          <p className="text-sm text-muted-foreground">Payment ID: {payment_id}</p>
          <p className="text-sm text-muted-foreground">Order ID: {order_id}</p>
        </div>
      </div>
    </div>
  );
}
