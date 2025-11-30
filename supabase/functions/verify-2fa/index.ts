import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";
import { authenticator } from "npm:otplib@12.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, userId } = await req.json();

    if (!token || !userId) {
      return new Response(
        JSON.stringify({ error: "Token and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get user's 2FA data
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from("user_2fa")
      .select("secret, enabled, recovery_codes")
      .eq("user_id", userId)
      .single();

    if (fetchError || !twoFactorData) {
      console.error("Error fetching 2FA data:", fetchError);
      return new Response(
        JSON.stringify({ error: "2FA not set up for this user" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!twoFactorData.enabled) {
      return new Response(
        JSON.stringify({ error: "2FA not enabled for this user" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if it's a recovery code
    const isRecoveryCode = twoFactorData.recovery_codes?.includes(token);
    
    let isValid = false;
    
    if (isRecoveryCode) {
      // Remove used recovery code
      const updatedCodes = twoFactorData.recovery_codes.filter(
        (code: string) => code !== token
      );
      
      await supabaseClient
        .from("user_2fa")
        .update({ recovery_codes: updatedCodes })
        .eq("user_id", userId);
      
      isValid = true;
    } else {
      // Verify TOTP token
      isValid = authenticator.verify({
        token,
        secret: twoFactorData.secret,
      });
    }

    return new Response(
      JSON.stringify({ 
        valid: isValid,
        usedRecoveryCode: isRecoveryCode 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in verify-2fa function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});