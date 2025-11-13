import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLAN_DETAILS } from '../lib/constants.js';
import { stripePromise } from '../lib/stripeClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../lib/apiClient.js';

function UpgradePage() {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!stripePromise) {
      setMessage('Add your Stripe publishable key to enable checkout.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const stripe = await stripePromise;
      const payload = await apiClient.startCheckout({
        token: session?.access_token,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/upgrade`
      });
      if (payload?.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }
      if (payload?.sessionId) {
        await stripe.redirectToCheckout({ sessionId: payload.sessionId });
        return;
      }
      setMessage('Backend returned an unexpected response.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const readyForCheckout = Boolean(user && session?.access_token);

  return (
    <section className="container" style={{ padding: '4rem 0', display: 'grid', gap: '2rem', gridTemplateColumns: '1.2fr 1fr' }}>
      <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <p className="chip">Premium</p>
          <h2>{PLAN_DETAILS.premium.label}</h2>
          <p style={{ color: 'var(--color-muted)' }}>{PLAN_DETAILS.premium.description}</p>
        </div>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-muted)' }}>
          {PLAN_DETAILS.premium.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleCheckout} disabled={loading || !readyForCheckout}>
            {loading ? 'Redirecting...' : 'Upgrade with Stripe'}
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
            Back to tasks
          </button>
        </div>
        {!readyForCheckout && (
          <small style={{ color: 'var(--color-danger)' }}>Sign in first so we can associate your upgraded plan.</small>
        )}
        {message && <div style={{ color: 'var(--color-danger)' }}>{message}</div>}
      </article>

      <aside className="card" style={{ background: '#0f172a', color: 'white' }}>
        <h3>Implementation checklist</h3>
        <ol style={{ color: '#cbd5f5', lineHeight: 1.8 }}>
          <li>Deploy Express/Fastify API on Railway</li>
          <li>Expose <code>/billing/checkout</code> that creates a Stripe Checkout Session</li>
          <li>Persist upgraded plan in Supabase after webhook confirms payment</li>
          <li>Call <code>refreshProfile()</code> to sync plan to the client</li>
        </ol>
      </aside>
    </section>
  );
}

export default UpgradePage;
