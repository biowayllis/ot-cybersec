import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";
import { authenticator } from "npm:otplib@12.0.1";
import QRCode from "npm:qrcode@1.5.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate a new secret
    const secret = authenticator.generateSecret();
    
    // Get user email for TOTP label
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const email = profile?.email || user.email || "user";
    
    // Generate OTP auth URL
    const otpauth = authenticator.keyuri(email, "CyberGuard", secret);
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth);

    // Generate recovery codes (10 codes)
    const recoveryCodes = Array.from({ length: 10 }, () => 
      Array.from({ length: 8 }, () => 
        Math.random().toString(36).charAt(2)
      ).join("").toUpperCase()
    );

    // Store in database (not enabled yet)
    const { error: insertError } = await supabaseClient
      .from("user_2fa")
      .upsert({
        user_id: user.id,
        secret,
        enabled: false,
        recovery_codes: recoveryCodes,
      });

    if (insertError) {
      console.error("Error storing 2FA data:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to setup 2FA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        secret,
        qrCode,
        recoveryCodes,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in setup-2fa function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});