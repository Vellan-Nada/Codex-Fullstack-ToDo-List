import { Link } from 'react-router-dom';
import { PLAN_DETAILS } from '../lib/constants.js';

const features = [
  {
    title: 'Frictionless capture',
    description: 'Add, edit, and reorder tasks in a single keystroke-friendly workspace.'
  },
  {
    title: 'Auth that just works',
    description: 'OAuth, email/password, and Supabase-powered session management baked in.'
  },
  {
    title: 'Billing ready',
    description: 'Stripe checkout hooks and plan limits keep your free tier profitable.'
  }
];

function LandingPage() {
  return (
    <main>
      <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <span className="chip">Full-stack ready</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
          Organize deep work in one focused to-do app
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 2rem' }}>
          TaskForge ships with Supabase auth, PostgreSQL data models, and Stripe monetization flow so you can
          launch a real product - front-end to infra - in a weekend.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/auth" className="btn btn-primary">
            Get started free
          </Link>
          <Link to="/upgrade" className="btn btn-outline">
            View pricing
          </Link>
        </div>
      </section>

      <section style={{ background: '#0f172a', color: 'white' }}>
        <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {features.map((feature) => (
            <article key={feature.title} style={{ padding: '1.5rem', background: 'rgba(15,23,42,0.5)', borderRadius: '1rem', border: '1px solid rgba(148,163,184,0.4)' }}>
              <h3>{feature.title}</h3>
              <p style={{ color: '#cbd5f5' }}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Pricing that grows with you</h2>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
            <article key={key} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p className="chip">{plan.label}</p>
                <h3 style={{ marginBottom: '0.5rem' }}>{plan.price}</h3>
                <p style={{ color: 'var(--color-muted)' }}>{plan.description}</p>
              </div>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-muted)' }}>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link to={key === 'free' ? '/auth' : '/upgrade'} className="btn btn-primary" style={{ marginTop: 'auto' }}>
                {key === 'free' ? 'Start for free' : 'Upgrade with Stripe'}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
