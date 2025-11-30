import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
}

export const TwoFactorSetup = ({ onSetupComplete }: TwoFactorSetupProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showVerification, setShowVerification] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const setup2FA = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-2fa");

      if (error) throw error;

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setRecoveryCodes(data.recoveryCodes);
      setShowVerification(true);

      // Log 2FA setup initiated
      await supabase.functions.invoke('log-security-event', {
        body: {
          eventType: '2fa_setup',
          eventDetails: {},
          success: true,
        },
      });

      toast({
        title: "2FA Setup Initiated",
        description: "Scan the QR code with your authenticator app",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to setup 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (values: z.infer<typeof verifySchema>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("enable-2fa", {
        body: { token: values.code },
      });

      if (error) throw error;

      if (data.success) {
        // Log 2FA enabled
        await supabase.functions.invoke('log-security-event', {
          body: {
            eventType: '2fa_enabled',
            eventDetails: {},
            success: true,
          },
        });

        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been enabled successfully",
        });
        onSetupComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'codes') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
    toast({
      title: "Copied",
      description: type === 'secret' ? "Secret key copied" : "Recovery codes copied",
    });
  };

  const downloadRecoveryCodes = () => {
    const content = `CyberGuard 2FA Recovery Codes\n\n${recoveryCodes.join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cyberguard-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Recovery codes have been downloaded",
    });
  };

  if (!showVerification) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account using an authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={setup2FA} disabled={loading}>
            {loading ? "Setting up..." : "Setup 2FA"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qrCode && (
            <div className="flex flex-col items-center gap-4">
              <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
              
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2">
                  Or enter this key manually:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                    {secret}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(secret!, 'secret')}
                  >
                    {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Codes</CardTitle>
          <CardDescription>
            Save these recovery codes in a safe place. Each code can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              These codes can be used to access your account if you lose your authenticator device.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
            {recoveryCodes.map((code, index) => (
              <div key={index}>{code}</div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadRecoveryCodes}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Codes
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'codes')}
              className="flex-1"
            >
              {copiedCodes ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy Codes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify Setup</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to complete setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(verify2FA)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Verifying..." : "Enable 2FA"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};