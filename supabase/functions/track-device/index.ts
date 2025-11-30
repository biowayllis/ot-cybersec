import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackDeviceRequest {
  userId: string;
  deviceFingerprint: string;
  sessionToken: string;
  deviceInfo: {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    deviceType: string;
    screenResolution: string;
    timezone: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      userId,
      deviceFingerprint,
      sessionToken,
      deviceInfo,
    }: TrackDeviceRequest = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check if device exists
    const { data: existingDevice, error: fetchError } = await supabaseAdmin
      .from("user_devices")
      .select("*")
      .eq("user_id", userId)
      .eq("device_fingerprint", deviceFingerprint)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching device:", fetchError);
      throw fetchError;
    }

    let isNewDevice = false;
    let deviceId = existingDevice?.id;

    if (existingDevice) {
      // Update last_used_at for existing device
      const { error: updateError } = await supabaseAdmin
        .from("user_devices")
        .update({ 
          last_used_at: new Date().toISOString(),
        })
        .eq("id", existingDevice.id);

      if (updateError) {
        console.error("Error updating device:", updateError);
        throw updateError;
      }

      console.log('Updated existing device:', existingDevice.id);
    } else {
      // Create new device record
      isNewDevice = true;
      
      const { data: newDevice, error: insertError } = await supabaseAdmin
        .from("user_devices")
        .insert({
          user_id: userId,
          device_fingerprint: deviceFingerprint,
          device_name: `${deviceInfo.browser} on ${deviceInfo.os}`,
          browser: deviceInfo.browser,
          browser_version: deviceInfo.browserVersion,
          os: deviceInfo.os,
          os_version: deviceInfo.osVersion,
          device_type: deviceInfo.deviceType,
          screen_resolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
          is_trusted: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting device:", insertError);
        throw insertError;
      }

      deviceId = newDevice.id;
      console.log('Inserted new device:', deviceId);

      // Send alert for new device
      try {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("email, full_name")
          .eq("id", userId)
          .single();

        if (profile && profile.email) {
          const timestamp = new Date().toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "long",
          });

          const ipAddress = req.headers.get("x-forwarded-for") || 
                           req.headers.get("x-real-ip") || 
                           "unknown";

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
                alertType: "New Device Login",
                alertDetails: `A login was detected from a new device: ${deviceInfo.deviceType} running ${deviceInfo.os} with ${deviceInfo.browser} browser. If this wasn't you, please secure your account immediately.`,
                timestamp,
                ipAddress,
              }),
            })
          );
        }
      } catch (emailError) {
        console.error("Error sending new device alert:", emailError);
      }
    }

    // Create or update session for this device
    const { error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .upsert({
        user_id: userId,
        device_id: deviceId,
        session_token: sessionToken,
        last_active_at: new Date().toISOString(),
      }, {
        onConflict: 'session_token',
      });

    if (sessionError) {
      console.error('Error creating/updating session:', sessionError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        isNewDevice,
        isTrusted: existingDevice?.is_trusted || false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in track-device function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
