'use client';

import { useState } from 'react';
import PaymentButton from './PaymentButton';
import DemoInvoice from './DemoInvoice';

export default function PaymentManager() {
    const [latestOrderId, setLatestOrderId] = useState<string>('');

    const handlePaymentSuccess = (orderId: string) => {
        setLatestOrderId(orderId);
    };

    return (
        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left gap-8">
            <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/50">
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    Razorpay Payment
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm text-muted-foreground`}>
                    Secure Razorpay integration with UPI/Card support.
                </p>
                <div className="mt-4">
                    <PaymentButton
                        amount={999}
                        onSuccess={handlePaymentSuccess}
                    />
                </div>
            </div>

            <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/50">
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    GST Invoice
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm text-muted-foreground`}>
                    Auto-generated GST compliant invoices.
                </p>
                <div className="mt-4">
                    <DemoInvoice orderId={latestOrderId} />
                </div>
            </div>
        </div>
    );
}
