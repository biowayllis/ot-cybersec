import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get password expiry status using the database function
    const { data: expiryData, error: expiryError } = await supabaseClient
      .rpc('is_password_expired', { user_id: user.id });

    if (expiryError) {
      console.error('Error checking password expiry:', expiryError);
      throw expiryError;
    }

    // Get days until expiry
    const { data: daysData, error: daysError } = await supabaseClient
      .rpc('days_until_password_expires', { user_id: user.id });

    if (daysError) {
      console.error('Error getting days until expiry:', daysError);
      throw daysError;
    }

    return new Response(
      JSON.stringify({ 
        isExpired: expiryData,
        daysUntilExpiry: daysData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-password-expiry function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
