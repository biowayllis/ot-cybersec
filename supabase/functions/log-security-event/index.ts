import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LogEventRequest {
  userId?: string;
  eventType: string;
  eventDetails?: Record<string, any>;
  success: boolean;
}

// Helper to check for suspicious activity patterns
async function checkForSuspiciousActivity(
  supabaseAdmin: any,
  userId: string | null,
  eventType: string,
  ipAddress: string,
  eventDetails: Record<string, any>
) {
  const suspiciousAlerts: Array<{
    alertType: string;
    alertDetails: string;
  }> = [];

  // Check for multiple failed login attempts (last 15 minutes)
  if (eventType === "login_failed") {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data: recentFailures, error } = await supabaseAdmin
      .from("security_audit_log")
      .select("id")
      .eq("event_type", "login_failed")
      .eq("ip_address", ipAddress)
      .gte("created_at", fifteenMinutesAgo);

    if (!error && recentFailures && recentFailures.length >= 3) {
      suspiciousAlerts.push({
        alertType: "Multiple Failed Login Attempts",
        alertDetails: `${recentFailures.length + 1} failed login attempts detected from your IP address in the last 15 minutes.`,
      });
    }
  }

  // Check for login from new IP address
  if (eventType === "login" && userId) {
    const { data: previousLogins, error } = await supabaseAdmin
      .from("security_audit_log")
      .select("ip_address")
      .eq("user_id", userId)
      .eq("event_type", "login")
      .eq("success", true)
      .neq("ip_address", ipAddress)
      .limit(10);

    if (!error && previousLogins && previousLogins.length > 0) {
      // New IP address detected
      const hasSeenThisIp = previousLogins.some((log: any) => log.ip_address === ipAddress);
      
      if (!hasSeenThisIp) {
        suspiciousAlerts.push({
          alertType: "Login from New Location",
          alertDetails: `A successful login was detected from a new IP address that hasn't been used before.`,
        });
      }
    }
  }

  // Check for unusual login time (between 2 AM - 5 AM)
  if (eventType === "login" && userId) {
    const hour = new Date().getHours();
    if (hour >= 2 && hour < 5) {
      suspiciousAlerts.push({
        alertType: "Unusual Login Time",
        alertDetails: `A login was detected during unusual hours (${hour}:00 AM). This is outside normal business hours.`,
      });
    }
  }

  // Check for rapid successive logins (possible credential stuffing)
  if (eventType === "login" && userId) {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    
    const { data: recentLogins, error } = await supabaseAdmin
      .from("security_audit_log")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", "login")
      .gte("created_at", oneMinuteAgo);

    if (!error && recentLogins && recentLogins.length >= 3) {
      suspiciousAlerts.push({
        alertType: "Rapid Login Attempts",
        alertDetails: `Multiple successful logins detected within a very short time period (${recentLogins.length + 1} in 1 minute).`,
      });
    }
  }

  return suspiciousAlerts;
}

// Helper to send security alert email
async function sendSecurityAlertEmail(
  supabaseAdmin: any,
  userId: string,
  alertType: string,
  alertDetails: string,
  ipAddress: string
) {
  try {
    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (!profile || !profile.email) {
      console.log("No email found for user:", userId);
      return;
    }

    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    // Send email via edge function (don't await to avoid blocking)
    EdgeRuntime.waitUntil(
      fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-security-alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          email: profile.email,
          userName: profile.full_name || profile.email,
          alertType,
          alertDetails,
          timestamp,
          ipAddress,
        }),
      })
    );
  } catch (error) {
    console.error("Error sending security alert email:", error);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, eventType, eventDetails, success }: LogEventRequest = await req.json();

    // Get IP address from request headers
    const ipAddress = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Use service role key to insert regardless of RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get geolocation data for the IP address
    const geoResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/get-geolocation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ ipAddress }),
      }
    );

    const geolocation = await geoResponse.json();
    console.log("Geolocation data:", geolocation);

    const { error } = await supabaseAdmin
      .from("security_audit_log")
      .insert({
        user_id: userId || null,
        event_type: eventType,
        event_details: eventDetails || {},
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        city: geolocation.city,
        country: geolocation.country,
        country_code: geolocation.country_code,
        region: geolocation.region,
        is_high_risk: geolocation.is_high_risk,
      });

    if (error) {
      console.error("Error logging security event:", error);
      return new Response(
        JSON.stringify({ error: "Failed to log event" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for suspicious activity patterns
    const suspiciousAlerts = await checkForSuspiciousActivity(
      supabaseAdmin,
      userId || null,
      eventType,
      ipAddress,
      eventDetails || {}
    );

    // Check for high-risk location login
    if (geolocation.is_high_risk && userId && eventType === "login") {
      suspiciousAlerts.push({
        alertType: "Login from High-Risk Region",
        alertDetails: `A login was detected from ${geolocation.city || 'a location'} in ${geolocation.country || 'a high-risk country'}. This region is flagged for security concerns.`,
      });
    }

    // Send email alerts for suspicious activity (only for events with userId)
    if (suspiciousAlerts.length > 0 && userId) {
      for (const alert of suspiciousAlerts) {
        await sendSecurityAlertEmail(
          supabaseAdmin,
          userId,
          alert.alertType,
          alert.alertDetails,
          ipAddress
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        alertsSent: suspiciousAlerts.length 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in log-security-event function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});