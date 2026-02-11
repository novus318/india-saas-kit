import { NextResponse } from 'next/server';
import { validateSignature } from '@/lib/razorpay';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    const body = await request.text();

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    const isValid = validateSignature(signature, body, webhookSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature - check webhook secret' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const customerId = payment.notes?.customerId;
      const email = payment.notes?.email;

      if (customerId && email) {
        // Update order status
        await prisma.order.updateMany({
          where: {
            razorpayOrderId: payment.order_id
          },
          data: {
            status: 'paid',
            razorpayPaymentId: payment.id
          }
        });

        // Get user details for email
        const user = await prisma.user.findUnique({
          where: { id: customerId }
        });

        // Send product access email
        if (user) {
          await sendEmail(
            email,
            'Your Purchase is Complete - Access Your Product',
            `
              <h1>Thank you for your purchase, ${user.name || 'Valued Customer'}!</h1>
              <p>Your payment has been successfully processed.</p>
              <p>You can access your product at: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard">Dashboard</a></p>
              <p>If you have any questions, please reply to this email.</p>
            `
          );
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
