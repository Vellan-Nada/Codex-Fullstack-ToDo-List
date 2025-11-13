import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import supabase from '../lib/supabaseClient.js';
import { apiClient } from '../lib/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const hasSupabase = Boolean(supabase);

  useEffect(() => {
    if (!hasSupabase) {
      setInitializing(false);
      return;
    }

    const bootstrap = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await resolvePlan(currentSession);
      }
      setInitializing(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        await resolvePlan(nextSession);
      } else {
        setPlan('free');
      }
    });

    bootstrap();

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [hasSupabase]);

  const resolvePlan = async (activeSession) => {
    try {
      const payload = await apiClient.fetchProfile({
        token: activeSession?.access_token,
        userId: activeSession?.user?.id
      });
      if (payload?.plan) {
        setPlan(payload.plan);
      } else {
        setPlan('free');
      }
    } catch (error) {
      console.warn('[AuthProvider] failed to hydrate plan', error);
    }
  };

  const ensureSupabase = () => {
    if (!hasSupabase) {
      throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
  };

  const signInWithEmail = async ({ email, password }) => {
    ensureSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    setAuthError(null);
    await resolvePlan(data.session);
    return data.session;
  };

  const signUpWithEmail = async ({ email, password }) => {
    ensureSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    setAuthError(null);
    return data.user;
  };

  const signInWithProvider = async (provider) => {
    ensureSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + '/dashboard' } });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    if (!hasSupabase) {
      setSession(null);
      setUser(null);
      setPlan('free');
      return;
    }
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (!session?.user) return;
    await resolvePlan(session);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      plan,
      initializing,
      authError,
      signInWithEmail,
      signUpWithEmail,
      signInWithProvider,
      signOut,
      refreshProfile,
      hasSupabase
    }),
    [session, user, plan, initializing, authError, hasSupabase]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within the AuthProvider');
  }
  return ctx;
};
