import Stripe from 'stripe';
import { config } from '../config.js';

let stripe = null;
if (config.stripe.secretKey) {
  stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' });
} else {
  console.warn('[stripe] STRIPE_SECRET_KEY missing. Billing endpoints will be disabled.');
}

export const ensureStripe = () => {
  if (!stripe) {
    const error = new Error('Stripe is not configured');
    error.status = 500;
    throw error;
  }
  return stripe;
};

export const createCheckoutSession = async ({ userId, email, successUrl, cancelUrl }) => {
  const client = ensureStripe();
  if (!config.stripe.priceId) {
    throw new Error('STRIPE_PRICE_ID is not configured');
  }
  return client.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: config.stripe.priceId,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    metadata: {
      userId
    }
  });
};
