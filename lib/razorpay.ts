import crypto from 'crypto';

/**
 * Validate Razorpay webhook signature
 * @param signature - The signature from x-razorpay-signature header
 * @param body - The raw request body
 * @param secret - The webhook secret
 * @returns boolean indicating if signature is valid
 */
export function validateSignature(
  signature: string,
  body: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
