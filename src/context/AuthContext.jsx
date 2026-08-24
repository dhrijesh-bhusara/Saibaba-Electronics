import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = (email, password, fullName) => {
    if (!supabase) return Promise.resolve({ data: null, error: new Error('Supabase is not configured.') });
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  };

  const signIn = (email, password) => {
    if (!supabase) return Promise.resolve({ data: null, error: new Error('Supabase is not configured.') });
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = () => supabase ? supabase.auth.signOut() : Promise.resolve({ error: null });

  return <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, isAuthModalOpen, openAuthModal: () => setIsAuthModalOpen(true), closeAuthModal: () => setIsAuthModalOpen(false), signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
