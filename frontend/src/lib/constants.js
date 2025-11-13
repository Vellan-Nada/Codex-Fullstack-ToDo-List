export const PLAN_LIMITS = {
  free: 4,
  premium: 20
};

export const PLAN_DETAILS = {
  free: {
    label: 'Free',
    description: 'Capture up to four tasks and stay motivated with a lightweight workflow.',
    price: '$0',
    features: ['Email + OAuth login', 'Task reminders', 'Basic analytics']
  },
  premium: {
    label: 'Premium',
    description: 'Level up with twenty tasks, automations, and priority support.',
    price: '$8 / mo',
    features: ['20 active tasks', 'Upcoming calendar view', '1-click Stripe billing', 'Priority support channel']
  }
};

export const OAUTH_PROVIDERS = [
  { label: 'Google', provider: 'google' },
  { label: 'GitHub', provider: 'github' }
];
