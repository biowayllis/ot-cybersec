import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { SecurityAlertEmail } from "./_templates/security-alert.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecurityAlertRequest {
  email: string;
  userName: string;
  alertType: string;
  alertDetails: string;
  timestamp: string;
  ipAddress: string;
  location?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      email,
      userName,
      alertType,
      alertDetails,
      timestamp,
      ipAddress,
      location,
    }: SecurityAlertRequest = await req.json();

    console.log("Sending security alert email to:", email);

    const html = await renderAsync(
      React.createElement(SecurityAlertEmail, {
        userName,
        alertType,
        alertDetails,
        timestamp,
        ipAddress,
        location,
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Security Alerts <onboarding@resend.dev>",
      to: [email],
      subject: `🔒 Security Alert: ${alertType}`,
      html,
    });

    console.log("Security alert email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-security-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});