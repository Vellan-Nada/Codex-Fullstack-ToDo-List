import Stripe from 'stripe';
import { config } from '../config.js';
import { upsertProfile } from './profileService.js';

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
    },
    subscription_data: {
      metadata: {
        userId
      }
    }
  });
};

const upgradeToPremium = async (userId) => {
  if (!userId) return;
  await upsertProfile(userId, { plan: 'premium' });
};

const downgradeToFree = async (userId) => {
  if (!userId) return;
  await upsertProfile(userId, { plan: 'free' });
};

const extractUserId = (payload) => payload?.metadata?.userId || payload?.custom_fields?.find?.((field) => field.key === 'userId')?.text?.value;

const handleCheckoutCompleted = async (session) => {
  if (session.payment_status !== 'paid') return;
  const userId = extractUserId(session);
  await upgradeToPremium(userId);
};

const handleSubscriptionEvent = async (subscription) => {
  if (!subscription) return;
  const userId = extractUserId(subscription);
  if (!userId) return;
  if (['active', 'trialing', 'past_due'].includes(subscription.status)) {
    await upgradeToPremium(userId);
  } else {
    await downgradeToFree(userId);
  }
};

export const handleStripeWebhook = async (req, res) => {
  if (!config.stripe.webhookSecret) {
    return res.status(500).json({ message: 'STRIPE_WEBHOOK_SECRET is not configured' });
  }

  const client = ensureStripe();
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = client.webhooks.constructEvent(req.body, signature, config.stripe.webhookSecret);
  } catch (error) {
    console.error('[stripe] webhook signature verification failed', error.message);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated':
        await handleSubscriptionEvent(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('[stripe] webhook handler failed', error);
    return res.status(500).json({ message: error.message });
  }

  return res.json({ received: true });
};
