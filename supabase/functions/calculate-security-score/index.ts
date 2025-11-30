import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityScore {
  totalScore: number;
  maxScore: number;
  breakdown: {
    twoFactor: { score: number; maxScore: number; enabled: boolean };
    passwordAge: { score: number; maxScore: number; daysOld: number };
    trustedDevices: { score: number; maxScore: number; trustedCount: number; totalCount: number };
    activeSessions: { score: number; maxScore: number; sessionCount: number };
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
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

    const score: SecurityScore = {
      totalScore: 0,
      maxScore: 100,
      breakdown: {
        twoFactor: { score: 0, maxScore: 30, enabled: false },
        passwordAge: { score: 0, maxScore: 25, daysOld: 0 },
        trustedDevices: { score: 0, maxScore: 30, trustedCount: 0, totalCount: 0 },
        activeSessions: { score: 0, maxScore: 15, sessionCount: 0 },
      },
      riskLevel: 'high',
      recommendations: [],
    };

    // Check 2FA status
    const { data: twoFactorData } = await supabaseClient
      .from('user_2fa')
      .select('enabled')
      .eq('user_id', user.id)
      .maybeSingle();

    if (twoFactorData?.enabled) {
      score.breakdown.twoFactor.score = 30;
      score.breakdown.twoFactor.enabled = true;
    } else {
      score.recommendations.push('Enable two-factor authentication for enhanced security');
    }

    // Check password age
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('password_changed_at')
      .eq('id', user.id)
      .single();

    if (profileData?.password_changed_at) {
      const passwordDate = new Date(profileData.password_changed_at);
      const daysSinceChange = Math.floor((Date.now() - passwordDate.getTime()) / (1000 * 60 * 60 * 24));
      score.breakdown.passwordAge.daysOld = daysSinceChange;

      if (daysSinceChange <= 30) {
        score.breakdown.passwordAge.score = 25;
      } else if (daysSinceChange <= 60) {
        score.breakdown.passwordAge.score = 15;
        score.recommendations.push('Consider changing your password - it has been over 30 days');
      } else if (daysSinceChange <= 90) {
        score.breakdown.passwordAge.score = 5;
        score.recommendations.push('Change your password soon - it will expire at 90 days');
      } else {
        score.breakdown.passwordAge.score = 0;
        score.recommendations.push('Your password has expired - change it immediately');
      }
    }

    // Check trusted devices
    const { data: devicesData } = await supabaseClient
      .from('user_devices')
      .select('is_trusted');

    if (devicesData) {
      const trustedCount = devicesData.filter(d => d.is_trusted).length;
      score.breakdown.trustedDevices.trustedCount = trustedCount;
      score.breakdown.trustedDevices.totalCount = devicesData.length;

      if (trustedCount > 0) {
        score.breakdown.trustedDevices.score = 20;
      }

      // Check for recent new devices (last 7 days)
      const { data: recentDevices } = await supabaseClient
        .from('user_devices')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!recentDevices || recentDevices.length === 0) {
        score.breakdown.trustedDevices.score += 10;
      } else {
        score.recommendations.push('Review recent device logins and mark trusted devices');
      }
    }

    // Check active sessions
    const { data: sessionsData } = await supabaseClient
      .from('user_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_revoked', false);

    if (sessionsData) {
      const sessionCount = sessionsData.length;
      score.breakdown.activeSessions.sessionCount = sessionCount;

      if (sessionCount === 1) {
        score.breakdown.activeSessions.score = 15;
      } else if (sessionCount <= 3) {
        score.breakdown.activeSessions.score = 10;
      } else {
        score.breakdown.activeSessions.score = 5;
        score.recommendations.push('You have multiple active sessions - consider revoking unused ones');
      }
    }

    // Calculate total score
    score.totalScore = 
      score.breakdown.twoFactor.score +
      score.breakdown.passwordAge.score +
      score.breakdown.trustedDevices.score +
      score.breakdown.activeSessions.score;

    // Determine risk level
    if (score.totalScore >= 80) {
      score.riskLevel = 'low';
    } else if (score.totalScore >= 50) {
      score.riskLevel = 'medium';
    } else {
      score.riskLevel = 'high';
    }

    console.log('Security score calculated:', score);

    return new Response(
      JSON.stringify(score),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-security-score function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
