import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import OAuthButtons from '../components/OAuthButtons.jsx';

const MODE_COPY = {
  signin: {
    title: 'Welcome back',
    cta: 'Sign in',
    toggle: "Need an account? Create one"
  },
  signup: {
    title: "Let's get you set up",
    cta: 'Create account',
    toggle: 'Already onboard? Sign in'
  }
};

function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState('success');
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithProvider, authError, hasSupabase } = useAuth();

  const copy = MODE_COPY[mode];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setStatusTone('success');
    try {
      if (mode === 'signin') {
        await signInWithEmail(formState);
        navigate('/dashboard');
      } else {
        await signUpWithEmail(formState);
        setStatusMessage('Check your inbox to confirm your account, then sign in.');
        setStatusTone('success');
        setMode('signin');
      }
    } catch (error) {
      console.warn('[AuthPage] auth error', error);
      setStatusMessage(error.message || 'Unable to continue. Check your Supabase credentials.');
      setStatusTone('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setStatusMessage('');
    setStatusTone('success');
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.warn('[AuthPage] oauth error', error);
      setStatusMessage(error.message || 'OAuth sign in is unavailable right now.');
      setStatusTone('danger');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !hasSupabase;

  return (
    <section className="container" style={{ padding: '4rem 0', maxWidth: 640 }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p className="chip">Authentication</p>
          <h2 style={{ marginBottom: '0.5rem' }}>{copy.title}</h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Supabase handles secure email/password flows, magic links, and OAuth redirects. Configure your keys in
            <code style={{ marginLeft: 4 }}>.env</code> to enable the full experience.
          </p>
        </div>

        {!hasSupabase && (
          <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
            Add Supabase credentials to use live authentication. Until then, the UI is ready but calls are disabled.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={formState.email} onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength={6}
              required
              value={formState.password}
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          {authError && <p style={{ color: 'var(--color-danger)', margin: 0 }}>{authError}</p>}
          {statusMessage && (
            <p
              style={{
                color: statusTone === 'danger' ? 'var(--color-danger)' : 'var(--color-success)',
                margin: 0
              }}
            >
              {statusMessage}
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            {loading ? 'Working...' : copy.cta}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>or</div>

        <OAuthButtons onSelect={handleOAuth} disabled={disabled} />

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
            setStatusMessage('');
            setStatusTone('success');
          }}
        >
          {copy.toggle}
        </button>
      </div>
    </section>
  );
}

export default AuthPage;
