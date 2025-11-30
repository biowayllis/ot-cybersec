import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Find users whose passwords will expire in 7 days and haven't been notified recently
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, password_changed_at, password_expiry_notified_at')
      .not('password_changed_at', 'is', null)
      .lt('password_changed_at', new Date(Date.now() - 83 * 24 * 60 * 60 * 1000).toISOString()) // 83 days ago (7 days before expiry)
      .or('password_expiry_notified_at.is.null,password_expiry_notified_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Not notified in last 24 hours

    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${profiles?.length || 0} users to notify about password expiry`);

    // Send notification emails
    const notifications = await Promise.all(
      (profiles || []).map(async (profile) => {
        try {
          const passwordChangedAt = new Date(profile.password_changed_at);
          const expiryDate = new Date(passwordChangedAt.getTime() + 90 * 24 * 60 * 60 * 1000);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

          await resend.emails.send({
            from: 'Security Alert <onboarding@resend.dev>',
            to: [profile.email],
            subject: 'Password Expiration Notice',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e53e3e;">Password Expiration Notice</h2>
                <p>Hello ${profile.full_name || profile.email},</p>
                <p>This is a reminder that your password will expire in <strong>${daysUntilExpiry} days</strong>.</p>
                <p>For security reasons, we require all users to change their passwords every 90 days.</p>
                <p><strong>Please change your password before it expires to avoid being locked out of your account.</strong></p>
                <p>To change your password:</p>
                <ol>
                  <li>Log in to your account</li>
                  <li>Go to your Profile page</li>
                  <li>Update your password in the security settings</li>
                </ol>
                <p>If you have any questions, please contact our support team.</p>
                <p style="margin-top: 30px; color: #666; font-size: 12px;">
                  This is an automated security notification. Please do not reply to this email.
                </p>
              </div>
            `,
          });

          // Update notification timestamp
          await supabaseAdmin
            .from('profiles')
            .update({ password_expiry_notified_at: new Date().toISOString() })
            .eq('id', profile.id);

          console.log(`Sent password expiry notification to ${profile.email}`);
          return { success: true, email: profile.email };
        } catch (error) {
          console.error(`Error sending notification to ${profile.email}:`, error);
          return { success: false, email: profile.email, error: error.message };
        }
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true,
        notificationsSent: notifications.filter(n => n.success).length,
        notificationsFailed: notifications.filter(n => !n.success).length,
        details: notifications,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in notify-password-expiry function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
