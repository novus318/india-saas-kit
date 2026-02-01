import crypto from 'crypto';
import prisma from "@/lib/prisma";
import { calculateGST } from "@/lib/gst";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, amount } = await req.json();

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(orderCreationId + "|" + razorpayPaymentId)
        .digest("hex");

    if (generatedSignature !== razorpaySignature) {
        return new Response("Invalid signature", { status: 400 });
    }

    // Payment successful, create Order record
    // Assuming amount is in paisa from Razorpay, converting back to base unit if needed.
    // The amount passed here should be the original amount.

    const actualAmount = amount / 100; // Razorpay sends amount in paise

    // Create Order in DB
    const order = await prisma.order.create({
        data: {
            amount: actualAmount,
            razorpayOrderId: orderCreationId,
            razorpayPaymentId: razorpayPaymentId,
            status: 'paid',
            // userId is automatically set by the user relation below
            user: {
                connectOrCreate: {
                    where: { email: 'user@example.com' },
                    create: { email: 'user@example.com', name: 'User' }
                }
            }
        },
        include: {
            user: true
        }
    });

    // Send Email
    if (order.user.email) {
        await sendEmail(
            order.user.email,
            "Payment Successful",
            `<p>Thank you for your payment of INR ${actualAmount}. Your Order ID is ${order.id}.</p>`
        );
    }

    return Response.json({ success: true, orderId: order.id });
}
