import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionValidation } from "@/hooks/useSessionValidation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  passwordExpired: boolean;
  daysUntilExpiry: number | null;
  checkPasswordExpiry: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordExpired, setPasswordExpired] = useState(false);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null);
  const navigate = useNavigate();

  // Validate session for revocation
  useSessionValidation(user?.id);

  const checkPasswordExpiry = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-password-expiry');
      
      if (error) throw error;
      
      setPasswordExpired(data.isExpired);
      setDaysUntilExpiry(data.daysUntilExpiry);
    } catch (error) {
      console.error('Error checking password expiry:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check password expiry on auth state change
        if (session?.user) {
          setTimeout(() => {
            checkPasswordExpiry();
          }, 0);
        }

        // Redirect authenticated users away from auth page
        if (session && window.location.pathname === '/auth') {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          checkPasswordExpiry();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    const userId = user?.id;
    await supabase.auth.signOut();
    
    // Log logout event
    if (userId) {
      await supabase.functions.invoke('log-security-event', {
        body: {
          userId: userId,
          eventType: 'logout',
          eventDetails: {},
          success: true,
        },
      });
    }
    
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, passwordExpired, daysUntilExpiry, checkPasswordExpiry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
