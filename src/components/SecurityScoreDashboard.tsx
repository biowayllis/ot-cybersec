import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'text-green-500';
    case 'medium':
      return 'text-orange-500';
    case 'high':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'low':
      return ShieldCheck;
    case 'medium':
      return Shield;
    case 'high':
      return ShieldAlert;
    default:
      return Shield;
  }
};

const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (level) {
    case 'low':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'high':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const SecurityScoreDashboard = () => {
  const navigate = useNavigate();

  const { data: score, isLoading } = useQuery<SecurityScore>({
    queryKey: ["security-score"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("calculate-security-score");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!score) {
    return null;
  }

  const RiskIcon = getRiskIcon(score.riskLevel);
  const scorePercentage = (score.totalScore / score.maxScore) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RiskIcon className={`h-6 w-6 ${getRiskColor(score.riskLevel)}`} />
                Security Score
              </CardTitle>
              <CardDescription>
                Your overall security posture assessment
              </CardDescription>
            </div>
            <Badge variant={getRiskBadgeVariant(score.riskLevel)} className="text-lg px-4 py-2">
              {score.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{score.totalScore}</span>
              <span className="text-muted-foreground">out of {score.maxScore}</span>
            </div>
            <Progress value={scorePercentage} className="h-3" />
          </div>

          {score.recommendations.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommendations to improve your security:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {score.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {score.totalScore >= 80 && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Excellent! Your security posture is strong. Keep up the good practices.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Two-Factor Authentication
              {score.breakdown.twoFactor.enabled ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">
                  {score.breakdown.twoFactor.score} / {score.breakdown.twoFactor.maxScore}
                </span>
              </div>
              <Progress 
                value={(score.breakdown.twoFactor.score / score.breakdown.twoFactor.maxScore) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {score.breakdown.twoFactor.enabled
                  ? "2FA is enabled and protecting your account"
                  : "Enable 2FA to add an extra layer of security"}
              </p>
              {!score.breakdown.twoFactor.enabled && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate('/profile')}
                >
                  Enable 2FA
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Age */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Password Age
              <Info className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">
                  {score.breakdown.passwordAge.score} / {score.breakdown.passwordAge.maxScore}
                </span>
              </div>
              <Progress 
                value={(score.breakdown.passwordAge.score / score.breakdown.passwordAge.maxScore) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Password last changed {score.breakdown.passwordAge.daysOld} days ago
                {score.breakdown.passwordAge.daysOld > 60 && " (change recommended)"}
              </p>
              {score.breakdown.passwordAge.daysOld > 60 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate('/profile')}
                >
                  Change Password
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trusted Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Trusted Devices
              <Info className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">
                  {score.breakdown.trustedDevices.score} / {score.breakdown.trustedDevices.maxScore}
                </span>
              </div>
              <Progress 
                value={(score.breakdown.trustedDevices.score / score.breakdown.trustedDevices.maxScore) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {score.breakdown.trustedDevices.trustedCount} of {score.breakdown.trustedDevices.totalCount} devices marked as trusted
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/profile')}
              >
                Manage Devices
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Active Sessions
              <Info className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">
                  {score.breakdown.activeSessions.score} / {score.breakdown.activeSessions.maxScore}
                </span>
              </div>
              <Progress 
                value={(score.breakdown.activeSessions.score / score.breakdown.activeSessions.maxScore) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {score.breakdown.activeSessions.sessionCount} active session{score.breakdown.activeSessions.sessionCount !== 1 ? 's' : ''}
                {score.breakdown.activeSessions.sessionCount > 3 && " (review recommended)"}
              </p>
              {score.breakdown.activeSessions.sessionCount > 1 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate('/profile')}
                >
                  Review Sessions
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
