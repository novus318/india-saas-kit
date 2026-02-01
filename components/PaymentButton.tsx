'use client';
import { useState } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentButton({ amount = 1000 }) { // 1000 = 1000 INR
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);

        // 1. Create Order
        const res = await fetch('/api/payment/razorpay', {
            method: 'POST',
            body: JSON.stringify({ amount, currency: 'INR' }),
        });
        const data = await res.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: data.amount,
            currency: data.currency,
            name: "IndiaStack SaaS",
            description: "Upgrade to Pro",
            order_id: data.orderId,
            handler: async function (response: any) {
                // 2. Verify Payment
                const verifyRes = await fetch('/api/payment/verify', {
                    method: 'POST',
                    body: JSON.stringify({
                        orderCreationId: data.orderId,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        amount: data.amount
                    }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    alert('Payment Successful');
                } else {
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setIsLoading(false);
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
                {isLoading ? 'Processing...' : `Pay ₹${amount} Now`}
            </button>
        </>
    );
}
