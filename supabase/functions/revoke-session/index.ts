import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RevokeSessionRequest {
  sessionId?: string;
  revokeAllOthers?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { sessionId, revokeAllOthers }: RevokeSessionRequest = await req.json();
    
    // Get current session token
    const authHeader = req.headers.get('Authorization');
    const currentToken = authHeader?.replace('Bearer ', '');

    if (revokeAllOthers) {
      // Revoke all sessions except the current one
      const { error: revokeError } = await supabaseClient
        .from('user_sessions')
        .update({ is_revoked: true })
        .eq('user_id', user.id)
        .neq('session_token', currentToken || '');

      if (revokeError) {
        console.error('Error revoking all other sessions:', revokeError);
        throw revokeError;
      }

      console.log(`Revoked all other sessions for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All other sessions have been revoked' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (sessionId) {
      // Revoke specific session
      const { error: revokeError } = await supabaseClient
        .from('user_sessions')
        .update({ is_revoked: true })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (revokeError) {
        console.error('Error revoking session:', revokeError);
        throw revokeError;
      }

      console.log(`Revoked session ${sessionId} for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Session has been revoked' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'sessionId or revokeAllOthers parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in revoke-session function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
