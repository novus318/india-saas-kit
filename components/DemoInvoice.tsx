'use client';
import { useState } from 'react';
import InvoiceGenerator from './InvoiceGenerator';

export default function DemoInvoice({ orderId: initialOrderId }: { orderId?: string }) {
    const [orderId, setOrderId] = useState(initialOrderId || '');

    // Update local state if prop changes
    if (initialOrderId && initialOrderId !== orderId) {
        setOrderId(initialOrderId);
    }

    return (
        <div className="space-y-2">
            <input
                type="text"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-2 text-sm border rounded bg-background"
            />
            {orderId && <InvoiceGenerator orderId={orderId} />}
        </div>
    );
}
