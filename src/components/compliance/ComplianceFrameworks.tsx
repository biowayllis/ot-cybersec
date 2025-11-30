import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

export const ComplianceFrameworks = () => {
  const frameworks = [
    {
      id: "nist-csf",
      name: "NIST Cybersecurity Framework",
      version: "v2.0",
      compliance: 92,
      controls: 108,
      passed: 99,
      failed: 9,
      categories: [
        { name: "Identify", compliance: 95 },
        { name: "Protect", compliance: 91 },
        { name: "Detect", compliance: 89 },
        { name: "Respond", compliance: 94 },
        { name: "Recover", compliance: 90 },
      ],
    },
    {
      id: "nist-800-53",
      name: "NIST 800-53",
      version: "Rev 5",
      compliance: 87,
      controls: 245,
      passed: 213,
      failed: 32,
      categories: [
        { name: "Access Control", compliance: 88 },
        { name: "Incident Response", compliance: 92 },
        { name: "System Protection", compliance: 85 },
        { name: "Risk Assessment", compliance: 84 },
      ],
    },
    {
      id: "iec-62443",
      name: "IEC 62443",
      version: "v4.2",
      compliance: 78,
      controls: 167,
      passed: 130,
      failed: 37,
      categories: [
        { name: "Security Levels", compliance: 82 },
        { name: "Zones & Conduits", compliance: 75 },
        { name: "System Security", compliance: 79 },
        { name: "Component Security", compliance: 76 },
      ],
    },
    {
      id: "iso-27001",
      name: "ISO 27001",
      version: "2022",
      compliance: 84,
      controls: 93,
      passed: 78,
      failed: 15,
      categories: [
        { name: "Information Security Policies", compliance: 90 },
        { name: "Access Control", compliance: 86 },
        { name: "Cryptography", compliance: 82 },
        { name: "Operations Security", compliance: 80 },
      ],
    },
    {
      id: "tsa-pipeline",
      name: "TSA Pipeline Security",
      version: "2021",
      compliance: 81,
      controls: 52,
      passed: 42,
      failed: 10,
      categories: [
        { name: "Network Segmentation", compliance: 85 },
        { name: "Access Controls", compliance: 79 },
        { name: "Incident Response", compliance: 80 },
        { name: "Vulnerability Management", compliance: 78 },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Compliance Frameworks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nist-csf" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {frameworks.map((framework) => (
              <TabsTrigger key={framework.id} value={framework.id} className="text-xs">
                {framework.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {frameworks.map((framework) => (
            <TabsContent key={framework.id} value={framework.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{framework.name}</h3>
                  <p className="text-sm text-muted-foreground">{framework.version}</p>
                </div>
                <Badge variant={framework.compliance >= 90 ? "default" : framework.compliance >= 80 ? "secondary" : "destructive"}>
                  {framework.compliance}% Compliant
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Controls</p>
                  <p className="text-2xl font-bold">{framework.controls}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passed</p>
                  <p className="text-2xl font-bold text-safe">{framework.passed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-critical">{framework.failed}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Category Breakdown</h4>
                {framework.categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">{category.compliance}%</span>
                    </div>
                    <Progress value={category.compliance} className="h-2" />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
