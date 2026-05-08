(async ()=>{
  const fetch = global.fetch || (await import('node-fetch')).default;
  try{
    const createRes = await fetch('http://localhost:5000/api/create-order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ amount: 500 })
    });
    const createData = await createRes.json();
    console.log('create-order response:', createData);
    const order_id = createData.order_id;
    if(!order_id) return;
    const payment_id = 'pay_fake_' + Date.now();
    const crypto = await import('node:crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET || 'KTjEfjrw1qCkCyZ22YukETc4';
    const signature = crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex');
    console.log('simulated payment_id:', payment_id);
    console.log('computed signature:', signature);
    const verifyRes = await fetch('http://localhost:5000/api/verify-payment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ razorpay_payment_id: payment_id, razorpay_order_id: order_id, razorpay_signature: signature })
    });
    const verifyData = await verifyRes.json();
    console.log('verify response:', verifyData);
  } catch (e) { console.error(e); }
})();
