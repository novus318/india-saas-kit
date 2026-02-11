import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'mock_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

/**
 * Validate Razorpay webhook signature
 * @param signature - The signature from x-razorpay-signature header
 * @param body - The raw request body
 * @param secret - The webhook secret
 * @returns boolean indicating if signature is valid
 */
export function validateSignature(signature, body, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch {
        return false;
    }
}
