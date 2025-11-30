import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const verifySchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

interface TwoFactorVerificationProps {
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const TwoFactorVerification = ({ userId, onVerified, onCancel }: TwoFactorVerificationProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const verify2FA = async (values: z.infer<typeof verifySchema>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-2fa", {
        body: { 
          token: values.code,
          userId: userId,
        },
      });

      if (error) throw error;

      if (data.valid) {
        // Log successful 2FA verification
        await supabase.functions.invoke('log-security-event', {
          body: {
            userId: userId,
            eventType: '2fa_verified',
            eventDetails: { used_recovery_code: data.usedRecoveryCode },
            success: true,
          },
        });

        toast({
          title: "Verified",
          description: data.usedRecoveryCode 
            ? "Recovery code accepted. Please secure your account." 
            : "2FA code verified successfully",
        });
        onVerified();
      } else {
        // Log failed 2FA verification
        await supabase.functions.invoke('log-security-event', {
          body: {
            userId: userId,
            eventType: '2fa_verification_failed',
            eventDetails: {},
            success: false,
          },
        });

        toast({
          title: "Error",
          description: "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app or a recovery code
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
                      <InputOTP maxLength={8} {...field}>
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
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You can also enter an 8-character recovery code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};