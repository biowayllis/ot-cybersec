import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ControlValidation = () => {
  const validationScore = 91;
  
  const controls = [
    {
      category: "Network Security",
      passed: 45,
      failed: 3,
      warnings: 2,
      total: 50,
    },
    {
      category: "Endpoint Protection",
      passed: 38,
      failed: 1,
      warnings: 3,
      total: 42,
    },
    {
      category: "Access Control",
      passed: 52,
      failed: 2,
      warnings: 4,
      total: 58,
    },
    {
      category: "Data Protection",
      passed: 31,
      failed: 0,
      warnings: 2,
      total: 33,
    },
  ];

  const recentTests = [
    {
      test: "SQL Injection Attack Simulation",
      result: "passed",
      timestamp: "2 hours ago",
    },
    {
      test: "Phishing Email Detection",
      result: "passed",
      timestamp: "4 hours ago",
    },
    {
      test: "Lateral Movement Detection",
      result: "warning",
      timestamp: "6 hours ago",
    },
    {
      test: "Data Exfiltration Prevention",
      result: "failed",
      timestamp: "8 hours ago",
    },
  ];

  const resultConfig: Record<string, { color: string; icon: any; bgClass: string }> = {
    passed: { color: "text-safe", icon: CheckCircle2, bgClass: "bg-safe/10 border-safe/20" },
    failed: { color: "text-critical", icon: XCircle, bgClass: "bg-critical/10 border-critical/20" },
    warning: { color: "text-medium", icon: AlertTriangle, bgClass: "bg-medium/10 border-medium/20" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          IT Control Validation Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-safe/10 to-safe/5 rounded-lg border border-safe/20">
          <div className="text-5xl font-bold text-safe mb-2">{validationScore}%</div>
          <div className="text-sm text-muted-foreground">IT Security Controls Passing</div>
        </div>

        <div className="space-y-4">
          {controls.map((control) => {
            const passRate = (control.passed / control.total) * 100;
            return (
              <div key={control.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{control.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {control.passed}/{control.total}
                  </span>
                </div>
                
                <Progress value={passRate} className="h-2" />
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-safe">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{control.passed} Passed</span>
                  </div>
                  <div className="flex items-center gap-1 text-medium">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{control.warnings} Warnings</span>
                  </div>
                  <div className="flex items-center gap-1 text-critical">
                    <XCircle className="h-3 w-3" />
                    <span>{control.failed} Failed</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="text-sm font-medium mb-3">Recent BAS Test Results</div>
          <div className="space-y-2">
            {recentTests.map((test, index) => {
              const config = resultConfig[test.result];
              const ResultIcon = config.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded border ${config.bgClass}`}
                >
                  <div className="flex items-center gap-2">
                    <ResultIcon className={`h-4 w-4 ${config.color}`} />
                    <span className="text-sm">{test.test}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{test.timestamp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
