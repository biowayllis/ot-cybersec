import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// High-risk countries based on common security threat lists
const HIGH_RISK_COUNTRIES = [
  "KP", // North Korea
  "IR", // Iran
  "SY", // Syria
  "CU", // Cuba
  "SD", // Sudan
  "SO", // Somalia
  "YE", // Yemen
  "AF", // Afghanistan
  "IQ", // Iraq
  "LY", // Libya
];

interface GeolocationData {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  is_high_risk: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ipAddress } = await req.json();

    if (!ipAddress || ipAddress === "unknown") {
      return new Response(
        JSON.stringify({
          latitude: null,
          longitude: null,
          city: null,
          country: null,
          country_code: null,
          region: null,
          is_high_risk: false,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Looking up geolocation for IP:", ipAddress);

    // Use ipapi.co for geolocation (free tier, no API key needed)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        "User-Agent": "Lovable-Supabase-Function/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if it's an error response
    if (data.error) {
      console.error("Geolocation lookup error:", data.reason);
      return new Response(
        JSON.stringify({
          latitude: null,
          longitude: null,
          city: null,
          country: null,
          country_code: null,
          region: null,
          is_high_risk: false,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const countryCode = data.country_code || null;
    const isHighRisk = countryCode ? HIGH_RISK_COUNTRIES.includes(countryCode) : false;

    const geolocation: GeolocationData = {
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      city: data.city || null,
      country: data.country_name || null,
      country_code: countryCode,
      region: data.region || null,
      is_high_risk: isHighRisk,
    };

    console.log("Geolocation result:", geolocation);

    return new Response(JSON.stringify(geolocation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-geolocation function:", error);
    return new Response(
      JSON.stringify({
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        country_code: null,
        region: null,
        is_high_risk: false,
        error: error.message,
      }),
      {
        status: 200, // Return 200 to not break the logging flow
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});