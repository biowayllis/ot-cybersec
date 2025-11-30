import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useSessionValidation = (userId: string | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    // Check session validity every 30 seconds
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Check if session is revoked
        const { data: sessionData, error } = await supabase
          .from('user_sessions')
          .select('is_revoked')
          .eq('session_token', session.access_token)
          .maybeSingle();

        if (error) {
          console.error('Error checking session:', error);
          return;
        }

        if (sessionData?.is_revoked) {
          console.log('Session has been revoked, signing out...');
          await supabase.auth.signOut();
          navigate('/auth');
        }
      } catch (error) {
        console.error('Session validation error:', error);
      }
    };

    // Check immediately
    checkSession();

    // Set up interval
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [userId, navigate]);
};
