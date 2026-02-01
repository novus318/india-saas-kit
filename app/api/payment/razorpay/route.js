import { razorpay } from '@/lib/razorpay';
import { auth } from "@/lib/auth";

export async function POST(req) {
    const session = await auth();
    // For demo: allowing unauthenticated orders if session is null for easier testing, 
    // OR uncomment below to enforce auth.
    // if (!session) return new Response("Unauthorized", { status: 401 });

    const { amount, currency = "INR" } = await req.json();

    const options = {
        amount: amount * 100, // paise
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: { userId: session?.user?.id || 'guest' }
    };

    try {
        const order = await razorpay.orders.create(options);
        return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
