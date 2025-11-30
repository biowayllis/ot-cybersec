import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const CyberPostureScore = () => {
  const score = 87;
  const itScore = 89;
  const otScore = 85;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          ICSCore IT + OT Cyber Posture Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary">{score}</div>
            <p className="text-sm text-muted-foreground mt-2">Overall Security Score</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-semibold text-safe">{itScore}</div>
              <p className="text-xs text-muted-foreground mt-1">IT Security</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-medium">{otScore}</div>
              <p className="text-xs text-muted-foreground mt-1">OT Security</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
