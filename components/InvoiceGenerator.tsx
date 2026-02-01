'use client';
import { useState } from 'react';

export default function InvoiceGenerator({ orderId }: { orderId: string }) {
    const [downloading, setDownloading] = useState(false);

    const downloadInvoice = async () => {
        setDownloading(true);
        try {
            const res = await fetch('/api/invoice/generate', {
                method: 'POST',
                body: JSON.stringify({ orderId }),
            });

            if (!res.ok) throw new Error('Failed to generate invoice');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert('Error downloading invoice');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            onClick={downloadInvoice}
            disabled={downloading}
            className="text-sm text-blue-600 underline hover:text-blue-800"
        >
            {downloading ? 'Generating...' : 'Download Invoice'}
        </button>
    );
}
