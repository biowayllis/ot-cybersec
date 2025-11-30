import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeofencingCheckRequest {
  userId: string;
  countryCode: string | null;
  city: string | null;
  country: string | null;
}

interface GeofencingCheckResponse {
  allowed: boolean;
  reason?: string;
  ruleMatched?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, countryCode, city, country }: GeofencingCheckRequest = await req.json();

    console.log("Checking geofencing for user:", userId, "from:", countryCode);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // If location is unknown, allow access but log it
    if (!countryCode) {
      console.log("Location unknown, allowing access");
      return new Response(
        JSON.stringify({
          allowed: true,
          reason: "Location could not be determined",
        } as GeofencingCheckResponse),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user has an active exception
    const { data: exceptions, error: exceptionsError } = await supabaseAdmin
      .from("geofencing_exceptions")
      .select("*")
      .eq("user_id", userId)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (!exceptionsError && exceptions && exceptions.length > 0) {
      for (const exception of exceptions) {
        if (exception.country_codes.includes(countryCode)) {
          console.log("User has geofencing exception for this location");
          return new Response(
            JSON.stringify({
              allowed: true,
              reason: "User has a geofencing exception",
            } as GeofencingCheckResponse),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Get active geofencing rules
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from("geofencing_rules")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (rulesError) {
      console.error("Error fetching geofencing rules:", rulesError);
      // If we can't fetch rules, allow access but log error
      return new Response(
        JSON.stringify({
          allowed: true,
          reason: "Could not verify geofencing rules",
        } as GeofencingCheckResponse),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If no rules exist, allow access
    if (!rules || rules.length === 0) {
      console.log("No geofencing rules configured, allowing access");
      return new Response(
        JSON.stringify({
          allowed: true,
        } as GeofencingCheckResponse),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check rules in order (most recent first)
    for (const rule of rules) {
      if (rule.country_codes.includes(countryCode)) {
        if (rule.rule_type === "block") {
          console.log(`Access blocked by rule: ${rule.rule_name}`);
          
          // Get user email for alert
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("email, full_name")
            .eq("id", userId)
            .single();

          if (profile?.email) {
            // Send security alert
            const timestamp = new Date().toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "long",
            });

            await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-security-alert`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
              },
              body: JSON.stringify({
                email: profile.email,
                userName: profile.full_name || profile.email,
                alertType: "Geofencing Violation",
                alertDetails: `Login attempt blocked from ${city || 'unknown city'}, ${country || countryCode}. This location is restricted by geofencing policy: ${rule.rule_name}.`,
                timestamp,
                ipAddress: "Login Attempt",
                location: `${city || 'Unknown'}, ${country || countryCode}`,
              }),
            });
          }

          return new Response(
            JSON.stringify({
              allowed: false,
              reason: `Access from ${country || countryCode} is not permitted`,
              ruleMatched: rule.rule_name,
            } as GeofencingCheckResponse),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } else if (rule.rule_type === "allow") {
          console.log(`Access allowed by rule: ${rule.rule_name}`);
          return new Response(
            JSON.stringify({
              allowed: true,
              ruleMatched: rule.rule_name,
            } as GeofencingCheckResponse),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // If no rule matched, check if there are any "allow" rules
    // If allow rules exist and none matched, block access
    const hasAllowRules = rules.some(rule => rule.rule_type === "allow");
    if (hasAllowRules) {
      console.log("No allow rule matched, blocking access");
      
      // Get user email for alert
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (profile?.email) {
        // Send security alert for unusual location
        const timestamp = new Date().toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "long",
        });

        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-security-alert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
          body: JSON.stringify({
            email: profile.email,
            userName: profile.full_name || profile.email,
            alertType: "Unusual Login Location",
            alertDetails: `Login attempt from unusual location: ${city || 'unknown city'}, ${country || countryCode}. This location is not in the allowed regions list.`,
            timestamp,
            ipAddress: "Login Attempt",
            location: `${city || 'Unknown'}, ${country || countryCode}`,
          }),
        });
      }

      return new Response(
        JSON.stringify({
          allowed: false,
          reason: `Access from ${country || countryCode} is not in the allowed regions`,
        } as GeofencingCheckResponse),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // No rules matched, allow by default
    console.log("No rules matched, allowing access by default");
    return new Response(
      JSON.stringify({
        allowed: true,
      } as GeofencingCheckResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in check-geofencing function:", error);
    return new Response(
      JSON.stringify({ 
        allowed: true, // Fail open to prevent lockout
        reason: "Error checking geofencing rules",
        error: error.message 
      }),
      {
        status: 200, // Return 200 to not break login flow
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});