import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ComplianceStatus = () => {
  const frameworks = [
    { name: "NIST CSF", compliance: 92 },
    { name: "NIST 800-53", compliance: 87 },
    { name: "IEC 62443", compliance: 78 },
    { name: "NERC CIP", compliance: 85 },
    { name: "TSA Pipeline", compliance: 81 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-safe" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {frameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{framework.name}</span>
                <span className="text-muted-foreground">{framework.compliance}%</span>
              </div>
              <Progress value={framework.compliance} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
