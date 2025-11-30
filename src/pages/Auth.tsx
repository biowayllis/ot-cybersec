import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Lock, Mail, User, ArrowRight, ShieldCheck, Globe, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { TwoFactorVerification } from "@/components/TwoFactorVerification";
import { ICSCoreLogo } from "@/components/WayllisLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import criticalInfrastructureBg from "@/assets/critical-infrastructure-bg.jpg";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100),
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = authSchema.parse(formData);
      
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validated.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      await supabase.functions.invoke('log-security-event', {
        body: {
          userId: null,
          eventType: 'signup',
          eventDetails: { email: validated.email },
          success: true,
        },
      });

      toast.success("Account created successfully! You can now sign in.");
      setFormData({ email: "", password: "", fullName: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during sign up");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = authSchema.pick({ email: true, password: true }).parse(formData);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        await supabase.functions.invoke('log-security-event', {
          body: {
            userId: null,
            eventType: 'login_failed',
            eventDetails: { email: validated.email, reason: error.message },
            success: false,
          },
        });

        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        const geoResponse = await supabase.functions.invoke('get-geolocation', {
          body: { ipAddress: 'current' }
        });

        const geolocation = geoResponse.data;
        
        const geofencingResponse = await supabase.functions.invoke('check-geofencing', {
          body: {
            userId: data.user.id,
            countryCode: geolocation?.country_code || null,
            city: geolocation?.city || null,
            country: geolocation?.country || null,
          }
        });

        const geofencingResult = geofencingResponse.data;

        if (!geofencingResult?.allowed) {
          await supabase.auth.signOut();
          
          await supabase.functions.invoke('log-security-event', {
            body: {
              userId: data.user.id,
              eventType: 'login_blocked_geofencing',
              eventDetails: { 
                email: validated.email, 
                reason: geofencingResult?.reason,
                location: `${geolocation?.city || 'Unknown'}, ${geolocation?.country || 'Unknown'}`
              },
              success: false,
            },
          });

          toast.error(`Access denied: ${geofencingResult?.reason || 'Your location is not permitted'}`);
          setLoading(false);
          return;
        }

        const { data: twoFactorData } = await supabase
          .from('user_2fa')
          .select('enabled')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (twoFactorData?.enabled) {
          await supabase.auth.signOut();
          setPendingUserId(data.user.id);
          setShow2FA(true);
          setLoading(false);
          return;
        }
      }

      await supabase.functions.invoke('log-security-event', {
        body: {
          userId: data.user?.id,
          eventType: 'login',
          eventDetails: { email: validated.email },
          success: true,
        },
      });

      const { getDeviceFingerprint } = await import('@/lib/deviceFingerprint');
      const deviceInfo = await getDeviceFingerprint();
      const { data: { session } } = await supabase.auth.getSession();
      
      await supabase.functions.invoke('track-device', {
        body: {
          userId: data.user?.id,
          deviceFingerprint: deviceInfo.fingerprint,
          sessionToken: session?.access_token || '',
          deviceInfo: {
            browser: deviceInfo.browser,
            browserVersion: deviceInfo.browserVersion,
            os: deviceInfo.os,
            osVersion: deviceInfo.osVersion,
            deviceType: deviceInfo.deviceType,
            screenResolution: deviceInfo.screenResolution,
            timezone: deviceInfo.timezone,
          },
        },
      });

      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerified = async () => {
    if (!pendingUserId) return;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error("Authentication failed. Please try again.");
      setShow2FA(false);
      setPendingUserId(null);
      return;
    }

    await supabase.functions.invoke('log-security-event', {
      body: {
        userId: data.user?.id,
        eventType: 'login',
        eventDetails: { email: formData.email, with_2fa: true },
        success: true,
      },
    });

    const { getDeviceFingerprint } = await import('@/lib/deviceFingerprint');
    const deviceInfo = await getDeviceFingerprint();
    const { data: { session } } = await supabase.auth.getSession();
    
    await supabase.functions.invoke('track-device', {
      body: {
        userId: data.user?.id,
        deviceFingerprint: deviceInfo.fingerprint,
        sessionToken: session?.access_token || '',
        deviceInfo: {
          browser: deviceInfo.browser,
          browserVersion: deviceInfo.browserVersion,
          os: deviceInfo.os,
          osVersion: deviceInfo.osVersion,
          deviceType: deviceInfo.deviceType,
          screenResolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
        },
      },
    });

    toast.success("Successfully signed in!");
    navigate("/");
  };

  if (show2FA && pendingUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <TwoFactorVerification
          userId={pendingUserId}
          onVerified={handle2FAVerified}
          onCancel={() => {
            setShow2FA(false);
            setPendingUserId(null);
            setFormData({ ...formData, password: "" });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel - Hero Section with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${criticalInfrastructureBg})` }}
        />
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50" />
        
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <ICSCoreLogo size="lg" className="mb-8" />
          
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 leading-tight">
            Security Portal
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            Integrated Cyber Defense Platform for unified IT & OT security operations
          </p>

          {/* Feature highlights */}
          <div className="space-y-6">
            <FeatureItem 
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Enterprise-Grade Security"
              description="Multi-factor authentication & role-based access control"
            />
            <FeatureItem 
              icon={<Globe className="h-5 w-5" />}
              title="Geofencing Protection"
              description="Location-based access restrictions for enhanced security"
            />
            <FeatureItem 
              icon={<Fingerprint className="h-5 w-5" />}
              title="Device Tracking"
              description="Monitor and manage trusted devices across your organization"
            />
          </div>
        </div>

        {/* Bottom decoration line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <ICSCoreLogo size="md" />
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome back
                </h2>
                <p className="text-muted-foreground">
                  Sign in to access your security dashboard
                </p>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger 
                    value="signin"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-foreground/80">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="analyst@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          maxLength={255}
                          className="pl-10 bg-input/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-foreground/80">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={8}
                          maxLength={100}
                          className="pl-10 bg-input/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium group transition-all duration-300" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground/80">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          maxLength={100}
                          className="pl-10 bg-input/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground/80">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="analyst@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          maxLength={255}
                          className="pl-10 bg-input/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground/80">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={8}
                          maxLength={100}
                          className="pl-10 bg-input/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground pl-1">
                        At least 8 characters
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium group transition-all duration-300" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Account
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* CISO Notice */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Contact your CISO to be assigned a security team role after registration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Powered by ICSCore Systems • Unified IT + OT Security
          </p>
        </div>
      </div>
    </div>
  );
};

// Feature item component for the hero section
const FeatureItem = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="flex items-start gap-4 group">
    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
      <span className="text-primary">{icon}</span>
    </div>
    <div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Auth;
